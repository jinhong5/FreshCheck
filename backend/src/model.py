import torch.nn as nn
import torchvision.models as models


class FruitExpirationModel(nn.Module):

    def __init__(self):
        super().__init__()

        # pretrained backbone
        self.backbone = models.resnet18(weights="IMAGENET1K_V1")

        in_features = self.backbone.fc.in_features

        # replace final layer for regression
        self.backbone.fc = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Linear(256, 1)
        )

    def forward(self, x):
        return self.backbone(x)