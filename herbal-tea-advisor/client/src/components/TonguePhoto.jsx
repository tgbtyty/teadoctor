import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'

function TonguePhoto() {
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [processingError, setProcessingError] = useState(null)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    try {
      const file = e.target.files[0]
      if (file) {
        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
      }
    } catch (err) {
      console.error('Error handling file:', err)
      setProcessingError('处理上传的图像时出错。请重试。')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessingError(null);
    
    if (imageFile) {
      try {
        // Create a smaller image for localStorage
        const maxSize = 800; // Max width/height
        const maxBytes = 900 * 1024; // ~900KB max
        
        const img = new Image();
        img.onload = () => {
          try {
            // Start with original dimensions
            let width = img.width;
            let height = img.height;
            let quality = 0.7;
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            
            // Resize if needed
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = Math.round((height * maxSize) / width);
                width = maxSize;
              } else {
                width = Math.round((width * maxSize) / height);
                height = maxSize;
              }
            }
            
            // Set canvas size & draw image
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Try compressing until size is acceptable
            let dataUrl = canvas.toDataURL('image/jpeg', quality);
            
            // Check size and decrease quality if too large
            while (dataUrl.length > maxBytes && quality > 0.2) {
              quality -= 0.1;
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
            
            console.log(`Image processed: ${width}x${height}, quality: ${quality}, size: ~${Math.round(dataUrl.length/1024)}KB`);
            
            // Store the image and feeling data
            try {
              localStorage.setItem('tongueImage', dataUrl);
              console.log("Image stored in localStorage");
              
              // Verify that we can retrieve the stored data
              const storedImage = localStorage.getItem('tongueImage');
              if (!storedImage) {
                throw new Error("Failed to retrieve image from localStorage after storing");
              }
              
              // Navigate to results
              navigate('/results');
            } catch (storageError) {
              console.error("LocalStorage error:", storageError);
              setProcessingError('存储图像时出错。图像可能太大，请重试。');
            }
          } catch (processError) {
            console.error("Image processing error:", processError);
            setProcessingError('处理图像时出错。请重试。');
          }
        };
        
        img.onerror = () => {
          console.error("Failed to load image");
          setProcessingError('加载图像失败。请重试。');
        };
        
        img.src = previewUrl;
      } catch (err) {
        console.error('General submit error:', err);
        setProcessingError('提交图像时出错。请重试。');
      }
    } else {
      setProcessingError('请先拍照');
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#047857',
        marginBottom: '20px',
        textAlign: 'center'
      }}>舌诊分析</h2>
      
      {processingError && (
        <div style={{
          padding: '10px 15px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          borderRadius: '8px',
          width: '100%',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          {processingError}
        </div>
      )}
      
      {!previewUrl && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          width: '100%',
          alignItems: 'center'
        }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
          />
          
          <button 
            onClick={() => fileInputRef.current.click()}
            style={{
              width: '250px',
              padding: '12px 20px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              fontSize: '16px',
              backgroundColor: '#047857',
              color: 'white',
            }}
          >
            <Upload size={20} />
            <span>拍照</span>
          </button>
        </div>
      )}

      {previewUrl && (
        <div style={{
          width: '100%',
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
              borderRadius: '8px',
              border: '2px solid #047857'
            }}
          />
          
          <div style={{
            display: 'flex',
            gap: '15px',
            width: '100%',
            justifyContent: 'center'
          }}>
            <button 
              onClick={() => {
                setPreviewUrl(null)
                setImageFile(null)
                setProcessingError(null)
              }}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: '#4b5563',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              重拍
            </button>
            
            <button 
              onClick={handleSubmit}
              style={{
                padding: '12px 30px',
                borderRadius: '8px',
                backgroundColor: '#047857',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                flex: '1',
                maxWidth: '200px'
              }}
            >
              继续
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden canvas used for capturing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default TonguePhoto