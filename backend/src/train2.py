import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision.transforms as transforms

from dataset2 import FruitDataset
from model2 import MultimodalModel

def main():
  DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


  transform = transforms.Compose([
      transforms.Resize((224,224)),
      transforms.ToTensor(),
  ])


  dataset = FruitDataset(
      root_dir=r"C:/Users/andre/Hackathon/FreshCheck/backend/data/TR-6",
      transform=transform
  )

  loader = DataLoader(
      dataset,
      batch_size=32,
      shuffle=True,
      num_workers=4
  )


  model = MultimodalModel().to(DEVICE)

  criterion = nn.CrossEntropyLoss()

  optimizer = optim.Adam(
      model.parameters(),
      lr=1e-4
  )


  EPOCHS = 4


  for epoch in range(EPOCHS):
      print("Starting epoch")
      model.train()

      total_loss = 0

      count = 0
      for images, methane, labels in loader:
          count += 1
          if count % 10 == 0:
             print(count)

          print("image")
          images = images.to(DEVICE)
          print("methane")
          methane = methane.to(DEVICE)
          print("labels")
          labels = labels.to(DEVICE)

          print("optimizer")
          optimizer.zero_grad()

          print("output")
          outputs = model(images, methane)

          print("loss")
          loss = criterion(outputs, labels)

          print("backward")
          loss.backward()

          print("optimizer step")
          optimizer.step()

          print("total_loss")
          total_loss += loss.item()

      avg_loss = total_loss / len(loader)

      print(f"Epoch {epoch+1}/{EPOCHS}  Loss: {avg_loss:.4f}")


  torch.save(model.state_dict(), "fruit_spoilage_model.pth")

  print("Model saved.")
  
if __name__ == "__main__":
   main()
