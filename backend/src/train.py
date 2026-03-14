import torch
import torchvision.transforms as transforms
from torch.utils.data import DataLoader

from dataset import FruitZipDataset
from model import FruitExpirationModel

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
])

dataset = FruitZipDataset("../data/fruit_dataset.zip", transform)

loader = DataLoader(dataset, batch_size=32, shuffle=True)

model = FruitExpirationModel().cuda()

criterion = torch.nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

for epoch in range(10):
    for images, labels in loader:

        images = images.cuda()
        labels = labels.float().cuda()

        preds = model(images)

        loss = criterion(preds.squeeze(), labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    print("epoch", epoch, "loss:", loss.item())