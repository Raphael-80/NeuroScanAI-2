# train_model.py - Maximum Accuracy Version
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from sklearn.utils.class_weight import compute_class_weight
import numpy as np
import matplotlib.pyplot as plt
import os

# Mount Google Drive
from google.colab import drive
drive.mount('/content/drive')
os.makedirs('/content/drive/MyDrive/NeuroScanAI', exist_ok=True)
print("Drive mounted!")

# 1. Paths
train_dir = 'dataset/train'
val_dir   = 'dataset/test'

# 2. Augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.1,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest'
)
val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(256, 256),
    batch_size=32,
    class_mode='categorical'
)
val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=(256, 256),
    batch_size=32,
    class_mode='categorical',
    shuffle=False
)

print("\nClass indices:", train_generator.class_indices)
print("Training samples:", train_generator.samples)
print("Validation samples:", val_generator.samples)

# 3. Class Weights
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_generator.classes),
    y=train_generator.classes
)
class_weight_dict = dict(enumerate(class_weights))
print("\nClass weights:", class_weight_dict)

# 4. Build Model
base_model = VGG16(
    weights='imagenet',
    include_top=False,
    input_shape=(256, 256, 3)
)

# Phase 1 - Freeze all VGG16 layers
base_model.trainable = False

model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    BatchNormalization(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(256, activation='relu'),
    Dropout(0.3),
    Dense(4, activation='softmax')
])

model.summary()

# 5. Phase 1 - Train new layers only
print("\n--- PHASE 1: Training new layers ---")
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

phase1_checkpoint = ModelCheckpoint(
    '/content/drive/MyDrive/NeuroScanAI/phase1_model.h5',
    monitor='val_accuracy',
    save_best_only=True,
    verbose=1
)

history1 = model.fit(
    train_generator,
    epochs=10,
    validation_data=val_generator,
    callbacks=[phase1_checkpoint],
    class_weight=class_weight_dict
)

# 6. Phase 2 - Unfreeze last 8 layers
print("\n--- PHASE 2: Fine-tuning last 8 layers ---")
base_model.trainable = True
for layer in base_model.layers[:-8]:
    layer.trainable = False

print("Trainable layers:")
for layer in base_model.layers:
    if layer.trainable:
        print(f"  - {layer.name}")

phase2_callbacks = [
    EarlyStopping(
        monitor='val_accuracy',
        patience=8,
        restore_best_weights=True,
        verbose=1
    ),
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=3,
        min_lr=1e-8,
        verbose=1
    ),
    ModelCheckpoint(
        '/content/drive/MyDrive/NeuroScanAI/best_model.h5',
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )
]

model.compile(
    optimizer=Adam(learning_rate=0.00001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

history2 = model.fit(
    train_generator,
    epochs=50,
    validation_data=val_generator,
    callbacks=phase2_callbacks,
    class_weight=class_weight_dict
)

# 7. Save final model
model.save('/content/drive/MyDrive/NeuroScanAI/alzheimer_model.h5')
print("\nModels saved to Google Drive!")

# 8. Plot combined training history
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Combine both phases
acc  = history1.history['accuracy']  + history2.history['accuracy']
val  = history1.history['val_accuracy'] + history2.history['val_accuracy']
loss = history1.history['loss'] + history2.history['loss']
vl   = history1.history['val_loss'] + history2.history['val_loss']

axes[0].plot(acc, label='Train Accuracy')
axes[0].plot(val, label='Val Accuracy')
axes[0].axvline(x=10, color='gray', linestyle='--', label='Phase 2 Start')
axes[0].set_title('Model Accuracy')
axes[0].set_xlabel('Epoch')
axes[0].set_ylabel('Accuracy')
axes[0].legend()

axes[1].plot(loss, label='Train Loss')
axes[1].plot(vl, label='Val Loss')
axes[1].axvline(x=10, color='gray', linestyle='--', label='Phase 2 Start')
axes[1].set_title('Model Loss')
axes[1].set_xlabel('Epoch')
axes[1].set_ylabel('Loss')
axes[1].legend()

plt.tight_layout()
plt.savefig('/content/drive/MyDrive/NeuroScanAI/training_history.png')
plt.show()
print("Training history saved!")
