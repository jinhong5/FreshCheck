import torch
from model import FruitExpirationModel

from PIL import Image
import torchvision.transforms as transforms

device = "cuda" if torch.cuda.is_available() else "cpu"

# recreate model
model = FruitExpirationModel()

# load weights
model.load_state_dict(torch.load("banana_model.pth", map_location=device))

model.to(device)

# set to inference mode
model.eval()

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
])

image = Image.open("test_images/rotten_banana.jpg")
image = transform(image).unsqueeze(0).to(device)

with torch.no_grad():
    pred = model(image)

print("Predicted spoilage score:", pred.item())