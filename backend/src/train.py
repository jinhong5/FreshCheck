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
        transform=transform
    )

    loader = DataLoader(
        dataset,
        batch_size=32,
        shuffle=True,
        num_workers=0  # <- must be zero on Windows for non-picklable dataset
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
        
    torch.save(model.state_dict(), "banana_model.pth")
    print("Model saved to banana_model.pth")

    model.eval()  # switch to evaluation mode
    with torch.no_grad():
        for i, (images, labels) in enumerate(loader):
            images = images.to(device)
            labels = labels.to(device)
            preds = model(images).squeeze()
            print(f"Batch {i+1}")
            for j in range(min(5, len(preds))):  # print first 5 predictions
                print(f"Pred: {preds[j].item():.2f}, True: {labels[j].item():.2f}")
            break 


if __name__ == "__main__":
    main()