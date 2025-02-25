import os
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import boto3
from dotenv import load_dotenv
from model import PresetGenerator
import tempfile

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AWS S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

# Initialize preset generator
preset_generator = PresetGenerator(model_path=os.getenv('MODEL_PATH'))

@app.post("/generate-preset")
async def generate_preset(image: UploadFile = File(...)):
    try:
        # Create temporary file to store uploaded image
        with tempfile.NamedTemporaryFile(delete=False) as temp_image:
            temp_image.write(await image.read())
            temp_image_path = temp_image.name

        # Generate preset parameters
        preset_params = preset_generator.process_image(temp_image_path)
        
        # Generate unique preset name
        preset_name = f"AI_Preset_{uuid.uuid4().hex[:8]}"
        
        # Generate preset XML
        preset_xml = preset_generator.generate_preset_xml(preset_params, preset_name)
        
        # Save XML to temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.lrtemplate', delete=False) as temp_preset:
            temp_preset.write(preset_xml)
            temp_preset_path = temp_preset.name
        
        # Upload to S3
        s3_key = f"presets/{preset_name}.lrtemplate"
        s3_client.upload_file(
            temp_preset_path,
            os.getenv('S3_BUCKET_NAME'),
            s3_key,
            ExtraArgs={'ContentType': 'application/xml'}
        )
        
        # Generate presigned URL for download
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': os.getenv('S3_BUCKET_NAME'),
                'Key': s3_key
            },
            ExpiresIn=3600  # URL expires in 1 hour
        )
        
        # Clean up temporary files
        os.unlink(temp_image_path)
        os.unlink(temp_preset_path)
        
        return {
            "success": True,
            "preset_name": preset_name,
            "download_url": presigned_url,
            "parameters": preset_params
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 