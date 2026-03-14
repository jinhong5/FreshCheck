import torch
import torch.nn as nn
import torchvision.models as models


class MultimodalModel(nn.Module):

    def __init__(self):

        super().__init__()

        backbone = models.resnet18(weights="IMAGENET1K_V1")

        self.cnn = nn.Sequential(*list(backbone.children())[:-1])
        cnn_out = backbone.fc.in_features

        self.methane_fc = nn.Sequential(
            nn.Linear(1, 16),
            nn.ReLU()
        )

        self.classifier = nn.Sequential(
            nn.Linear(cnn_out + 16, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 2)
        )

    def forward(self, image, methane):

        x = self.cnn(image)
        x = x.view(x.size(0), -1)

        gas = self.methane_fc(methane)

        combined = torch.cat([x, gas], dim=1)

        out = self.classifier(combined)

        return out
