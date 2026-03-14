import torchvision.transforms as transforms
from dataset import FruitZipDataset
from torch.utils.data import DataLoader

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
])

dataset = FruitZipDataset("data/fruit_dataset.zip", transform)

loader = DataLoader(
    dataset,
    batch_size=32,
    shuffle=True,
    num_workers=4
)