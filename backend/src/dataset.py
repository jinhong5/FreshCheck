import zipfile
import io
from PIL import Image
from torch.utils.data import Dataset
import re

# class FruitZipDataset(Dataset):
#     def __init__(self, zip_path, transform=None):
#         self.zip_path = zip_path
#         self.transform = transform

#         # just read file names once
#         with zipfile.ZipFile(zip_path) as archive:
#             self.files = [
#                 f for f in archive.namelist() 
#                 if f.lower().endswith((".jpg",".png"))
#             ]

#     def __len__(self):
#         return len(self.files)

#     def extract_day_from_filename(self, filename):
#         numbers = re.findall(r"\d+", filename)
#         return int(numbers[0]) if numbers else 0

#     def __getitem__(self, idx):
#         # open the zip fresh each time (avoids pickling issues)
#         with zipfile.ZipFile(self.zip_path) as archive:
#             file = self.files[idx]
#             img_bytes = archive.read(file)
#             img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

#         if self.transform:
#             img = self.transform(img)

#         day = self.extract_day_from_filename(file)
#         max_life = 10
#         label = float(max(max_life - day, 0))

#         return img, label

class FruitZipDataset(Dataset):
    def __init__(self, zip_path, transform=None, fruit="Banana", use_rgb_only=True):
        self.zip_path = zip_path
        self.transform = transform
        self.fruit = fruit
        self.use_rgb_only = use_rgb_only

        # Open the ZIP once to list files
        with zipfile.ZipFile(zip_path) as archive:
            files = archive.namelist()

            # Only include paths under Classified/<fruit>/
            # inside __init__
            fruit_prefix = f"Classified/{fruit}/"

            # include all sRGB images under any subfolder
            filtered_files = [
                f for f in files
                if f.startswith(fruit_prefix) and "sRGB_images" in f and f.lower().endswith((".jpg", ".png"))
            ]

            if use_rgb_only:
                # Only include sRGB images
                filtered_files = [f for f in filtered_files if "sRGB_images" in f and f.lower().endswith((".jpg",".png"))]
            else:
                # include all images
                filtered_files = [f for f in filtered_files if f.lower().endswith((".jpg",".png"))]

            self.files = filtered_files

    def __len__(self):
        return len(self.files)

    def extract_day_from_filename(self, filename):
        """
        Extract number from filename for expiration label.
        Adjust this function based on your dataset naming.
        """
        numbers = re.findall(r"\d+", filename)
        return int(numbers[0]) if numbers else 0

    def __getitem__(self, idx):
        # open the zip fresh each time (needed for multi-worker DataLoader)
        with zipfile.ZipFile(self.zip_path) as archive:
            file = self.files[idx]
            img_bytes = archive.read(file)
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        if self.transform:
            img = self.transform(img)

        day = self.extract_day_from_filename(file)
        max_life = 10  # placeholder
        label = float(max(max_life - day, 0))

        return img, label