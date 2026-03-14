import torch.nn as nn
import torchvision.models as models

class FruitExpirationModel(nn.Module):
    def __init__(self):
        super().__init__()

        self.backbone = models.resnet18(pretrained=True)

        in_features = self.backbone.fc.in_features

        self.backbone.fc = nn.Linear(in_features, 1)

    def forward(self, x):
        return self.backbone(x)