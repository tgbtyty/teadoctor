import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload, RotateCw } from 'lucide-react'

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
    startCamera()
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera()
    }
  }, [facingMode]) // Restart camera when facing mode changes

  const startCamera = async () => {
    try {
      setCameraError(false)
      
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
        setCameraActive(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setCameraError(true)
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
    const context = canvas.getContext('2d')
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      const file = new File([blob], "tongue-photo.png", { type: "image/png" })
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setCameraActive(false)
      stopCamera()
    }, 'image/png')
  }

  // Styles
  const containerStyle = {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  }

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: '20px',
    textAlign: 'center'
  }

  const videoContainerStyle = {
    width: '100%',
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid #047857',
    backgroundColor: '#000'
  }

  const videoStyle = {
    width: '100%',
    height: 'auto',
    display: 'block',
    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' // Mirror front camera
  }

  const buttonContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '15px'
  }

  const actionButtonStyle = {
    padding: '12px 30px',
    borderRadius: '8px',
    backgroundColor: '#047857',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  }

  const switchCameraButtonStyle = {
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
  }

  const uploadContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    border: '2px dashed #047857',
    borderRadius: '8px',
    backgroundColor: 'rgba(4, 120, 87, 0.1)'
  }

  const previewContainerStyle = {
    width: '100%',
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  }

  const imagePreviewStyle = {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '2px solid #047857'
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>舌诊分析</h2>
      
      {!previewUrl && (
        <>
          {cameraActive ? (
            <>
              <div style={videoContainerStyle}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  style={videoStyle} 
                />
                <button 
                  onClick={toggleCamera}
                  style={switchCameraButtonStyle}
                  title="切换摄像头"
                >
                  <RotateCw size={20} />
                </button>
              </div>
              
              <div style={buttonContainerStyle}>
                <button 
                  onClick={capturePhoto}
                  style={actionButtonStyle}
                >
                  <Camera size={20} />
                  <span>拍照</span>
                </button>
              </div>
            </>
          ) : cameraError ? (
            <div style={uploadContainerStyle}>
              <p style={{color: '#047857', marginBottom: '10px'}}>无法访问摄像头，请上传照片</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                style={actionButtonStyle}
              >
                <Upload size={20} />
                <span>上传照片</span>
              </button>
            </div>
          ) : (
            <div style={uploadContainerStyle}>
              <p style={{color: '#047857', marginBottom: '15px'}}>正在启动摄像头...</p>
            </div>
          )}
        </>
      )}

      {previewUrl && (
        <div style={previewContainerStyle}>
          <img
            src={previewUrl}
            alt="Preview"
            style={imagePreviewStyle}
          />
          
          <div style={buttonContainerStyle}>
            <button 
              onClick={() => {
                setPreviewUrl(null);
                setImageFile(null);
                startCamera();
              }}
              style={{
                ...actionButtonStyle,
                backgroundColor: '#4b5563' // Gray color
              }}
            >
              重拍
            </button>
            
            <button 
              onClick={handleSubmit}
              style={actionButtonStyle}
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