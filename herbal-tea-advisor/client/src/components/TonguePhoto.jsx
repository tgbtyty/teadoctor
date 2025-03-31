import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload } from 'lucide-react'

function TonguePhoto() {
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(false)
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

  // Initialize camera when component mounts
  useEffect(() => {
    if (cameraActive) {
      startCamera()
    }
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera()
    }
  }, [cameraActive, facingMode]) // Restart camera when facing mode changes or camera active state changes

  const startCamera = async () => {
    try {
      setCameraError(false)
      stopCamera() // Stop any existing streams first
      
      // Try to access the camera with current facing mode
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setCameraError(true)
      setCameraActive(false)
    }
  }
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const toggleCamera = () => {
    // First stop the current camera
    stopCamera()
    
    // Toggle facing mode
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user')
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    
    // Wait until video is ready
    if (video.readyState !== 4) {
      setTimeout(capturePhoto, 100)
      return
    }
    
    const context = canvas.getContext('2d')
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "tongue-photo.png", { type: "image/png" })
        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setCameraActive(false)
        stopCamera()
      }
    }, 'image/png')
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
                onClick={() => setCameraActive(true)}
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
            </div>
          ) : (
            <>
              {cameraError ? (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#ef4444'
                }}>
                  <p>无法访问相机。请检查您的相机权限或尝试上传照片。</p>
                  <button 
                    onClick={() => setCameraActive(false)}
                    style={{
                      marginTop: '15px',
                      padding: '8px 16px',
                      backgroundColor: '#047857',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    返回
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    width: '100%',
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #047857',
                    backgroundColor: '#000'
                  }}>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
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
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '15px'
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
                        cursor: 'pointer'
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
            gap: '15px'
          }}>
            <button 
              onClick={() => {
                setPreviewUrl(null)
                setImageFile(null)
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
                cursor: 'pointer'
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