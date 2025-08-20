from typing import Tuple, List
import tensorflow as tf
from tensorflow.keras import models


def compile_model(model: models.Model) -> None:
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])


def default_callbacks() -> List[tf.keras.callbacks.Callback]:
    return [
        tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-7),
    ]


def train(model: models.Model, X_train, y_train, X_val, y_val, epochs: int, batch_size: int):
    history = model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=default_callbacks(),
        verbose=1,
    )
    return history

