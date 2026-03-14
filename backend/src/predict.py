import torch
from model2 import MultimodalModel

from PIL import Image
import torchvision.transforms as transforms

device = "cuda" if torch.cuda.is_available() else "cpu"
p1 = "C:/Users/andre/Hackathon/FreshCheck/backend/data/TR-6/Classified/Banana/Not_spoiled/sRGB_images/20250911_101403.jpg"
p2 = "C:/Users/andre/Hackathon/FreshCheck/backend/data/TR-6/Classified/Banana/Spoiled/sRGB_images/20250915_092524.jpg"

t1 = "test_images/normal_banana.jpg"
t2 = "test_images/rotten_banana.jpg"
t3 = "test_images/green_banana.jpg"

def predImage(img):
  # recreate model
  model = MultimodalModel()

  # load weights
  model.load_state_dict(torch.load("fruit_spoilage_model.pth", map_location=device))

  model.to(device)

  # set to inference mode
  model.eval()

  transform = transforms.Compose([
      transforms.Resize((224,224)),
      transforms.ToTensor(),
  ])

  image = Image.open(img)
  image = transform(image).unsqueeze(0).to(device)
  methane = torch.tensor([[0.0]], dtype=torch.float32).to(device)

  with torch.no_grad():
    pred = model(image, methane)
  print("Pred: ", pred)
  pred_label = pred.argmax(dim=1).item()

  print("Predicted label:", "Spoiled" if pred_label == 1 else "Not_spoiled")

if __name__ == "__main__":
  predImage(p1)
  predImage(p2)
  predImage(t1)
  predImage(t2)
  predImage(t3)