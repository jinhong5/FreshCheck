# import zipfile
# from torch.utils.data import Dataset
# from PIL import Image
# import io
# import re

# class FruitZipDataset(Dataset):
#     def __init__(self, zip_path, transform=None, fruit="Banana"):
#         self.zip_path = zip_path
#         self.transform = transform
#         self.fruit = fruit

#         with zipfile.ZipFile(zip_path) as archive:
#             files = archive.namelist()

#             # include all IR or sRGB images under Banana
#             self.files = [
#                 f for f in files
#                 if f"/{fruit}/" in f and ("sRGB_images" in f or "IR_fusion_images" in f)
#                 and f.lower().endswith((".jpg", ".png"))
#             ]

#         print(f"Found {len(self.files)} images for {self.fruit}")
#         print("Sample files:", self.files[:5])

#     def __len__(self):
#         return len(self.files)

#     def __getitem__(self, idx):
#         with zipfile.ZipFile(self.zip_path) as archive:
#             file = self.files[idx]
#             img_bytes = archive.read(file)
#             img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

#         if self.transform:
#             img = self.transform(img)

#         # Placeholder label extraction from filename
#         # For now, assign 0; you can implement a real label mapping later
#         label = 0.0
#         return img, label