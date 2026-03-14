import os
import glob
import torch
from torch.utils.data import Dataset
from PIL import Image


def read_methane_value(txt_path):
    """Reads methane ppm values from the txt file and returns the mean."""
    values = []
    with open(txt_path, "r") as f:
        for line in f:
            for p in line.strip().split():
                try:
                    values.append(float(p))
                except:
                    continue
    return sum(values) / len(values) if values else 0.0


class FruitDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        self.samples = []

        class_map = {"Not_spoiled": 0, "Spoiled": 1}

        classified_dir = os.path.join(root_dir, "Classified")

        # iterate over fruits first
        for fruit in os.listdir(classified_dir):
            fruit_dir = os.path.join(classified_dir, fruit)

            for label_name, label in class_map.items():
                label_dir = os.path.join(fruit_dir, label_name)

                img_dir = os.path.join(label_dir, "sRGB_images")
                methane_file = os.path.join(label_dir, "Methane_gas_readings.txt")

                if not os.path.exists(img_dir) or not os.path.exists(methane_file):
                    continue

                methane_value = read_methane_value(methane_file)
                images = glob.glob(os.path.join(img_dir, "*.jpg"))

                for img_path in images:
                    self.samples.append(
                        (img_path, methane_value, label)
                    )

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, methane_value, label = self.samples[idx]

        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)

        methane_tensor = torch.tensor([methane_value], dtype=torch.float32)
        label = torch.tensor(label, dtype=torch.long)

        return image, methane_tensor, label
