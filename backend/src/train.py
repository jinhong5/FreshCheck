import torch
import torchvision.transforms as transforms
from torch.utils.data import DataLoader

from dataset import FruitZipDataset
from model import FruitExpirationModel


def main():

    device = "cuda" if torch.cuda.is_available() else "cpu"

    # image preprocessing
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
    ])

    dataset = FruitZipDataset(
        "data/fruit_dataset.zip",
        transform
    )

    loader = DataLoader(
        dataset,
        batch_size=32,
        shuffle=True,
        num_workers=4  # <- must be zero on Windows for non-picklable dataset
    )

    model = FruitExpirationModel().to(device)

    criterion = torch.nn.MSELoss()

    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=1e-4
    )

    epochs = 10

    for epoch in range(epochs):

        total_loss = 0

        for images, labels in loader:

            images = images.to(device)
            labels = labels.float().to(device)

            preds = model(images).squeeze()

            loss = criterion(preds, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch {epoch+1}/{epochs} Loss: {total_loss:.4f}")


if __name__ == "__main__":
    main()