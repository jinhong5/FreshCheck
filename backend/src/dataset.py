import zipfile
import io
from PIL import Image
from torch.utils.data import Dataset

class FruitZipDataset(Dataset):
    def __init__(self, zip_path, transform=None):
        self.archive = zipfile.ZipFile(zip_path)

        # get all image files
        self.files = [
            f for f in self.archive.namelist()
            if f.endswith(".jpg") or f.endswith(".png")
        ]

        self.transform = transform

    def __len__(self):
        return len(self.files)

    def __getitem__(self, idx):
        img_bytes = self.archive.read(self.files[idx])

        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        if self.transform:
            img = self.transform(img)

        # placeholder label (you'll compute expiration later)
        label = 0  

        return img, label