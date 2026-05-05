# augment_data.py - Aggressive Balancing
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img
import os

def augment_minority_class(class_path, target_count):
    augmentor = ImageDataGenerator(
        rotation_range=25,
        zoom_range=0.25,
        horizontal_flip=True,
        vertical_flip=False,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.1,
        brightness_range=[0.75, 1.25],
        fill_mode='nearest'
    )

    images = [f for f in os.listdir(class_path)
              if f.endswith(('.jpg', '.jpeg', '.png'))]
    current_count = len(images)

    if current_count >= target_count:
        print(f"{class_path} already has enough images ({current_count})")
        return

    needed = target_count - current_count
    print(f"Augmenting {class_path} from {current_count} to {target_count}...")

    i = 0
    while i < needed:
        img_path = os.path.join(class_path, images[i % current_count])
        img      = load_img(img_path, target_size=(256, 256))
        img_array = img_to_array(img)
        img_array = img_array.reshape((1,) + img_array.shape)

        for batch in augmentor.flow(
            img_array,
            save_to_dir=class_path,
            save_prefix='aug',
            save_format='jpg'
        ):
            i += 1
            break

    print(f"Done! {class_path} now has {target_count} images")

# Boost all classes to 3200
augment_minority_class('dataset/train/ModerateDemented', 3200)
augment_minority_class('dataset/train/MildDemented', 3200)
augment_minority_class('dataset/train/VeryMildDemented', 3200)

print("\nAugmentation complete! All classes balanced to 3200 images.")
print("Now run train_model.py")