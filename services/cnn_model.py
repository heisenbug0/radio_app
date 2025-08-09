# services/cnn_model.py
import os
import math
import random
import pickle
import numpy as np
import pandas as pd
import cv2
import tensorflow as tf
from tensorflow.keras import layers, models, applications
from tensorflow.keras import mixed_precision
from tensorflow.keras.metrics import TopKCategoricalAccuracy
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure reproducibility helper
def set_seed(seed=42):
    np.random.seed(seed)
    tf.random.set_seed(seed)
    random.seed(seed)

set_seed(42)

# Precision policy: only use mixed_float16 when GPU is present
_gpus = tf.config.list_physical_devices("GPU")
if _gpus:
    try:
        mixed_precision.set_global_policy("mixed_float16")
        # print("Mixed precision enabled (mixed_float16).")
    except Exception:
        pass
else:
    try:
        mixed_precision.set_global_policy("float32")
    except Exception:
        pass
    # print("No GPU detected — using float32 policy (mixed precision disabled).")


class WarmUpCosineDecay(tf.keras.optimizers.schedules.LearningRateSchedule):
    """Graph-safe learning rate schedule with linear warmup followed by cosine decay."""
    def __init__(self, initial_learning_rate, decay_steps, warmup_steps=0, alpha=0.0, name=None):
        super().__init__()
        self.initial_learning_rate = float(initial_learning_rate)
        self.decay_steps = float(decay_steps)
        self.warmup_steps = float(warmup_steps)
        self.alpha = float(alpha)
        self.name = name
        self._pi = tf.constant(math.pi, dtype=tf.float32)

    def __call__(self, step):
        with tf.name_scope(self.name or "WarmUpCosineDecay"):
            step_f = tf.cast(step, tf.float32)

            def _warmup_lr():
                warmup = tf.maximum(tf.cast(self.warmup_steps, tf.float32), 1e-8)
                return tf.cast(self.initial_learning_rate, tf.float32) * (step_f / warmup)

            def _base_lr():
                return tf.cast(self.initial_learning_rate, tf.float32)

            warmup_lr = tf.cond(tf.greater(self.warmup_steps, 0.0), _warmup_lr, _base_lr)

            progress = tf.maximum(0.0, step_f - tf.cast(self.warmup_steps, tf.float32))
            safe_decay_steps = tf.maximum(tf.cast(self.decay_steps, tf.float32), 1.0)
            cosine_decay = 0.5 * (1.0 + tf.math.cos(self._pi * progress / safe_decay_steps))
            decayed = (1.0 - self.alpha) * cosine_decay + self.alpha
            cosine_lr = tf.cast(self.initial_learning_rate, tf.float32) * decayed

            lr = tf.where(step_f < tf.cast(self.warmup_steps, tf.float32), warmup_lr, cosine_lr)
            return tf.maximum(tf.cast(lr, tf.float32), 0.0)

    def get_config(self):
        return {
            "initial_learning_rate": self.initial_learning_rate,
            "decay_steps": self.decay_steps,
            "warmup_steps": self.warmup_steps,
            "alpha": self.alpha,
            "name": self.name,
        }


class EMACallback(tf.keras.callbacks.Callback):
    """EMA (exponential moving average) of model weights using numpy shadow storage."""
    def __init__(self, ema_decay=0.9999):
        super().__init__()
        self.ema_decay = float(ema_decay)
        self.shadow_weights = None
        self.model_weights_backup = None

    def set_model(self, model):
        self.model = model
        self.shadow_weights = [w.copy() for w in self.model.get_weights()]

    def on_train_batch_end(self, batch, logs=None):
        current = self.model.get_weights()
        if self.shadow_weights is None:
            self.shadow_weights = [w.copy() for w in current]
            return
        for i in range(len(current)):
            self.shadow_weights[i] = self.ema_decay * self.shadow_weights[i] + (1.0 - self.ema_decay) * current[i]

    def apply_ema_weights(self):
        self.model_weights_backup = [w.copy() for w in self.model.get_weights()]
        try:
            self.model.set_weights([w.copy() for w in self.shadow_weights])
        except Exception:
            pass

    def restore_original_weights(self):
        if self.model_weights_backup is None:
            return
        try:
            self.model.set_weights(self.model_weights_backup)
        except Exception:
            pass
        self.model_weights_backup = None

    def save_ema_model(self, path):
        self.apply_ema_weights()
        self.model.save(path)
        self.restore_original_weights()


class StochasticDepth(layers.Layer):
    """Stochastic depth/drop-path implemented with TF ops and dtype-safe handling."""
    def __init__(self, drop_prob=0.0, **kwargs):
        super().__init__(**kwargs)
        self.drop_prob = float(drop_prob)

    def call(self, x, training=None):
        if self.drop_prob <= 0.0:
            return x

        if training is None:
            training = tf.keras.backend.learning_phase()

        # If training is a Python bool, avoid tf.cond
        if isinstance(training, (bool, np.bool_)):
            if not training:
                return x
            keep_prob = 1.0 - self.drop_prob
            batch_size = tf.shape(x)[0]
            rank = tf.rank(x)
            mask_shape = tf.concat([[batch_size], tf.ones(rank - 1, dtype=tf.int32)], axis=0)
            rnd = tf.random.uniform(mask_shape, dtype=x.dtype)
            binary_mask = tf.cast(rnd < tf.cast(keep_prob, x.dtype), x.dtype)
            x_scaled = tf.math.divide(x, tf.cast(keep_prob, x.dtype)) * binary_mask
            return x_scaled

        def _do_drop():
            keep_prob = 1.0 - self.drop_prob
            batch_size = tf.shape(x)[0]
            rank = tf.rank(x)
            mask_shape = tf.concat([[batch_size], tf.ones(rank - 1, dtype=tf.int32)], axis=0)
            rnd = tf.random.uniform(mask_shape, dtype=x.dtype)
            binary_mask = tf.cast(rnd < tf.cast(keep_prob, x.dtype), x.dtype)
            x_scaled = tf.math.divide(x, tf.cast(keep_prob, x.dtype)) * binary_mask
            return x_scaled

        def _no_op():
            return x

        training_bool = tf.cast(training, tf.bool)
        return tf.cond(training_bool, _do_drop, _no_op)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"drop_prob": float(self.drop_prob)})
        return cfg


class CNNModelService:
    """
    CNNModelService - flexible training service for product classification.

    __init__ parameters:
      - image_size: tuple, default (299,299)
      - batch_size: int
      - epochs: int (used to compute schedules)
      - debug: bool — if True, uses lighter head and weaker regularization (helps overfit tests)
      - use_mixup: bool — enable mixup augmentation
      - use_cutmix: bool — enable cutmix augmentation (not implemented by default)
      - enable_ema: bool — use EMA callback
    """
    def __init__(self,
                 image_size=(299, 299),
                 batch_size=16,
                 epochs=200,
                 debug=False,
                 use_mixup=False,
                 use_cutmix=False,
                 enable_ema=False):
        self.model = None
        self.label_encoder = LabelEncoder()
        self.class_names = []
        self.image_size = image_size
        self.batch_size = batch_size
        self.epochs = epochs
        self.debug = debug
        self.use_mixup = use_mixup
        self.use_cutmix = use_cutmix
        self.enable_ema = enable_ema

        self.mixup_alpha = 0.2
        self.cutmix_alpha = 1.0

        compute_dtype = tf.as_dtype(mixed_precision.global_policy().compute_dtype)
        # Keep augmentation ops in float32 to avoid missing float16 CPU kernels
        self.data_augmentation = tf.keras.Sequential(
            [
                layers.Lambda(lambda x: tf.cast(x, tf.float32), name="aug_cast_to_float32", dtype=tf.float32),
                layers.RandomFlip("horizontal", dtype=tf.float32),
                layers.RandomRotation(0.05, dtype=tf.float32),
                layers.RandomZoom(0.1, dtype=tf.float32),
                layers.RandomContrast(0.1, dtype=tf.float32),
                layers.Lambda(lambda x, dt=compute_dtype: tf.cast(x, dt), name="aug_cast_back_to_compute_dtype", dtype=compute_dtype),
            ],
            name="data_augmentation",
        )

        # Regularization defaults (tuned later per dataset)
        self.dropout_top = 0.5
        self.dropout_mid = 0.3
        self.dropout_small = 0.2
        self.stochastic_depth_rate = 0.0

    # -------------------------
    # Data loading & preprocessing
    # -------------------------
    def load_and_preprocess_data(self, data_dir, csv_file_path):
        if not os.path.exists(csv_file_path):
            raise ValueError(f"CSV not found: {csv_file_path}")
        df = pd.read_csv(csv_file_path)
        if "StockCode" not in df.columns:
            raise ValueError("CSV must contain 'StockCode' column.")
        # Sort class names to get deterministic mapping
        self.class_names = sorted(df["StockCode"].unique().tolist(), key=lambda x: str(x))
        if not self.class_names:
            raise ValueError("No classes found in CSV.")
        self.label_encoder.fit(self.class_names)

        images = []
        labels = []
        file_index = {}

        # Collect images matching stock code prefix
        for filename in os.listdir(data_dir):
            lower = filename.lower()
            for stock_code in self.class_names:
                sc_str = str(stock_code).lower()
                if lower.startswith(sc_str) and lower.endswith((".jpg", ".jpeg", ".png")):
                    image_path = os.path.join(data_dir, filename)
                    img = self.load_and_preprocess_image(image_path)
                    if img is not None:
                        images.append(img)
                        labels.append(stock_code)
                        file_index.setdefault(stock_code, []).append(filename)
                    break

        if not images:
            raise ValueError("No images found for training. Check filenames and StockCode mapping.")

        if self.debug:
            # show small sample counts for debugging
            print("DEBUG: sample class counts (first 10):")
            for cls in list(self.class_names)[:10]:
                print(f"  {cls}: {len(file_index.get(cls, []))}")

        X = np.array(images, dtype=np.float32)
        y = self.label_encoder.transform(labels).astype(np.int32)
        return X, y

    def load_and_preprocess_image(self, image_path):
        try:
            image = cv2.imread(image_path)
            if image is None:
                return None
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image = self.advanced_preprocessing(image)
            image = cv2.resize(image, self.image_size, interpolation=cv2.INTER_AREA)
            image = image.astype(np.float32) / 255.0
            return image
        except Exception:
            if self.debug:
                print(f"Failed to load image: {image_path}")
            return None

    def advanced_preprocessing(self, image):
        # Wrap operations in try/except to avoid breaking on single image
        try:
            image = cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
        except Exception:
            pass
        try:
            lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            lab[:, :, 0] = clahe.apply(lab[:, :, 0])
            image = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        except Exception:
            pass
        try:
            kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
            image = cv2.filter2D(image, -1, kernel)
        except Exception:
            pass
        return image

    # -------------------------
    # Model creation & tuning
    # -------------------------
    def _tune_regularization_by_dataset(self, num_classes, total_samples, avg_images_per_class):
        if self.debug:
            # make head small and weakly regularized in debug to help overfit tests
            self.dropout_top = 0.05
            self.dropout_mid = 0.02
            self.dropout_small = 0.01
            self.stochastic_depth_rate = 0.0
            return

        if avg_images_per_class < 2 or total_samples < 200:
            self.dropout_top = 0.6
            self.dropout_mid = 0.4
            self.dropout_small = 0.3
            self.stochastic_depth_rate = 0.2
        elif avg_images_per_class < 5 or total_samples < 500:
            self.dropout_top = 0.5
            self.dropout_mid = 0.3
            self.dropout_small = 0.2
            self.stochastic_depth_rate = 0.1
        else:
            self.dropout_top = 0.4
            self.dropout_mid = 0.25
            self.dropout_small = 0.15
            self.stochastic_depth_rate = 0.05

        if num_classes > 200 and avg_images_per_class < 3:
            self.dropout_top = min(0.7, self.dropout_top + 0.05)
            self.stochastic_depth_rate = min(0.3, self.stochastic_depth_rate + 0.05)

    def create_cnn_model(self, num_classes):
        base_model = applications.EfficientNetB3(weights="imagenet", include_top=False, input_shape=(*self.image_size, 3))
        base_model.trainable = False

        inputs = layers.Input(shape=(*self.image_size, 3))
        x = self.data_augmentation(inputs)
        x = base_model(x, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.BatchNormalization()(x)

        if not self.debug:
            x = layers.Dense(1024, activation="relu")(x)
            x = layers.BatchNormalization()(x)
            if self.stochastic_depth_rate > 0:
                x = StochasticDepth(drop_prob=self.stochastic_depth_rate)(x)
            x = layers.Dropout(self.dropout_top)(x)

            x = layers.Dense(512, activation="relu")(x)
            x = layers.BatchNormalization()(x)
            if self.stochastic_depth_rate > 0:
                x = StochasticDepth(drop_prob=self.stochastic_depth_rate * 0.75)(x)
            x = layers.Dropout(self.dropout_mid)(x)

            x = layers.Dense(256, activation="relu")(x)
            x = layers.BatchNormalization()(x)
            if self.stochastic_depth_rate > 0:
                x = StochasticDepth(drop_prob=self.stochastic_depth_rate * 0.5)(x)
            x = layers.Dropout(self.dropout_small)(x)
        else:
            # smaller head for debug/overfit
            x = layers.Dense(256, activation="relu")(x)
            x = layers.BatchNormalization()(x)
            x = layers.Dropout(0.05)(x)
            x = layers.Dense(128, activation="relu")(x)
            x = layers.BatchNormalization()(x)

        outputs = layers.Dense(num_classes, activation="softmax", dtype="float32")(x)
        model = models.Model(inputs=inputs, outputs=outputs, name="EfficientNetB3_CustomHead")
        return model, base_model

    # -------------------------
    # Mixup (optional)
    # -------------------------
    def _mixup(self, images, labels):
        batch_size = tf.shape(images)[0]
        indices = tf.random.shuffle(tf.range(batch_size))
        shuffled_images = tf.gather(images, indices)
        shuffled_labels = tf.gather(labels, indices)
        lam = tf.random.gamma(shape=(batch_size, 1, 1, 1), alpha=self.mixup_alpha)
        lam = lam / (lam + tf.random.gamma(shape=(batch_size, 1, 1, 1), alpha=self.mixup_alpha))
        lam_labels = tf.reshape(lam[:, 0, 0, 0], (-1, 1))
        mixed_images = lam * images + (1.0 - lam) * shuffled_images
        mixed_labels = lam_labels * labels + (1.0 - lam_labels) * shuffled_labels
        return mixed_images, mixed_labels

    def _apply_mix_augment(self, images, labels):
        if self.use_mixup:
            return self._mixup(images, labels)
        # cutmix is not implemented in this minimal path
        return images, labels

    # -------------------------
    # Training entrypoint
    # -------------------------
    def train_model(self, data_dir, csv_file_path, warmup_epochs=10, ema_decay=0.9999):
        print("Starting training...")

        X, y = self.load_and_preprocess_data(data_dir, csv_file_path)

        total_samples = len(X)
        num_classes = len(self.class_names)
        avg_images_per_class = total_samples / num_classes if num_classes > 0 else 0.0

        print(f"Total samples: {total_samples}")
        print(f"Number of classes: {num_classes}")
        print(f"Average images per class: {avg_images_per_class:.2f}")

        self._tune_regularization_by_dataset(num_classes, total_samples, avg_images_per_class)

        test_size = 0.2
        stratify = y if len(np.unique(y)) > 1 else None

        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=test_size, random_state=42, stratify=stratify)
        print(f"Training samples: {len(X_train)}, Validation samples: {len(X_val)}")

        self.model, base_model = self.create_cnn_model(num_classes)

        steps_per_epoch = max(1, int(np.ceil(len(X_train) / float(self.batch_size))))
        decay_steps = max(1, steps_per_epoch * max(50, int(self.epochs // 2)))
        warmup_steps = max(0, warmup_epochs * steps_per_epoch)

        # Conservative LR defaults
        base_lr = 1e-4 if not self.debug else 5e-4
        lr_schedule_phase1 = WarmUpCosineDecay(initial_learning_rate=base_lr, decay_steps=decay_steps, warmup_steps=warmup_steps, alpha=0.1)
        optimizer_phase1 = tf.keras.optimizers.AdamW(learning_rate=lr_schedule_phase1, weight_decay=1e-6 if not self.debug else 0.0, clipnorm=1.0)

        label_smoothing_phase1 = 0.0 if not self.debug else 0.0

        self.model.compile(
            optimizer=optimizer_phase1,
            loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=label_smoothing_phase1),
            metrics=["accuracy", TopKCategoricalAccuracy(k=3, name="top3_acc")],
        )

        self.model.summary()

        callbacks = []
        if self.enable_ema:
            callbacks.append(EMACallback(ema_decay=ema_decay))
        callbacks += [
            tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=15 if not self.debug else 50, restore_best_weights=True, verbose=1),
            tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=8 if not self.debug else 20, min_lr=1e-7, verbose=1),
            tf.keras.callbacks.ModelCheckpoint("models/best_model.keras", monitor="val_accuracy", save_best_only=True, verbose=1),
        ]

        # Prepare datasets (augmentation in-model)
        y_train_oh = tf.one_hot(y_train, depth=num_classes, dtype=tf.float32)
        y_val_oh = tf.one_hot(y_val, depth=num_classes, dtype=tf.float32)

        AUTOTUNE = tf.data.AUTOTUNE
        ds_train = tf.data.Dataset.from_tensor_slices((X_train, y_train_oh))
        ds_train = ds_train.shuffle(buffer_size=len(X_train), seed=42).batch(self.batch_size)

        if self.use_mixup or self.use_cutmix:
            ds_train = ds_train.map(
                lambda im, lb: tf.py_function(func=lambda a, b: self._apply_mix_augment(a, b), inp=[im, lb], Tout=[tf.float32, tf.float32]),
                num_parallel_calls=AUTOTUNE
            )

        ds_train = ds_train.prefetch(AUTOTUNE)
        ds_val = tf.data.Dataset.from_tensor_slices((X_val, y_val_oh)).batch(self.batch_size).prefetch(AUTOTUNE)

        # Phase 1
        history1 = self.model.fit(ds_train, validation_data=ds_val, epochs=50 if not self.debug else 200, callbacks=callbacks, verbose=1)

        # Phase 2: fine-tune base
        base_model.trainable = True
        base_lr_ft = 1e-5 if not self.debug else 1e-4
        decay_steps_ft = max(1, steps_per_epoch * max(100, int(self.epochs // 2)))
        lr_schedule_phase2 = WarmUpCosineDecay(initial_learning_rate=base_lr_ft, decay_steps=decay_steps_ft, warmup_steps=warmup_steps, alpha=0.2)
        optimizer_phase2 = tf.keras.optimizers.AdamW(learning_rate=lr_schedule_phase2, weight_decay=5e-7 if not self.debug else 0.0, clipnorm=1.0)

        self.model.compile(
            optimizer=optimizer_phase2,
            loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.01 if not self.debug else 0.0),
            metrics=["accuracy", TopKCategoricalAccuracy(k=3, name="top3_acc")],
        )

        history2 = self.model.fit(ds_train, validation_data=ds_val, epochs=100 if not self.debug else 200, callbacks=callbacks, verbose=1)

        # Save model and optional EMA snapshot
        self.save_model()
        if self.enable_ema:
            try:
                for cb in callbacks:
                    if isinstance(cb, EMACallback):
                        cb.save_ema_model("models/product_cnn_model_ema.keras")
                        break
            except Exception:
                pass

        # Final evaluation and plots
        self.evaluate_model(X_val, y_val)
        self.plot_training_history(history1, history2)
        return history2

    # -------------------------
    # Overfit test (debugging)
    # -------------------------
    def overfit_test(self, data_dir, csv_file_path, per_class=5, epochs=200):
        """
        Quick overfit test: pick up to `per_class` images per class and train a small model
        to confirm label/preprocessing pipeline.
        """
        print("Running overfit test (debug mode).")
        # Force debug mode for overfit
        self.debug = True

        df = pd.read_csv(csv_file_path)
        if "StockCode" not in df.columns:
            raise ValueError("CSV must contain 'StockCode' column.")
        self.class_names = sorted(df["StockCode"].unique().tolist(), key=lambda x: str(x))
        self.label_encoder.fit(self.class_names)

        # collect files per class
        files = {cls: [] for cls in self.class_names}
        for filename in os.listdir(data_dir):
            lower = filename.lower()
            for cls in self.class_names:
                if lower.startswith(str(cls).lower()) and lower.endswith((".jpg", ".jpeg", ".png")):
                    files[cls].append(os.path.join(data_dir, filename))
                    break

        selected_images = []
        selected_labels = []
        for cls in self.class_names:
            picked = files.get(cls, [])[:per_class]
            for p in picked:
                img = self.load_and_preprocess_image(p)
                if img is not None:
                    selected_images.append(img)
                    selected_labels.append(cls)

        if not selected_images:
            raise ValueError("Overfit test: no images collected. Check filenames & StockCode mapping.")

        X = np.array(selected_images, dtype=np.float32)
        y = self.label_encoder.transform(selected_labels).astype(np.int32)

        print(f"Overfit dataset size: {len(X)} samples, classes included: {len(np.unique(y))}")

        # Create dataset and small model
        num_classes = len(self.class_names)
        y_oh = tf.one_hot(y, depth=num_classes, dtype=tf.float32)
        batch = max(1, min(len(X), 8))
        ds = tf.data.Dataset.from_tensor_slices((X, y_oh)).shuffle(len(X)).batch(batch).prefetch(tf.data.AUTOTUNE)

        # Small model
        self.model, _ = self.create_cnn_model(num_classes)
        optimizer = tf.keras.optimizers.Adam(learning_rate=1e-3)
        self.model.compile(optimizer=optimizer, loss=tf.keras.losses.CategoricalCrossentropy(), metrics=["accuracy"])
        history = self.model.fit(ds, epochs=epochs, verbose=1)
        print("Overfit test complete. If training accuracy did not reach ~100%, inspect labels/preprocessing.")

    # -------------------------
    # Evaluation & utils
    # -------------------------
    def evaluate_model(self, X_val, y_val):
        print("\n=== Model Evaluation ===")
        y_pred = self.model.predict(X_val, batch_size=self.batch_size)
        y_pred_classes = np.argmax(y_pred, axis=1)
        accuracy = np.mean(y_pred_classes == y_val)
        top_3_accuracy = self.top_k_accuracy(y_pred, y_val, k=3)
        print(f"Validation Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        print(f"Top-3 Accuracy: {top_3_accuracy:.4f} ({top_3_accuracy*100:.2f}%)")
        print("\nClassification Report:")
        print(classification_report(y_val, y_pred_classes, target_names=self.class_names, zero_division=0))
        self.plot_confusion_matrix(y_val, y_pred_classes)
        return accuracy

    def top_k_accuracy(self, y_pred, y_true, k=3):
        top_k_indices = np.argsort(y_pred, axis=1)[:, -k:]
        correct = 0
        for i, true_label in enumerate(y_true):
            if true_label in top_k_indices[i]:
                correct += 1
        return correct / len(y_true) if len(y_true) > 0 else 0.0

    def plot_confusion_matrix(self, y_true, y_pred):
        cm = confusion_matrix(y_true, y_pred)
        plt.figure(figsize=(12, 10))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=self.class_names, yticklabels=self.class_names)
        plt.title("Confusion Matrix")
        plt.xlabel("Predicted")
        plt.ylabel("True")
        plt.xticks(rotation=45)
        plt.yticks(rotation=0)
        plt.tight_layout()
        os.makedirs("models", exist_ok=True)
        plt.savefig("models/confusion_matrix.png", dpi=300, bbox_inches="tight")
        plt.show()

    def plot_training_history(self, history1, history2):
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        axes[0, 0].plot(history1.history.get("accuracy", []), label="Train")
        axes[0, 0].plot(history1.history.get("val_accuracy", []), label="Validation")
        axes[0, 0].set_title("Phase 1: Accuracy")
        axes[0, 0].legend()
        axes[0, 1].plot(history1.history.get("loss", []), label="Train")
        axes[0, 1].plot(history1.history.get("val_loss", []), label="Validation")
        axes[0, 1].set_title("Phase 1: Loss")
        axes[0, 1].legend()
        axes[1, 0].plot(history2.history.get("accuracy", []), label="Train")
        axes[1, 0].plot(history2.history.get("val_accuracy", []), label="Validation")
        axes[1, 0].set_title("Phase 2: Accuracy")
        axes[1, 0].legend()
        axes[1, 1].plot(history2.history.get("loss", []), label="Train")
        axes[1, 1].plot(history2.history.get("val_loss", []), label="Validation")
        axes[1, 1].set_title("Phase 2: Loss")
        axes[1, 1].legend()
        plt.tight_layout()
        os.makedirs("models", exist_ok=True)
        plt.savefig("models/training_history.png", dpi=300, bbox_inches="tight")
        plt.show()

    def save_model(self):
        model_dir = "models"
        os.makedirs(model_dir, exist_ok=True)
        self.model.save(os.path.join(model_dir, "product_cnn_model.keras"))
        with open(os.path.join(model_dir, "label_encoder.pkl"), "wb") as f:
            pickle.dump(self.label_encoder, f)
        with open(os.path.join(model_dir, "class_names.txt"), "w") as f:
            for cn in self.class_names:
                f.write(f"{cn}\n")
        print(f"Model saved to {model_dir}/")

    def load_model(self):
        model_dir = "models"
        self.model = tf.keras.models.load_model(os.path.join(model_dir, "product_cnn_model.keras"),
                                                custom_objects={"StochasticDepth": StochasticDepth})
        with open(os.path.join(model_dir, "label_encoder.pkl"), "rb") as f:
            self.label_encoder = pickle.load(f)
        with open(os.path.join(model_dir, "class_names.txt"), "r") as f:
            self.class_names = [line.strip() for line in f.readlines()]
        print("Model loaded successfully")

    def predict_product(self, image_path):
        if self.model is None:
            self.load_model()
        image = self.load_and_preprocess_image(image_path)
        if image is None:
            return None
        image = np.expand_dims(image, axis=0).astype(np.float32)
        predictions = self.model.predict(image)
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class])
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_3_predictions = [{"class": self.class_names[idx], "confidence": float(predictions[0][idx])} for idx in top_3_indices]
        return {"predicted_class": self.class_names[predicted_class], "confidence": confidence, "top_3_predictions": top_3_predictions}
