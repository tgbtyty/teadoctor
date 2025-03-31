import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload, RotateCw } from 'lucide-react'

function TonguePhoto() {
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [permissionRequested, setPermissionRequested] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  
  // Camera controls
  const [facingMode, setFacingMode] = useState('user') // 'user' for front camera, 'environment' for back camera

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setCameraActive(false)
      stopCamera()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (imageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        localStorage.setItem('tongueImage', reader.result)
        navigate('/results')
      }
      reader.readAsDataURL(imageFile)
    }
  }

  // Request camera permission explicitly
  const requestCameraPermission = async () => {
    try {
      setPermissionRequested(true)
      
      // Just request permission without starting the stream yet
      await navigator.mediaDevices.getUserMedia({ video: true })
      
      // If we got here, permission was granted
      setCameraActive(true)
      setCameraError(false)
    } catch (err) {
      console.error('Camera permission denied:', err)
      setCameraError(true)
    }
  }

  // Initialize camera when component mounts or when camera should be active
  useEffect(() => {
    let mounted = true;
    
    if (cameraActive) {
      const initCamera = async () => {
        try {
          setCameraError(false)
          stopCamera() // Stop any existing streams first
          
          // Try to access the camera with current facing mode
          const constraints = {
            video: { 
              facingMode: facingMode,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          };
          
          console.log('Requesting camera with constraints:', constraints);
          const stream = await navigator.mediaDevices.getUserMedia(constraints)
          
          if (mounted && videoRef.current) {
            videoRef.current.srcObject = stream;
            console.log('Camera stream set to video element');
          }
        } catch (err) {
          console.error('Error accessing camera:', err)
          if (mounted) {
            setCameraError(true)
          }
        }
      }
      
      initCamera();
    }
    
    // Cleanup function to stop camera when component unmounts or camera becomes inactive
    return () => {
      mounted = false;
      if (!cameraActive) {
        stopCamera()
      }
    }
  }, [cameraActive, facingMode])
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      console.log('Stopping camera tracks');
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => {
        console.log('Stopping track:', track);
        track.stop()
      })
      videoRef.current.srcObject = null
    }
  }

  const toggleCamera = () => {
    // Toggle facing mode
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user')
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
      return;
    }
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    // Check if video is playing and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('Video dimensions not available yet, waiting...');
      setTimeout(capturePhoto, 100);
      return;
    }
    
    console.log(`Capturing photo from video: ${video.videoWidth}x${video.videoHeight}`);
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        console.log('Photo captured as blob:', blob.size, 'bytes');
        const file = new File([blob], "tongue-photo.png", { type: "image/png" })
        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setCameraActive(false)
        stopCamera()
      } else {
        console.error('Failed to create blob from canvas');
      }
    }, 'image/png', 0.9) // Higher quality for medical analysis
  }

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
      
      {!previewUrl && (
        <>
          {!cameraActive ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              width: '100%',
              alignItems: 'center'
            }}>
              <button 
                onClick={requestCameraPermission}
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
                <Camera size={20} />
                <span>拍照</span>
              </button>
              
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                margin: '20px 0'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }}></div>
                <span style={{ color: '#6b7280', fontWeight: 500 }}>或</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }}></div>
              </div>
              
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
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                }}
              >
                <Upload size={20} />
                <span>上传照片</span>
              </button>
              
              {cameraError && permissionRequested && (
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '14px'
                }}>
                  无法访问相机。请检查权限设置或使用上传照片选项。
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{
                width: '100%',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid #047857',
                backgroundColor: '#000',
                aspectRatio: '4/3'
              }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                  }}
                />
                <button 
                  onClick={toggleCamera}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    color: '#047857',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                  title="切换摄像头"
                >
                  <RotateCw size={20} />
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px',
                width: '100%',
                justifyContent: 'center'
              }}>
                <button 
                  onClick={capturePhoto}
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
                  拍照
                </button>
                <button 
                  onClick={() => {
                    setCameraActive(false)
                    stopCamera()
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
                  取消
                </button>
              </div>
            </>
          )}
        </>
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
                setPermissionRequested(false)
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