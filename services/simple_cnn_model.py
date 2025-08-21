import os
import pickle
from typing import Dict, List, Tuple

import cv2
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras import layers, models


class CNNModelService:
    """very small cnn for quick baselines"""
    def __init__(self, image_size: Tuple[int, int] = (128, 128), batch_size: int = 16, epochs: int = 20):
        self.model = None
        self.encoder = LabelEncoder()
        self.class_names: List[str] = []
        self.image_size = image_size
        self.batch_size = batch_size
        self.epochs = epochs

    def _load_image(self, path: str):
        img = cv2.imread(path)
        if img is None:
            return None
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, self.image_size, interpolation=cv2.INTER_AREA)
        img = img.astype(np.float32) / 255.0
        return img

    def load_and_preprocess_data(self, data_dir: str, csv_path: str) -> Tuple[np.ndarray, np.ndarray]:
        """collect images and labels using stockcode prefix"""
        if not os.path.exists(csv_path):
            raise ValueError(f"csv not found: {csv_path}")
        df = pd.read_csv(csv_path)
        if "StockCode" not in df.columns:
            raise ValueError("csv must contain 'StockCode' column")
        self.class_names = sorted(df["StockCode"].astype(str).unique().tolist())
        self.encoder.fit(self.class_names)
        images, labels = [], []
        for fname in os.listdir(data_dir):
            low = fname.lower()
            if not low.endswith((".jpg", ".jpeg", ".png")):
                continue
            for code in self.class_names:
                if low.startswith(str(code).lower()):
                    img = self._load_image(os.path.join(data_dir, fname))
                    if img is not None:
                        images.append(img)
                        labels.append(str(code))
                    break
        if not images:
            raise ValueError("no images found for training")
        x = np.array(images, dtype=np.float32)
        y = self.encoder.transform(labels).astype(np.int32)
        return x, y

    def _build_model(self, num_classes: int):
        inputs = layers.Input(shape=(self.image_size[0], self.image_size[1], 3))
        x = layers.Conv2D(32, 3, padding='same', activation='relu')(inputs)
        x = layers.MaxPooling2D()(x)
        x = layers.Conv2D(64, 3, padding='same', activation='relu')(x)
        x = layers.MaxPooling2D()(x)
        x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
        x = layers.MaxPooling2D()(x)
        x = layers.Flatten()(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(0.3)(x)
        outputs = layers.Dense(num_classes, activation='softmax')(x)
        model = models.Model(inputs, outputs)
        model.compile(optimizer=tf.keras.optimizers.Adam(1e-3),
                      loss='sparse_categorical_crossentropy',
                      metrics=['accuracy'])
        return model

    def train_model(self, data_dir: str, csv_path: str):
        """simple train split + fit"""
        x, y = self.load_and_preprocess_data(data_dir, csv_path)
        x_train, x_val, y_train, y_val = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y))>1 else None)
        self.model = self._build_model(num_classes=len(self.class_names))
        self.model.fit(x_train, y_train, validation_data=(x_val, y_val), epochs=self.epochs, batch_size=self.batch_size, verbose=1)
        self.save_model()

    def save_model(self):
        """save keras model and label artifacts"""
        os.makedirs('models', exist_ok=True)
        self.model.save('models/product_cnn_model.h5')
        with open('models/label_encoder.pkl', 'wb') as f:
            pickle.dump(self.encoder, f)
        with open('models/class_names.txt', 'w') as f:
            for name in self.class_names:
                f.write(f"{name}\n")

    def load_model(self):
        """load model and label artifacts"""
        self.model = tf.keras.models.load_model('models/product_cnn_model.h5')
        with open('models/label_encoder.pkl', 'rb') as f:
            self.encoder = pickle.load(f)
        with open('models/class_names.txt', 'r') as f:
            self.class_names = [line.strip() for line in f if line.strip()]

    def predict_product(self, image_path: str) -> Dict:
        """predict class + top3 for an image path"""
        if self.model is None:
            self.load_model()
        img = self._load_image(image_path)
        if img is None:
            return {"predicted_class": "Unknown", "confidence": 0.0, "top_3_predictions": []}
        arr = np.expand_dims(img, axis=0)
        preds = self.model.predict(arr, verbose=0)[0]
        top_idx = np.argsort(preds)[-3:][::-1]
        top3 = [{"class": self.class_names[i], "confidence": float(preds[i])} for i in top_idx]
        return {"predicted_class": self.class_names[top_idx[0]], "confidence": float(preds[top_idx[0]]), "top_3_predictions": top3}