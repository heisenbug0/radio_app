import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import pandas as pd
import os
from PIL import Image
import cv2
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt

class CNNModelService:
    def __init__(self):
        self.model = None
        self.label_encoder = LabelEncoder()
        self.class_names = []
        self.image_size = (224, 224)
        self.batch_size = 32
        self.epochs = 50
        
    def load_and_preprocess_data(self, data_dir, csv_file_path):
        """Load and preprocess image data for training"""
        print("Loading and preprocessing data...")
        
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
        return X, y
    
    def load_and_preprocess_image(self, image_path):
        """Load and preprocess a single image"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return None
            
            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Resize image
            image = cv2.resize(image, self.image_size)
            
            # Normalize pixel values
            image = image.astype(np.float32) / 255.0
            
            return image
            
        except Exception as e:
            print(f"Error preprocessing image {image_path}: {e}")
            return None
    
    def create_cnn_model(self, num_classes):
        """Create a CNN model from scratch"""
        model = models.Sequential([
            # First Convolutional Block
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=(*self.image_size, 3)),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Second Convolutional Block
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Third Convolutional Block
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Fourth Convolutional Block
            layers.Conv2D(256, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Flatten and Dense Layers
            layers.Flatten(),
            layers.Dense(512, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(num_classes, activation='softmax')
        ])
        
        return model
    
    def train_model(self, data_dir, csv_file_path):
        """Train the CNN model"""
        print("Starting CNN model training...")
        
        # Load and preprocess data
        X, y = self.load_and_preprocess_data(data_dir, csv_file_path)
        
        # Split data into train and validation sets
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Create and compile model
        self.model = self.create_cnn_model(len(self.class_names))
        
        self.model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Print model summary
        self.model.summary()
        
        # Define callbacks
        callbacks = [
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7
            )
        ]
        
        # Train the model
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=self.epochs,
            batch_size=self.batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        # Save the model
        self.save_model()
        
        # Plot training history
        self.plot_training_history(history)
        
        return history
    
    def save_model(self):
        """Save the trained model"""
        model_dir = "models"
        os.makedirs(model_dir, exist_ok=True)
        
        # Save the model
        self.model.save(os.path.join(model_dir, "product_cnn_model.h5"))
        
        # Save label encoder
        import pickle
        with open(os.path.join(model_dir, "label_encoder.pkl"), 'wb') as f:
            pickle.dump(self.label_encoder, f)
        
        # Save class names
        with open(os.path.join(model_dir, "class_names.txt"), 'w') as f:
            for class_name in self.class_names:
                f.write(f"{class_name}\n")
        
        print(f"Model saved to {model_dir}")
    
    def load_model(self):
        """Load the trained model"""
        model_dir = "models"
        
        # Load the model
        self.model = tf.keras.models.load_model(os.path.join(model_dir, "product_cnn_model.h5"))
        
        # Load label encoder
        import pickle
        with open(os.path.join(model_dir, "label_encoder.pkl"), 'rb') as f:
            self.label_encoder = pickle.load(f)
        
        # Load class names
        with open(os.path.join(model_dir, "class_names.txt"), 'r') as f:
            self.class_names = [line.strip() for line in f.readlines()]
        
        print(f"Model loaded from {model_dir}")
    
    def predict_product(self, image_path):
        """Predict product class from image"""
        if self.model is None:
            self.load_model()
        
        # Load and preprocess image
        image = self.load_and_preprocess_image(image_path)
        if image is None:
            return None
        
        # Make prediction
        image_batch = np.expand_dims(image, axis=0)
        predictions = self.model.predict(image_batch)
        
        # Get predicted class
        predicted_class_idx = np.argmax(predictions[0])
        predicted_class = self.label_encoder.inverse_transform([predicted_class_idx])[0]
        confidence = float(predictions[0][predicted_class_idx])
        
        return {
            'predicted_class': predicted_class,
            'confidence': confidence,
            'all_predictions': predictions[0].tolist()
        }
    
    def plot_training_history(self, history):
        """Plot training history"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
        
        # Plot accuracy
        ax1.plot(history.history['accuracy'], label='Training Accuracy')
        ax1.plot(history.history['val_accuracy'], label='Validation Accuracy')
        ax1.set_title('Model Accuracy')
        ax1.set_xlabel('Epoch')
        ax1.set_ylabel('Accuracy')
        ax1.legend()
        
        # Plot loss
        ax2.plot(history.history['loss'], label='Training Loss')
        ax2.plot(history.history['val_loss'], label='Validation Loss')
        ax2.set_title('Model Loss')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('Loss')
        ax2.legend()
        
        plt.tight_layout()
        plt.savefig('training_history.png')
        plt.close()