import tensorflow as tf
from tensorflow.keras import layers, models, applications
from tensorflow.keras import mixed_precision
from tensorflow.keras.metrics import TopKCategoricalAccuracy
import numpy as np
import pandas as pd
import os
import cv2
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
import math
import pickle

# Enable mixed precision if available
try:
    mixed_precision.set_global_policy('mixed_float16')
except Exception:
    pass


class WarmUpCosineDecay(tf.keras.optimizers.schedules.LearningRateSchedule):
    """
    Graph-safe learning rate schedule with linear warmup followed by cosine decay.
    Uses TF ops in __call__ so it works in graph mode.
    """
    def __init__(self, initial_learning_rate, decay_steps, warmup_steps=0, alpha=0.0, name=None):
        super().__init__()
        self.initial_learning_rate = float(initial_learning_rate)
        self.decay_steps = tf.cast(decay_steps, tf.float32)
        self.warmup_steps = tf.cast(warmup_steps, tf.float32)
        self.alpha = float(alpha)
        self.name = name
        self._pi = tf.constant(math.pi, dtype=tf.float32)

    def __call__(self, step):
        with tf.name_scope(self.name or "WarmUpCosineDecay"):
            step = tf.cast(step, tf.float32)

            def _warmup_lr():
                return tf.cast(self.initial_learning_rate, tf.float32) * (step / self.warmup_steps)

            def _base_lr():
                return tf.cast(self.initial_learning_rate, tf.float32)

            warmup_lr = tf.cond(self.warmup_steps > 0.0, _warmup_lr, _base_lr)

            progress = tf.maximum(0.0, step - self.warmup_steps)
            safe_decay_steps = tf.maximum(self.decay_steps, 1.0)
            cosine_decay = 0.5 * (1.0 + tf.math.cos(self._pi * progress / safe_decay_steps))
            decayed = (1.0 - self.alpha) * cosine_decay + self.alpha
            cosine_lr = tf.cast(self.initial_learning_rate, tf.float32) * decayed

            return tf.where(step < self.warmup_steps, warmup_lr, cosine_lr)

    def get_config(self):
        return {
            "initial_learning_rate": self.initial_learning_rate,
            "decay_steps": float(self.decay_steps.numpy()) if isinstance(self.decay_steps, tf.Variable) else float(self.decay_steps),
            "warmup_steps": float(self.warmup_steps.numpy()) if isinstance(self.warmup_steps, tf.Variable) else float(self.warmup_steps),
            "alpha": self.alpha,
            "name": self.name
        }


class EMACallback(tf.keras.callbacks.Callback):
    """
    Exponential Moving Average callback to maintain shadow weights.
    Allows swapping to EMA weights for evaluation or saving.
    """
    def __init__(self, ema_decay=0.9999):
        super().__init__()
        self.ema_decay = float(ema_decay)
        self.shadow_weights = None
        self.model_weights_backup = None

    def set_model(self, model):
        self.model = model
        # Initialize shadow weights on first set_model call
        self.shadow_weights = [w.numpy().copy() for w in self.model.weights]

    def on_train_batch_end(self, batch, logs=None):
        # Update shadow weights
        for i, w in enumerate(self.model.weights):
            new_w = w.numpy()
            self.shadow_weights[i] = self.ema_decay * self.shadow_weights[i] + (1.0 - self.ema_decay) * new_w

    def apply_ema_weights(self):
        # Backup current weights and replace with EMA weights
        self.model_weights_backup = [w.numpy().copy() for w in self.model.weights]
        for i, w in enumerate(self.model.weights):
            try:
                w.assign(self.shadow_weights[i])
            except Exception:
                # In case of read-only or mismatch, skip
                pass

    def restore_original_weights(self):
        if self.model_weights_backup is None:
            return
        for i, w in enumerate(self.model.weights):
            try:
                w.assign(self.model_weights_backup[i])
            except Exception:
                pass
        self.model_weights_backup = None

    def save_ema_model(self, path):
        # Apply EMA, save model, then restore
        self.apply_ema_weights()
        self.model.save(path)
        self.restore_original_weights()


class StochasticDepth(layers.Layer):
    """
    Stochastic Depth (drop path) that is dtype-safe and graph/eager-safe.

    Behavior:
      - If `training` is a Python bool: behave accordingly without using tf.cond (avoids 'pred must not be a Python bool').
      - If `training` is a TF tensor (graph mode), use tf.cond with a tensor predicate.
    """
    def __init__(self, drop_prob=0.0, **kwargs):
        super().__init__(**kwargs)
        # store as float32 tensor for graph ops
        self.drop_prob = tf.cast(drop_prob, tf.float32)

    def call(self, x, training=None):
        # Helper: actual drop implementation using TF ops (returns tensor)
        def _do_drop():
            keep_prob = 1.0 - self.drop_prob
            # cast keep_prob to x.dtype for stable comparison
            keep_prob_cast = tf.cast(keep_prob, x.dtype)

            batch_size = tf.shape(x)[0]
            rank = tf.rank(x)
            mask_shape = tf.concat([[batch_size], tf.ones(rank - 1, dtype=tf.int32)], axis=0)

            # random tensor in same dtype as x to avoid mixed-dtype comparison errors
            random_tensor = tf.random.uniform(mask_shape, dtype=x.dtype)
            binary_tensor = tf.cast(random_tensor < keep_prob_cast, x.dtype)

            # scale to preserve expectation (avoid division by zero since keep_prob > 0 for valid drop_prob)
            x_scaled = tf.math.divide(x, tf.cast(keep_prob, x.dtype)) * binary_tensor
            return x_scaled

        def _no_op():
            return x

        # Resolve training flag:
        if training is None:
            training = tf.keras.backend.learning_phase()

        # If user passed Python bool (e.g., True), avoid tf.cond with Python bool
        if isinstance(training, (bool, np.bool_)):
            if not training or float(self.drop_prob) == 0.0:
                return x
            return _do_drop()

        # Otherwise training is a tensor (graph mode). Ensure predicate is boolean tensor.
        training_bool = tf.cast(training, tf.bool)
        drop_zero = tf.equal(self.drop_prob, 0.0)
        return tf.cond(tf.logical_or(tf.logical_not(training_bool), drop_zero), _no_op, _do_drop)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"drop_prob": float(self.drop_prob.numpy()) if isinstance(self.drop_prob, tf.Variable) else float(self.drop_prob)})
        return cfg


class CNNModelService:
    def __init__(self):
        self.model = None
        self.label_encoder = LabelEncoder()
        self.class_names = []
        self.image_size = (299, 299)  # Larger images for better accuracy
        self.batch_size = 16  # Smaller batch size for better generalization
        self.epochs = 200  # More epochs for convergence
        self.mixup_alpha = 0.2
        self.cutmix_alpha = 1.0

        # Build data augmentation but force augmentation ops to run in float32 to avoid missing kernels on CPU
        # Many TF preprocessing ops (RandomContrast, etc.) do not have float16 CPU kernels.
        compute_dtype = tf.as_dtype(mixed_precision.global_policy().compute_dtype)
        self.data_augmentation = tf.keras.Sequential([
            layers.Lambda(lambda x: tf.cast(x, tf.float32), name="aug_cast_to_float32", dtype=tf.float32),
            layers.RandomFlip("horizontal", dtype=tf.float32),
            layers.RandomRotation(0.05, dtype=tf.float32),
            layers.RandomZoom(0.1, dtype=tf.float32),
            layers.RandomContrast(0.1, dtype=tf.float32),
            layers.Lambda(lambda x, dt=compute_dtype: tf.cast(x, dt), name="aug_cast_back_to_compute_dtype", dtype=compute_dtype),
        ], name="data_augmentation")

        # Hyperparameters that can be tuned based on dataset size
        self.dropout_top = 0.5
        self.dropout_mid = 0.3
        self.dropout_small = 0.2
        self.stochastic_depth_rate = 0.0  # 0 => disabled

    def load_and_preprocess_data(self, data_dir, csv_file_path):
        """Load and preprocess image data with advanced techniques"""
        print("Loading and preprocessing data with advanced techniques...")

        # Read the CSV file to get product classes
        df = pd.read_csv(csv_file_path)
        self.class_names = df['StockCode'].unique().tolist()

        # Encode labels
        self.label_encoder.fit(self.class_names)

        # Load images and labels
        images = []
        labels = []

        for stock_code in self.class_names:
            # Look for images with this stock code
            for filename in os.listdir(data_dir):
                if filename.startswith(str(stock_code)) and filename.endswith(('.jpg', '.jpeg', '.png')):
                    try:
                        image_path = os.path.join(data_dir, filename)
                        image = self.load_and_preprocess_image(image_path)

                        if image is not None:
                            images.append(image)
                            labels.append(stock_code)
                    except Exception as e:
                        print(f"Error loading image {filename}: {e}")

        if not images:
            raise ValueError("No images found for training")

        # Convert to numpy arrays
        X = np.array(images)
        y = self.label_encoder.transform(labels)

        print(f"Loaded {len(images)} images for {len(self.class_names)} classes")
        print(f"Average images per class: {len(images) / len(self.class_names):.1f}")

        return X, y

    def load_and_preprocess_image(self, image_path):
        """Load and preprocess a single image with advanced techniques"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return None

            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Advanced preprocessing
            image = self.advanced_preprocessing(image)

            # Resize image
            image = cv2.resize(image, self.image_size)

            # Normalize pixel values (ImageNet normalization for transfer learning)
            image = image.astype(np.float32) / 255.0

            return image

        except Exception as e:
            print(f"Error preprocessing image {image_path}: {e}")
            return None

    def advanced_preprocessing(self, image):
        """Advanced image preprocessing techniques"""
        # Remove noise
        image = cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)

        # Enhance contrast using CLAHE
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        lab[:, :, 0] = clahe.apply(lab[:, :, 0])
        image = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)

        # Sharpen image
        kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        image = cv2.filter2D(image, -1, kernel)

        return image

    def _tune_regularization_by_dataset(self, num_classes, total_samples, avg_images_per_class):
        """
        Adjust dropout and stochastic depth based on dataset size.
        Heuristics:
         - Very small datasets => stronger regularization (higher dropout, higher drop path)
         - Medium datasets => moderate regularization
         - Large datasets => lighter regularization
        """
        print("\nTuning regularization based on dataset characteristics...")
        print(f"  num_classes: {num_classes}, total_samples: {total_samples}, avg_images_per_class: {avg_images_per_class:.2f}")

        # Default baseline
        if avg_images_per_class < 2 or total_samples < 200:
            # strong regularization
            self.dropout_top = 0.6
            self.dropout_mid = 0.4
            self.dropout_small = 0.3
            self.stochastic_depth_rate = 0.2
        elif avg_images_per_class < 5 or total_samples < 500:
            # moderate regularization
            self.dropout_top = 0.5
            self.dropout_mid = 0.3
            self.dropout_small = 0.2
            self.stochastic_depth_rate = 0.1
        else:
            # light regularization
            self.dropout_top = 0.4
            self.dropout_mid = 0.25
            self.dropout_small = 0.15
            self.stochastic_depth_rate = 0.05

        # If classes are many with few samples, increase regularization
        if num_classes > 200 and avg_images_per_class < 3:
            self.dropout_top = min(0.7, self.dropout_top + 0.05)
            self.stochastic_depth_rate = min(0.3, self.stochastic_depth_rate + 0.05)

        print(f"  dropout_top: {self.dropout_top}, dropout_mid: {self.dropout_mid}, dropout_small: {self.dropout_small}, stochastic_depth_rate: {self.stochastic_depth_rate}")

    def create_cnn_model(self, num_classes):
        """Create a high-accuracy transfer learning model using EfficientNetB3 and tuned regularization"""
        # Use EfficientNetB3 for better accuracy
        base_model = applications.EfficientNetB3(
            weights='imagenet',
            include_top=False,
            input_shape=(*self.image_size, 3)
        )

        # Freeze the base model initially
        base_model.trainable = False

        # Build classifier head with tuned dropout and optional stochastic depth
        inputs = layers.Input(shape=(*self.image_size, 3))
        x = self.data_augmentation(inputs)
        x = base_model(x, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.BatchNormalization()(x)

        # Dense block 1
        x = layers.Dense(1024, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        if self.stochastic_depth_rate > 0:
            x = StochasticDepth(drop_prob=self.stochastic_depth_rate)(x)
        x = layers.Dropout(self.dropout_top)(x)

        # Dense block 2
        x = layers.Dense(512, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        if self.stochastic_depth_rate > 0:
            # stagger drop probability
            x = StochasticDepth(drop_prob=self.stochastic_depth_rate * 0.75)(x)
        x = layers.Dropout(self.dropout_mid)(x)

        # Dense block 3
        x = layers.Dense(256, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        if self.stochastic_depth_rate > 0:
            x = StochasticDepth(drop_prob=self.stochastic_depth_rate * 0.5)(x)
        x = layers.Dropout(self.dropout_small)(x)

        # Output layer (force float32 to avoid metric/CE issues under mixed precision)
        outputs = layers.Dense(num_classes, activation='softmax', dtype='float32')(x)

        model = models.Model(inputs=inputs, outputs=outputs, name="EfficientNetB3_CustomHead")
        return model, base_model

    def train_model(self, data_dir, csv_file_path, warmup_epochs=5, ema_decay=0.9999):
        """Train the high-accuracy CNN model with warmup, EMA, and tuned regularization"""
        print("Starting High-Accuracy CNN model training...")
        print("Target: 90%+ accuracy (dataset dependent)")

        # Load and preprocess data
        X, y = self.load_and_preprocess_data(data_dir, csv_file_path)

        # Dataset stats
        total_samples = len(X)
        num_classes = len(self.class_names)
        avg_images_per_class = total_samples / num_classes if num_classes > 0 else 0.0

        print(f"Total samples: {total_samples}")
        print(f"Number of classes: {num_classes}")
        print(f"Average images per class: {avg_images_per_class:.2f}")

        # Tune dropout / stochastic depth by dataset
        self._tune_regularization_by_dataset(num_classes, total_samples, avg_images_per_class)

        # Use stratified split for better representation
        test_size = 0.2
        stratify = y

        print(f"Using validation split: {test_size:.1%}")
        print(f"Stratified splitting: {stratify is not None}")

        # Split data into train and validation sets
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=stratify
        )

        print(f"Training samples: {len(X_train)}")
        print(f"Validation samples: {len(X_val)}")

        # Create transfer learning model
        num_classes = len(self.class_names)
        self.model, base_model = self.create_cnn_model(num_classes)

        # Compile model with Warmup + Cosine LR schedule and AdamW
        steps_per_epoch = max(1, int(np.ceil(len(X_train) / float(self.batch_size))))
        decay_steps = steps_per_epoch * max(50, int(self.epochs // 2))

        # Warmup steps = warmup_epochs * steps_per_epoch
        warmup_steps = warmup_epochs * steps_per_epoch
        print(f"Using warmup for first {warmup_epochs} epochs ({warmup_steps} steps).")

        base_lr = 1e-3
        lr_schedule_phase1 = WarmUpCosineDecay(initial_learning_rate=base_lr,
                                               decay_steps=decay_steps,
                                               warmup_steps=warmup_steps,
                                               alpha=0.1)

        optimizer_phase1 = tf.keras.optimizers.AdamW(learning_rate=lr_schedule_phase1,
                                                     weight_decay=1e-5,
                                                     clipnorm=1.0)

        self.model.compile(
            optimizer=optimizer_phase1,
            loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
            metrics=['accuracy', TopKCategoricalAccuracy(k=3, name='top3_acc')]
        )

        # Print model summary
        self.model.summary()

        # Callbacks: EarlyStopping, ReduceLROnPlateau, ModelCheckpoint, EMA
        ema_cb = EMACallback(ema_decay=ema_decay)
        callbacks = [
            ema_cb,
            tf.keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=30,
                restore_best_weights=True,
                verbose=1
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=15,
                min_lr=1e-7,
                verbose=1
            ),
            tf.keras.callbacks.ModelCheckpoint(
                'models/best_model.h5',
                monitor='val_accuracy',
                save_best_only=True,
                verbose=1
            )
        ]

        # Build tf.data pipelines with MixUp/CutMix for training
        def to_one_hot(labels_int: np.ndarray) -> tf.Tensor:
            return tf.one_hot(labels_int, depth=num_classes)

        y_train_oh = to_one_hot(y_train)
        y_val_oh = to_one_hot(y_val)

        AUTOTUNE = tf.data.AUTOTUNE

        def sample_beta(alpha: float, shape: tuple):
            # Use Beta via Gamma sampling for better portability
            gamma1 = tf.random.gamma(shape, alpha, 1.0)
            gamma2 = tf.random.gamma(shape, alpha, 1.0)
            lam = gamma1 / (gamma1 + gamma2)
            return lam

        def apply_mixup(images, labels):
            batch_size = tf.shape(images)[0]
            indices = tf.random.shuffle(tf.range(batch_size))
            shuffled_images = tf.gather(images, indices)
            shuffled_labels = tf.gather(labels, indices)
            lam = sample_beta(self.mixup_alpha, (batch_size, 1, 1, 1))
            lam_labels = tf.reshape(lam[:, 0, 0, 0], (-1, 1))
            mixed_images = lam * images + (1.0 - lam) * shuffled_images
            mixed_labels = lam_labels * labels + (1.0 - lam_labels) * shuffled_labels
            return mixed_images, mixed_labels

        def apply_cutmix(images, labels):
            batch_size = tf.shape(images)[0]
            indices = tf.random.shuffle(tf.range(batch_size))
            shuffled_images = tf.gather(images, indices)
            shuffled_labels = tf.gather(labels, indices)

            imgs_h = tf.shape(images)[1]
            imgs_w = tf.shape(images)[2]

            # lam is float32 shape (batch,)
            lam = sample_beta(self.cutmix_alpha, (batch_size,))  # (B,)

            cut_rat = tf.sqrt(1.0 - lam)
            # compute cut sizes as float then cast to int
            cut_w = tf.cast(tf.cast(imgs_w, tf.float32) * cut_rat, tf.int32)
            cut_h = tf.cast(tf.cast(imgs_h, tf.float32) * cut_rat, tf.int32)

            # Uniform center (float)
            cx = tf.random.uniform((batch_size,), minval=0.0, maxval=tf.cast(imgs_w, tf.float32))
            cy = tf.random.uniform((batch_size,), minval=0.0, maxval=tf.cast(imgs_h, tf.float32))

            # Compute x1,y1 as floats then cast to int, ensuring consistent dtypes
            cut_w_f = tf.cast(cut_w, tf.float32)
            cut_h_f = tf.cast(cut_h, tf.float32)

            x1_f = cx - cut_w_f / 2.0
            y1_f = cy - cut_h_f / 2.0

            x1 = tf.cast(tf.math.floor(x1_f), tf.int32)
            y1 = tf.cast(tf.math.floor(y1_f), tf.int32)

            # Clip to valid ranges
            x1 = tf.clip_by_value(x1, 0, imgs_w - 1)
            y1 = tf.clip_by_value(y1, 0, imgs_h - 1)

            x2 = x1 + cut_w
            y2 = y1 + cut_h

            # Ensure x2/y2 inside bounds
            x2 = tf.clip_by_value(x2, 0, imgs_w)
            y2 = tf.clip_by_value(y2, 0, imgs_h)

            # Create binary masks per sample using padded ones (avoids meshgrid scatter issues)
            def make_mask(i):
                yi1 = y1[i]
                yi2 = y2[i]
                xi1 = x1[i]
                xi2 = x2[i]
                hi = yi2 - yi1
                wi = xi2 - xi1

                def make_valid():
                    # ones block of shape (hi, wi, 1)
                    ones = tf.ones((hi, wi, 1), dtype=images.dtype)
                    paddings = [[yi1, imgs_h - yi2], [xi1, imgs_w - xi2], [0, 0]]
                    return tf.pad(ones, paddings, "CONSTANT", constant_values=0.0)

                # if hi or wi <= 0, return zeros mask
                return tf.cond((hi > 0) & (wi > 0), make_valid, lambda: tf.zeros((imgs_h, imgs_w, 1), dtype=images.dtype))

            masks = tf.map_fn(make_mask, tf.range(batch_size), dtype=images.dtype)
            mixed_images = images * (1.0 - masks) + shuffled_images * masks

            box_area = tf.cast((x2 - x1) * (y2 - y1), tf.float32)
            lam_adjusted = 1.0 - (box_area / tf.cast(imgs_h * imgs_w, tf.float32))
            lam_adjusted = tf.reshape(lam_adjusted, (-1, 1))
            mixed_labels = lam_adjusted * labels + (1.0 - lam_adjusted) * shuffled_labels
            return mixed_images, mixed_labels

        def mixup_cutmix_map(images, labels):
            # Only apply if batch has more than 1 element
            batch_size = tf.shape(images)[0]

            def no_aug():
                return images, labels

            def do_aug():
                # 50/50 MixUp vs CutMix
                use_mixup = tf.random.uniform(()) < 0.5
                return tf.cond(use_mixup,
                               lambda: apply_mixup(images, labels),
                               lambda: apply_cutmix(images, labels))
            return tf.cond(batch_size > 1, do_aug, no_aug)

        ds_train = (
            tf.data.Dataset.from_tensor_slices((X_train, y_train_oh))
            .shuffle(buffer_size=len(X_train))
            .batch(self.batch_size)
            .map(mixup_cutmix_map, num_parallel_calls=AUTOTUNE)
            .prefetch(AUTOTUNE)
        )

        ds_val = (
            tf.data.Dataset.from_tensor_slices((X_val, y_val_oh))
            .batch(self.batch_size)
            .prefetch(AUTOTUNE)
        )

        # Phase 1: Train with frozen base model
        print("\n=== Phase 1: Training with frozen base model ===")
        # Compute class weights to handle imbalance
        class_counts = np.bincount(y_train)
        class_counts = np.where(class_counts == 0, 1, class_counts)
        class_weights = {cls: float(len(y_train)) / (len(class_counts) * count) for cls, count in enumerate(class_counts)}

        history1 = self.model.fit(
            ds_train,
            validation_data=ds_val,
            epochs=50,
            callbacks=callbacks,
            verbose=1,
            class_weight=class_weights
        )

        # Phase 2: Fine-tune the base model
        print("\n=== Phase 2: Fine-tuning base model ===")
        base_model.trainable = True

        # Use a lower Warmup+Cosine LR for fine-tuning
        base_lr_ft = 1e-4
        decay_steps_ft = steps_per_epoch * max(100, int(self.epochs // 2))
        warmup_steps_ft = warmup_epochs * steps_per_epoch
        lr_schedule_phase2 = WarmUpCosineDecay(initial_learning_rate=base_lr_ft,
                                               decay_steps=decay_steps_ft,
                                               warmup_steps=warmup_steps_ft,
                                               alpha=0.2)
        optimizer_phase2 = tf.keras.optimizers.AdamW(learning_rate=lr_schedule_phase2,
                                                     weight_decay=5e-6,
                                                     clipnorm=1.0)

        self.model.compile(
            optimizer=optimizer_phase2,
            loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.05),
            metrics=['accuracy', TopKCategoricalAccuracy(k=3, name='top3_acc')]
        )

        history2 = self.model.fit(
            ds_train,
            validation_data=ds_val,
            epochs=100,
            callbacks=callbacks,
            verbose=1,
            class_weight=class_weights
        )

        # Save the model (regular weights)
        self.save_model()

        # Use EMA weights for final evaluation if EMA callback present
        try:
            # Find ema callback in callbacks list
            found_ema = None
            for cb in callbacks:
                if isinstance(cb, EMACallback):
                    found_ema = cb
                    break
            if found_ema is not None:
                print("\nApplying EMA weights for final evaluation and saving EMA model...")
                ema_model_path = "models/product_cnn_model_ema.h5"
                found_ema.save_ema_model(ema_model_path)
                print(f"EMA model saved to {ema_model_path}")
            else:
                print("No EMA callback found; skipping EMA save/eval.")
        except Exception as e:
            print(f"Error applying EMA weights: {e}")

        # Evaluate and plot results
        self.evaluate_model(X_val, y_val)
        self.plot_training_history(history1, history2)

        return history2

    def evaluate_model(self, X_val, y_val):
        """Evaluate model performance"""
        print("\n=== Model Evaluation ===")

        # Predict on validation set
        y_pred = self.model.predict(X_val, batch_size=self.batch_size)
        y_pred_classes = np.argmax(y_pred, axis=1)

        # Calculate accuracy
        accuracy = np.mean(y_pred_classes == y_val)
        print(f"Validation Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

        # Top-3 accuracy
        top_3_accuracy = self.top_k_accuracy(y_pred, y_val, k=3)
        print(f"Top-3 Accuracy: {top_3_accuracy:.4f} ({top_3_accuracy*100:.2f}%)")

        # Classification report
        print("\nClassification Report:")
        print(classification_report(y_val, y_pred_classes, target_names=self.class_names))

        # Confusion matrix
        self.plot_confusion_matrix(y_val, y_pred_classes)

        return accuracy

    def top_k_accuracy(self, y_pred, y_true, k=3):
        """Calculate top-k accuracy"""
        top_k_indices = np.argsort(y_pred, axis=1)[:, -k:]
        correct = 0
        for i, true_label in enumerate(y_true):
            if true_label in top_k_indices[i]:
                correct += 1
        return correct / len(y_true)

    def plot_confusion_matrix(self, y_true, y_pred):
        """Plot confusion matrix"""
        cm = confusion_matrix(y_true, y_pred)
        plt.figure(figsize=(12, 10))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=self.class_names,
                    yticklabels=self.class_names)
        plt.title('Confusion Matrix')
        plt.xlabel('Predicted')
        plt.ylabel('True')
        plt.xticks(rotation=45)
        plt.yticks(rotation=0)
        plt.tight_layout()
        os.makedirs('models', exist_ok=True)
        plt.savefig('models/confusion_matrix.png', dpi=300, bbox_inches='tight')
        plt.show()

    def plot_training_history(self, history1, history2):
        """Plot training history"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))

        # Phase 1
        axes[0, 0].plot(history1.history.get('accuracy', []), label='Train')
        axes[0, 0].plot(history1.history.get('val_accuracy', []), label='Validation')
        axes[0, 0].set_TITLE = 'Phase 1: Accuracy'
        axes[0, 0].set_title('Phase 1: Accuracy')
        axes[0, 0].legend()

        axes[0, 1].plot(history1.history.get('loss', []), label='Train')
        axes[0, 1].plot(history1.history.get('val_loss', []), label='Validation')
        axes[0, 1].set_title('Phase 1: Loss')
        axes[0, 1].legend()

        # Phase 2
        axes[1, 0].plot(history2.history.get('accuracy', []), label='Train')
        axes[1, 0].plot(history2.history.get('val_accuracy', []), label='Validation')
        axes[1, 0].set_title('Phase 2: Accuracy')
        axes[1, 0].legend()

        axes[1, 1].plot(history2.history.get('loss', []), label='Train')
        axes[1, 1].plot(history2.history.get('val_loss', []), label='Validation')
        axes[1, 1].set_title('Phase 2: Loss')
        axes[1, 1].legend()

        plt.tight_layout()
        os.makedirs('models', exist_ok=True)
        plt.savefig('models/training_history.png', dpi=300, bbox_inches='tight')
        plt.show()

    def save_model(self):
        """Save the trained model"""
        model_dir = "models"
        os.makedirs(model_dir, exist_ok=True)

        # Save the model
        self.model.save(os.path.join(model_dir, "product_cnn_model.h5"))

        # Save label encoder
        with open(os.path.join(model_dir, "label_encoder.pkl"), 'wb') as f:
            pickle.dump(self.label_encoder, f)

        # Save class names
        with open(os.path.join(model_dir, "class_names.txt"), 'w') as f:
            for class_name in self.class_names:
                f.write(f"{class_name}\n")

        print(f"Model saved to {model_dir}/")

    def load_model(self):
        """Load the trained model"""
        model_dir = "models"

        # Load the model
        self.model = tf.keras.models.load_model(os.path.join(model_dir, "product_cnn_model.h5"),
                                                custom_objects={"StochasticDepth": StochasticDepth})

        # Load label encoder
        with open(os.path.join(model_dir, "label_encoder.pkl"), 'rb') as f:
            self.label_encoder = pickle.load(f)

        # Load class names
        with open(os.path.join(model_dir, "class_names.txt"), 'r') as f:
            self.class_names = [line.strip() for line in f.readlines()]

        print("Model loaded successfully")

    def predict_product(self, image_path):
        """Predict product from image"""
        if self.model is None:
            self.load_model()

        # Load and preprocess image
        image = self.load_and_preprocess_image(image_path)
        if image is None:
            return None

        # Reshape for prediction
        image = np.expand_dims(image, axis=0)

        # Predict
        predictions = self.model.predict(image)
        predicted_class = np.argmax(predictions[0])
        confidence = predictions[0][predicted_class]

        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_3_predictions = []

        for idx in top_3_indices:
            class_name = self.class_names[idx]
            confidence_score = predictions[0][idx]
            top_3_predictions.append({
                'class': class_name,
                'confidence': float(confidence_score)
            })

        return {
            'predicted_class': self.class_names[predicted_class],
            'confidence': float(confidence),
            'top_3_predictions': top_3_predictions
        }
