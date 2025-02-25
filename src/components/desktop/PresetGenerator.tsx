import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// Safe Electron check and import
const electron = typeof window !== 'undefined' && 
  window.process?.versions?.hasOwnProperty('electron') ? 
  (window as any).require('electron').ipcRenderer : 
  null;

// File validation constants
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/x-adobe-dng': ['.dng'],
  'image/x-canon-cr2': ['.cr2'],
  'image/x-nikon-nef': ['.nef'],
  'image/x-sony-arw': ['.arw'],
};

interface PresetGeneratorProps {
  isSubscribed?: boolean;
}

const PresetGenerator: React.FC<PresetGeneratorProps> = ({ isSubscribed = false }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preset, setPreset] = useState<any>(null);

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 25MB');
    }

    const fileType = file.type.toLowerCase();
    if (!Object.keys(ACCEPTED_TYPES).includes(fileType)) {
      throw new Error('Unsupported file type. Please upload a JPEG, PNG, or RAW image');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError('File size must be less than 25MB');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Unsupported file type. Please upload a JPEG, PNG, or RAW image');
      }
      return;
    }

    try {
      const file = acceptedFiles[0];
      validateFile(file);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const generatePreset = async () => {
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const imageData = reader.result;
          const result = await electron?.invoke('generate-preset', imageData);

          if (result.success) {
            setPreset(result.preset);
          } else {
            setError(result.error || 'Failed to generate preset');
          }
        } catch (err: any) {
          setError(err.message || 'Failed to process image');
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read image file');
        setLoading(false);
      };

      reader.readAsArrayBuffer(image);
    } catch (err: any) {
      setError(err.message || 'Failed to generate preset');
      setLoading(false);
    }
  };

  const exportPreset = async () => {
    if (!preset) return;

    try {
      const result = await electron?.invoke('export-preset', preset);
      if (result.success) {
        // TODO: Save XML file using electron dialog
        console.log('Preset XML:', result.xml);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to export preset');
    }
  };

  return (
    <div className="p-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div>
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-xl shadow-lg" 
            />
            <p className="text-base text-gray-600 mt-4">
              Click or drag to replace image
            </p>
          </div>
        ) : (
          <div className="py-8">
            <p className="text-xl font-medium text-gray-700">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-base text-gray-600 mt-3">
              Supported formats: JPEG, PNG, RAW (DNG, CR2, NEF, ARW)
            </p>
            <p className="text-base text-gray-600">
              Maximum file size: 25MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-base text-red-600">{error}</p>
        </div>
      )}

      {image && (
        <div className="mt-8 space-y-6">
          <button
            onClick={generatePreset}
            disabled={loading || !isSubscribed}
            className={`w-full px-6 py-4 text-base font-medium text-white bg-blue-500 
              rounded-xl transition-all duration-200
              ${!loading && isSubscribed && 'hover:bg-blue-600 active:bg-blue-700'}
              ${!isSubscribed ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Generating...' : 'Generate Preset'}
          </button>

          {!isSubscribed && (
            <p className="text-base text-red-600 text-center">
              Subscribe to generate and export presets
            </p>
          )}

          {preset && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Generated Preset Settings:</h3>
                <pre className="mt-4 text-base overflow-auto p-4 bg-white rounded-lg border border-gray-100">
                  {JSON.stringify(preset.settings, null, 2)}
                </pre>
              </div>
              <button
                onClick={exportPreset}
                className="w-full px-6 py-4 text-base font-medium text-gray-700 bg-gray-100
                  rounded-xl transition-all duration-200 hover:bg-gray-200 active:bg-gray-300"
              >
                Export as Lightroom Preset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PresetGenerator; 