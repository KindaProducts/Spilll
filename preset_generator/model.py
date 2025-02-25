import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

class PresetGeneratorModel(nn.Module):
    def __init__(self):
        super(PresetGeneratorModel, self).__init__()
        
        # Use ResNet50 as base model
        resnet = models.resnet50(pretrained=True)
        self.features = nn.Sequential(*list(resnet.children())[:-2])
        
        # Custom layers for preset parameter prediction
        self.avg_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.preset_head = nn.Sequential(
            nn.Flatten(),
            nn.Linear(2048, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Linear(256, 12)  # 12 preset parameters
        )
        
        # Initialize weights
        self._initialize_weights()
    
    def _initialize_weights(self):
        for m in self.preset_head.modules():
            if isinstance(m, nn.Linear):
                nn.init.kaiming_normal_(m.weight)
                nn.init.constant_(m.bias, 0)
    
    def forward(self, x):
        x = self.features(x)
        x = self.avg_pool(x)
        x = self.preset_head(x)
        return x

class PresetGenerator:
    def __init__(self, model_path=None):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = PresetGeneratorModel().to(self.device)
        
        if model_path:
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                              std=[0.229, 0.224, 0.225])
        ])
        
        # Parameter ranges for scaling model outputs
        self.param_ranges = {
            'exposure': (-4.0, 4.0),
            'contrast': (-100, 100),
            'highlights': (-100, 100),
            'shadows': (-100, 100),
            'whites': (-100, 100),
            'blacks': (-100, 100),
            'clarity': (-100, 100),
            'vibrance': (-100, 100),
            'saturation': (-100, 100),
            'temperature': (2000, 10000),
            'tint': (-150, 150),
            'sharpness': (0, 150)
        }
    
    def process_image(self, image_path):
        """Process an image and generate preset parameters."""
        # Load and preprocess image
        image = Image.open(image_path).convert('RGB')
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Generate parameters
        with torch.no_grad():
            parameters = self.model(image_tensor)
            parameters = parameters.cpu().numpy()[0]
        
        # Scale parameters to their respective ranges
        preset_params = {}
        for i, (param_name, (min_val, max_val)) in enumerate(self.param_ranges.items()):
            # Convert from [-1, 1] to actual range
            normalized_value = np.clip(parameters[i], -1, 1)
            scaled_value = (normalized_value + 1) / 2 * (max_val - min_val) + min_val
            preset_params[param_name] = float(scaled_value)
        
        return preset_params
    
    def generate_preset_xml(self, preset_params, preset_name):
        """Generate Lightroom preset XML from parameters."""
        xml_template = f"""<?xml version="1.0" encoding="UTF-8"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 7.0-c000">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/">
      <crs:PresetType>Develop</crs:PresetType>
      <crs:Exposure>{preset_params['exposure']:.2f}</crs:Exposure>
      <crs:Contrast>{int(preset_params['contrast'])}</crs:Contrast>
      <crs:Highlights>{int(preset_params['highlights'])}</crs:Highlights>
      <crs:Shadows>{int(preset_params['shadows'])}</crs:Shadows>
      <crs:Whites>{int(preset_params['whites'])}</crs:Whites>
      <crs:Blacks>{int(preset_params['blacks'])}</crs:Blacks>
      <crs:Clarity>{int(preset_params['clarity'])}</crs:Clarity>
      <crs:Vibrance>{int(preset_params['vibrance'])}</crs:Vibrance>
      <crs:Saturation>{int(preset_params['saturation'])}</crs:Saturation>
      <crs:Temperature>{int(preset_params['temperature'])}</crs:Temperature>
      <crs:Tint>{int(preset_params['tint'])}</crs:Tint>
      <crs:Sharpness>{int(preset_params['sharpness'])}</crs:Sharpness>
      <crs:ConvertToGrayscale>False</crs:ConvertToGrayscale>
      <crs:ProcessVersion>11.0</crs:ProcessVersion>
      <crs:Name>{preset_name}</crs:Name>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>"""
        return xml_template 