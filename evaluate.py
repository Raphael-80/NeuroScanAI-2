# evaluate.py
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from google.colab import drive

drive.mount('/content/drive')

print("Loading best model...")
model = load_model('/content/drive/MyDrive/NeuroScanAI/best_model.h5')

test_datagen = ImageDataGenerator(rescale=1./255)
test_generator = test_datagen.flow_from_directory(
    'dataset/test',
    target_size=(256, 256),
    batch_size=32,
    class_mode='categorical',
    shuffle=False
)

print("Running predictions...")
predictions   = model.predict(test_generator)
y_pred        = np.argmax(predictions, axis=1)
y_true        = test_generator.classes
class_labels  = list(test_generator.class_indices.keys())

accuracy = np.mean(y_pred == y_true) * 100
print(f"\nOverall Accuracy: {accuracy:.2f}%")

print("\nDetailed Classification Report:")
print(classification_report(y_true, y_pred, target_names=class_labels))

cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_labels, yticklabels=class_labels)
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.title(f'Confusion Matrix - Accuracy: {accuracy:.2f}%')
plt.tight_layout()
plt.savefig('/content/drive/MyDrive/NeuroScanAI/confusion_matrix.png')
plt.show()
print("Confusion matrix saved!")