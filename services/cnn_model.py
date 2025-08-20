import tensorflow as tf
from tensorflow.keras import models
import numpy as np
import pandas as pd
import os
import cv2
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
from ml.modeling.cnn_arch import build_cnn
from ml.data.image_loader import load_labeled_images, load_image_rgb_resized
from ml.training.loops import compile_model, train

class CNNModelService:
    def __init__(self):
        self.model = None
        self.label_encoder = LabelEncoder()
        self.class_names = []
        self.image_size = (224, 224)
        self.batch_size = 32
        self.epochs = 50
        
    def load_and_preprocess_data(self, data_dir, csv_file_path):
        """load image tensors and labels"""
        print("loading data...")
        X, labels = load_labeled_images(data_dir, csv_file_path, self.image_size)
        df = pd.read_csv(csv_file_path)
        self.class_names = df['StockCode'].astype(str).unique().tolist()
        self.label_encoder.fit(self.class_names)
        y = self.label_encoder.transform(labels)
        print(f"loaded {len(X)} images for {len(self.class_names)} classes")
        return X, y
    
    def load_and_preprocess_image(self, image_path):
        """single image -> tensor"""
        try:
            return load_image_rgb_resized(image_path, self.image_size)
        except Exception as e:
            print(f"error preprocessing image {image_path}: {e}")
            return None
    
    def create_cnn_model(self, num_classes):
        """create model"""
        input_shape = (*self.image_size, 3)
        return build_cnn(input_shape, num_classes)
    
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
        compile_model(self.model)
        
        # Print model summary
        self.model.summary()
        
        # Define callbacks
        # Train the model
        history = train(self.model, X_train, y_train, X_val, y_val, self.epochs, self.batch_size)
        
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