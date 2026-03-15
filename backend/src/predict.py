import torch
from model import MultimodalModel

from PIL import Image
import torchvision.transforms as transforms

import sys
import json

device = "cuda" if torch.cuda.is_available() else "cpu"
p1 = "C:/Users/andre/Hackathon/FreshCheck/backend/data/TR-6/Classified/Banana/Not_spoiled/sRGB_images/20250911_101403.jpg"
p2 = "C:/Users/andre/Hackathon/FreshCheck/backend/data/TR-6/Classified/Banana/Spoiled/sRGB_images/20250915_092524.jpg"

t1 = "test_images/normal_banana.jpg"
t2 = "test_images/rotten_banana.jpg"
t3 = "test_images/green_banana.jpg"
g1 = "test_images/greenest_banana.jpg"

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

  image = Image.open(img).convert("RGB")
  image = transform(image).unsqueeze(0).to(device)
  methane = torch.tensor([[0.0]], dtype=torch.float32).to(device)

  with torch.no_grad():
    pred = model(image, methane)
  not_spoiled_value = pred[0, 0].item()
  spoiled_value = pred[0, 1].item()
  label = "Fresh" if not_spoiled_value > spoiled_value else "Spoiled"
  return {
    "not_spoiled": not_spoiled_value, 
    "spoiled": spoiled_value,
    "prediction": label
  }

if __name__ == "__main__":
  img_path = sys.argv[1]

  result = predImage(img_path)

  print(json.dumps(result), flush=True)
  # print(predImage(p1))
  # print(predImage(p2))
  # print(predImage(t1))
  # print(predImage(t2))
  # print(predImage(t3))
  # print(predImage(g1))