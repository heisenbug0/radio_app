#!/usr/bin/env python3
"""
Data Quality Improvement for 90%+ CNN Accuracy
"""

import os
import cv2
import numpy as np
import pandas as pd
from PIL import Image, ImageEnhance, ImageFilter
import shutil
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
import seaborn as sns

class DataQualityImprover:
    def __init__(self):
        self.data_dir = "data/scraped_images"
        self.improved_dir = "data/improved_images"
        self.min_images_per_class = 20
        self.target_images_per_class = 30
        
    def analyze_data_quality(self):
        """Analyze current data quality"""
        print("=== Data Quality Analysis ===")
        
        if not os.path.exists(self.data_dir):
            print(f"Data directory not found: {self.data_dir}")
            return False
        
        # Count images per class
        class_counts = {}
        total_images = 0
        
        for filename in os.listdir(self.data_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                stock_code = filename.split('_')[0]
                if stock_code not in class_counts:
                    class_counts[stock_code] = 0
                class_counts[stock_code] += 1
                total_images += 1
        
        print(f"Total images: {total_images}")
        print(f"Number of classes: {len(class_counts)}")
        print(f"Average images per class: {total_images / len(class_counts):.1f}")
        
        # Analyze distribution
        counts = list(class_counts.values())
        print(f"Min images per class: {min(counts)}")
        print(f"Max images per class: {max(counts)}")
        print(f"Standard deviation: {np.std(counts):.1f}")
        
        # Identify classes with insufficient data
        insufficient_classes = [cls for cls, count in class_counts.items() if count < self.min_images_per_class]
        print(f"Classes with < {self.min_images_per_class} images: {len(insufficient_classes)}")
        
        # Plot distribution
        self.plot_class_distribution(class_counts)
        
        return class_counts
    
    def plot_class_distribution(self, class_counts):
        """Plot distribution of images per class"""
        plt.figure(figsize=(12, 6))
        
        counts = list(class_counts.values())
        plt.hist(counts, bins=20, alpha=0.7, color='skyblue', edgecolor='black')
        plt.axvline(np.mean(counts), color='red', linestyle='--', label=f'Mean: {np.mean(counts):.1f}')
        plt.axvline(self.min_images_per_class, color='orange', linestyle='--', label=f'Min Required: {self.min_images_per_class}')
        
        plt.xlabel('Images per Class')
        plt.ylabel('Number of Classes')
        plt.title('Distribution of Images per Class')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('data_quality_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def improve_image_quality(self, image_path):
        """Improve individual image quality"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return None
            
            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # 1. Remove noise
            image = cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
            
            # 2. Enhance contrast using CLAHE
            lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
            clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
            lab[:,:,0] = clahe.apply(lab[:,:,0])
            image = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
            
            # 3. Sharpen image
            kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
            image = cv2.filter2D(image, -1, kernel)
            
            # 4. Enhance saturation
            hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
            hsv[:,:,1] = cv2.multiply(hsv[:,:,1], 1.2)  # Increase saturation
            image = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
            
            # 5. Normalize brightness
            image = cv2.convertScaleAbs(image, alpha=1.1, beta=10)
            
            return image
            
        except Exception as e:
            print(f"Error improving image {image_path}: {e}")
            return None
    
    def create_synthetic_images(self, image_path, num_variations=5):
        """Create synthetic images through augmentation"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return []
            
            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            variations = []
            
            # 1. Rotation variations
            for angle in [5, -5, 10, -10]:
                matrix = cv2.getRotationMatrix2D((image.shape[1]/2, image.shape[0]/2), angle, 1.0)
                rotated = cv2.warpAffine(image, matrix, (image.shape[1], image.shape[0]))
                variations.append(rotated)
            
            # 2. Brightness variations
            for factor in [0.8, 1.2]:
                brightened = cv2.convertScaleAbs(image, alpha=factor, beta=0)
                variations.append(brightened)
            
            # 3. Contrast variations
            for factor in [0.9, 1.1]:
                contrasted = cv2.convertScaleAbs(image, alpha=factor, beta=50*(factor-1))
                variations.append(contrasted)
            
            # 4. Gaussian blur (slight)
            blurred = cv2.GaussianBlur(image, (3, 3), 0.5)
            variations.append(blurred)
            
            # 5. Add slight noise
            noise = np.random.normal(0, 10, image.shape).astype(np.uint8)
            noisy = cv2.add(image, noise)
            variations.append(noisy)
            
            return variations[:num_variations]
            
        except Exception as e:
            print(f"Error creating synthetic images for {image_path}: {e}")
            return []
    
    def remove_duplicate_images(self, class_dir):
        """Remove duplicate or very similar images"""
        try:
            image_files = [f for f in os.listdir(class_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            
            if len(image_files) < 2:
                return
            
            # Load images and compute features
            images = []
            features = []
            
            for filename in image_files:
                image_path = os.path.join(class_dir, filename)
                image = cv2.imread(image_path)
                if image is not None:
                    # Resize for feature extraction
                    image = cv2.resize(image, (64, 64))
                    # Convert to grayscale and flatten
                    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                    features.append(gray.flatten())
                    images.append(filename)
            
            if len(features) < 2:
                return
            
            # Convert to numpy array
            features = np.array(features)
            
            # Find similar images using clustering
            n_clusters = min(len(features) // 2, 10)  # Adaptive clustering
            
            if n_clusters < 2:
                return
            
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            clusters = kmeans.fit_predict(features)
            
            # Keep one image per cluster (the one closest to cluster center)
            to_remove = []
            
            for cluster_id in range(n_clusters):
                cluster_indices = np.where(clusters == cluster_id)[0]
                if len(cluster_indices) > 1:
                    # Keep the first image, remove others
                    to_remove.extend(cluster_indices[1:])
            
            # Remove duplicate images
            for idx in to_remove:
                filename = images[idx]
                filepath = os.path.join(class_dir, filename)
                os.remove(filepath)
                print(f"Removed duplicate: {filename}")
            
            print(f"Removed {len(to_remove)} duplicate images")
            
        except Exception as e:
            print(f"Error removing duplicates: {e}")
    
    def improve_dataset(self):
        """Main function to improve dataset quality"""
        print("=== Improving Dataset Quality ===")
        
        # Analyze current quality
        class_counts = self.analyze_data_quality()
        if not class_counts:
            return
        
        # Create improved directory
        os.makedirs(self.improved_dir, exist_ok=True)
        
        improved_counts = {}
        
        for stock_code, count in class_counts.items():
            print(f"\nProcessing class {stock_code} ({count} images)...")
            
            # Create class directory
            class_dir = os.path.join(self.improved_dir, stock_code)
            os.makedirs(class_dir, exist_ok=True)
            
            # Get all images for this class
            class_images = []
            for filename in os.listdir(self.data_dir):
                if filename.startswith(str(stock_code)) and filename.endswith(('.jpg', '.jpeg', '.png')):
                    class_images.append(filename)
            
            improved_images = 0
            
            # Process each image
            for filename in class_images:
                image_path = os.path.join(self.data_dir, filename)
                
                # Improve image quality
                improved_image = self.improve_image_quality(image_path)
                if improved_image is not None:
                    # Save improved image
                    improved_path = os.path.join(class_dir, f"improved_{filename}")
                    improved_image_bgr = cv2.cvtColor(improved_image, cv2.COLOR_RGB2BGR)
                    cv2.imwrite(improved_path, improved_image_bgr)
                    improved_images += 1
                    
                    # Create synthetic variations if needed
                    if count < self.target_images_per_class:
                        variations = self.create_synthetic_images(image_path, 
                                                                 num_variations=self.target_images_per_class - count)
                        
                        for i, variation in enumerate(variations):
                            if improved_images + i < self.target_images_per_class:
                                variation_path = os.path.join(class_dir, f"synthetic_{i}_{filename}")
                                variation_bgr = cv2.cvtColor(variation, cv2.COLOR_RGB2BGR)
                                cv2.imwrite(variation_path, variation_bgr)
                                improved_images += 1
            
            # Remove duplicates
            self.remove_duplicate_images(class_dir)
            
            # Count final images
            final_count = len([f for f in os.listdir(class_dir) if f.endswith(('.jpg', '.jpeg', '.png'))])
            improved_counts[stock_code] = final_count
            
            print(f"  Improved: {count} -> {final_count} images")
        
        # Analyze improved dataset
        print("\n=== Improved Dataset Analysis ===")
        total_improved = sum(improved_counts.values())
        print(f"Total improved images: {total_improved}")
        print(f"Average images per class: {total_improved / len(improved_counts):.1f}")
        
        # Classes still needing more data
        insufficient = [cls for cls, count in improved_counts.items() if count < self.min_images_per_class]
        print(f"Classes still needing more data: {len(insufficient)}")
        
        if insufficient:
            print("Consider:")
            print("1. Manual image collection for these classes")
            print("2. Using different search terms in web scraping")
            print("3. Data augmentation techniques")
        
        return improved_counts
    
    def create_balanced_dataset(self):
        """Create a balanced dataset for better training"""
        print("\n=== Creating Balanced Dataset ===")
        
        balanced_dir = "data/balanced_images"
        os.makedirs(balanced_dir, exist_ok=True)
        
        # Get class counts from improved dataset
        class_counts = {}
        for class_name in os.listdir(self.improved_dir):
            class_path = os.path.join(self.improved_dir, class_name)
            if os.path.isdir(class_path):
                count = len([f for f in os.listdir(class_path) if f.endswith(('.jpg', '.jpeg', '.png'))])
                class_counts[class_name] = count
        
        # Find minimum count across all classes
        min_count = min(class_counts.values()) if class_counts else 0
        print(f"Balancing to {min_count} images per class")
        
        # Create balanced dataset
        for class_name, count in class_counts.items():
            print(f"Balancing class {class_name}: {count} -> {min_count}")
            
            # Create class directory
            class_dir = os.path.join(balanced_dir, class_name)
            os.makedirs(class_dir, exist_ok=True)
            
            # Get all images for this class
            source_dir = os.path.join(self.improved_dir, class_name)
            images = [f for f in os.listdir(source_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            
            # Randomly select min_count images
            if len(images) > min_count:
                selected_images = np.random.choice(images, min_count, replace=False)
            else:
                selected_images = images
            
            # Copy selected images
            for filename in selected_images:
                src_path = os.path.join(source_dir, filename)
                dst_path = os.path.join(class_dir, filename)
                shutil.copy2(src_path, dst_path)
        
        print(f"Balanced dataset created in {balanced_dir}")
        return balanced_dir

def main():
    """Main function to improve data quality"""
    print("Data Quality Improvement for 90%+ CNN Accuracy")
    print("=" * 60)
    
    improver = DataQualityImprover()
    
    try:
        # Improve dataset quality
        improved_counts = improver.improve_dataset()
        
        if improved_counts:
            # Create balanced dataset
            balanced_dir = improver.create_balanced_dataset()
            
            print("\n🎉 Data quality improvement completed!")
            print(f"Improved dataset: {improver.improved_dir}")
            print(f"Balanced dataset: {balanced_dir}")
            print("\nNext steps:")
            print("1. Use the balanced dataset for training")
            print("2. Run: python high_accuracy_cnn.py")
            print("3. Monitor training progress for 90%+ accuracy")
        
    except Exception as e:
        print(f"Error during data improvement: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()