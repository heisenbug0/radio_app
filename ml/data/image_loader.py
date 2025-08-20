import os
from typing import List, Tuple
import numpy as np
import pandas as pd
import cv2


def load_image_rgb_resized(image_path: str, image_size: Tuple[int, int]) -> np.ndarray | None:
    image = cv2.imread(image_path)
    if image is None:
        return None
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, image_size)
    image = image.astype(np.float32) / 255.0
    return image


def load_labeled_images(data_dir: str, csv_file_path: str, image_size: Tuple[int, int]) -> Tuple[np.ndarray, List[str]]:
    df = pd.read_csv(csv_file_path)
    class_names = df['StockCode'].astype(str).unique().tolist()

    images: List[np.ndarray] = []
    labels: List[str] = []

    for stock_code in class_names:
        for filename in os.listdir(data_dir):
            if filename.startswith(str(stock_code)) and filename.lower().endswith((".jpg", ".jpeg", ".png")):
                image_path = os.path.join(data_dir, filename)
                image = load_image_rgb_resized(image_path, image_size)
                if image is not None:
                    images.append(image)
                    labels.append(stock_code)

    if not images:
        raise ValueError("no images found for training")

    return np.array(images), labels

