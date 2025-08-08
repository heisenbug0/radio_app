import tensorflow as tf
from tensorflow.keras import layers, models, applications
import numpy as np
import pandas as pd
import os
from PIL import Image
import cv2
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix

class CNNModelService:
    def __init__(self):
        self.model = None
        self.label_encoder = LabelEncoder()
        self.class_names = []
        self.image_size = (299, 299)  # Larger images for better accuracy
        self.batch_size = 16  # Smaller batch size for better generalization
        self.epochs = 200  # More epochs for convergence
        
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
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        lab[:,:,0] = clahe.apply(lab[:,:,0])
        image = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        # Sharpen image
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        image = cv2.filter2D(image, -1, kernel)
        
        return image
    
    def create_cnn_model(self, num_classes):
        """Create a high-accuracy transfer learning model using EfficientNetB3"""
        # Use EfficientNetB3 for better accuracy
        base_model = applications.EfficientNetB3(
            weights='imagenet',
            include_top=False,
            input_shape=(*self.image_size, 3)
        )
        
        # Freeze the base model initially
        base_model.trainable = False
        
        model = models.Sequential([
            # Base model
            base_model,
            
            # Global Average Pooling
            layers.GlobalAveragePooling2D(),
            
            # Batch Normalization
            layers.BatchNormalization(),
            
            # Dense layers with regularization
            layers.Dense(1024, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            
            layers.Dense(512, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.2),
            
            # Output layer
            layers.Dense(num_classes, activation='softmax')
        ])
        
        return model, base_model
    
    def train_model(self, data_dir, csv_file_path):
        """Train the high-accuracy CNN model"""
        print("Starting High-Accuracy CNN model training...")
        print("Target: 90%+ accuracy")
        
        # Load and preprocess data
        X, y = self.load_and_preprocess_data(data_dir, csv_file_path)
        
        # Calculate appropriate validation split
        total_samples = len(X)
        num_classes = len(self.class_names)
        
        print(f"Total samples: {total_samples}")
        print(f"Number of classes: {num_classes}")
        
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
        self.model, base_model = self.create_cnn_model(len(self.class_names))
        
        # Compile model
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Print model summary
        self.model.summary()
        
        # Define callbacks for better training
        callbacks = [
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
        
        # Phase 1: Train with frozen base model
        print("\n=== Phase 1: Training with frozen base model ===")
        history1 = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=50,
            batch_size=self.batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        # Phase 2: Fine-tune the base model
        print("\n=== Phase 2: Fine-tuning base model ===")
        base_model.trainable = True
        
        # Use a lower learning rate for fine-tuning
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        history2 = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=100,
            batch_size=self.batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        # Save the model
        self.save_model()
        
        # Evaluate and plot results
        self.evaluate_model(X_val, y_val)
        self.plot_training_history(history1, history2)
        
        return history2
    
    def evaluate_model(self, X_val, y_val):
        """Evaluate model performance"""
        print("\n=== Model Evaluation ===")
        
        # Predict on validation set
        y_pred = self.model.predict(X_val)
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
        plt.savefig('models/confusion_matrix.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def plot_training_history(self, history1, history2):
        """Plot training history"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Phase 1
        axes[0, 0].plot(history1.history['accuracy'], label='Train')
        axes[0, 0].plot(history1.history['val_accuracy'], label='Validation')
        axes[0, 0].set_title('Phase 1: Accuracy')
        axes[0, 0].legend()
        
        axes[0, 1].plot(history1.history['loss'], label='Train')
        axes[0, 1].plot(history1.history['val_loss'], label='Validation')
        axes[0, 1].set_title('Phase 1: Loss')
        axes[0, 1].legend()
        
        # Phase 2
        axes[1, 0].plot(history2.history['accuracy'], label='Train')
        axes[1, 0].plot(history2.history['val_accuracy'], label='Validation')
        axes[1, 0].set_title('Phase 2: Accuracy')
        axes[1, 0].legend()
        
        axes[1, 1].plot(history2.history['loss'], label='Train')
        axes[1, 1].plot(history2.history['val_loss'], label='Validation')
        axes[1, 1].set_title('Phase 2: Loss')
        axes[1, 1].legend()
        
        plt.tight_layout()
        plt.savefig('models/training_history.png', dpi=300, bbox_inches='tight')
        plt.show()
    
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
        
        print(f"Model saved to {model_dir}/")
    
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
                'confidence': confidence_score
            })
        
        return {
            'predicted_class': self.class_names[predicted_class],
            'confidence': confidence,
            'top_3_predictions': top_3_predictions
        }