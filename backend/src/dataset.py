import zipfile
import io
from PIL import Image
from torch.utils.data import Dataset
import re

class FruitZipDataset(Dataset):
    def __init__(self, zip_path, transform=None):
        self.zip_path = zip_path
        self.transform = transform

        # just read file names once
        with zipfile.ZipFile(zip_path) as archive:
            self.files = [
                f for f in archive.namelist() 
                if f.lower().endswith((".jpg",".png"))
            ]

    def __len__(self):
        return len(self.files)

    def extract_day_from_filename(self, filename):
        numbers = re.findall(r"\d+", filename)
        return int(numbers[0]) if numbers else 0

    def __getitem__(self, idx):
        # open the zip fresh each time (avoids pickling issues)
        with zipfile.ZipFile(self.zip_path) as archive:
            file = self.files[idx]
            img_bytes = archive.read(file)
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        if self.transform:
            img = self.transform(img)

        day = self.extract_day_from_filename(file)
        max_life = 10
        label = float(max(max_life - day, 0))

        return img, label