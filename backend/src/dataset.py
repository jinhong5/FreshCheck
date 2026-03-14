import zipfile
import io
import re
from PIL import Image
from torch.utils.data import Dataset


class FruitZipDataset(Dataset):
    def __init__(self, zip_path, transform=None):
        self.archive = zipfile.ZipFile(zip_path)

        # find image files
        self.files = [
            f for f in self.archive.namelist()
            if f.lower().endswith((".jpg", ".jpeg", ".png"))
        ]

        self.transform = transform

    def __len__(self):
        return len(self.files)

    def extract_day_from_filename(self, filename):
        """
        Attempts to extract a number from the filename.
        Example:
        banana_day3.jpg → 3
        image_5.png → 5
        """

        numbers = re.findall(r"\d+", filename)

        if len(numbers) > 0:
            return int(numbers[0])
        else:
            return 0

    def __getitem__(self, idx):

        file = self.files[idx]

        # read image from zip
        img_bytes = self.archive.read(file)

        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        if self.transform:
            img = self.transform(img)

        # example label generation
        day = self.extract_day_from_filename(file)

        # placeholder expiration assumption
        max_life = 10
        remaining_days = max(max_life - day, 0)

        label = float(remaining_days)

        return img, label