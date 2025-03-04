import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload } from 'lucide-react'

function TonguePhoto() {
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
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

  const startCamera = async () => {
    try {
      setIsCapturing(true)
      const constraints = { 
        video: { 
          facingMode: 'user', // Use front camera first
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('无法练到相机，请上传照片.')
      setIsCapturing(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        // Create a file from the blob
        const file = new File([blob], "tongue-photo.png", { type: "image/png" })
        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        
        // Stop the camera stream
        const stream = video.srcObject
        if (stream) {
          const tracks = stream.getTracks()
          tracks.forEach(track => track.stop())
        }
        setIsCapturing(false)
      }, 'image/png')
    }
  }

  const cancelCapture = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
    setIsCapturing(false)
  }

  // Switch between front and back camera
  const toggleCamera = async () => {
    if (videoRef.current) {
      // Stop current stream
      const stream = videoRef.current.srcObject
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
      }
      
      try {
        // Get current facingMode
        const currentFacingMode = videoRef.current.srcObject.getVideoTracks()[0].getSettings().facingMode;
        
        // Toggle facingMode
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        
        // Start new stream with opposite camera
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: newFacingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });
        
        videoRef.current.srcObject = newStream;
      } catch (err) {
        console.error('Error switching camera:', err);
      }
    }
  }

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
    marginBottom: '30px',
    textAlign: 'center'
  }

  const buttonBaseStyle = {
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
    transition: 'all 0.2s ease'
  }

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#047857',
    color: 'white',
  }

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db'
  }

  const dividerStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    margin: '20px 0'
  }

  const lineStyle = {
    flex: 1,
    height: '1px',
    backgroundColor: '#d1d5db'
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

  const videoContainerStyle = {
    width: '100%',
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid #047857'
  }

  const videoStyle = {
    width: '100%',
    display: 'block',
  }

  const captureButtonsStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    justifyContent: 'center'
  }

  const switchCameraButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer'
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Tongue Analysis</h2>
      
      {!isCapturing && !previewUrl && (
        <>
          <button 
            onClick={startCamera}
            style={primaryButtonStyle}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#065f46'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#047857'}
          >
            <Camera size={20} />
            <span>Take Photo</span>
          </button>
          
          <div style={dividerStyle}>
            <div style={lineStyle}></div>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>or</span>
            <div style={lineStyle}></div>
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
            style={secondaryButtonStyle}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            <Upload size={20} />
            <span>Upload Photo</span>
          </button>
        </>
      )}

      {isCapturing && (
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
              title="Switch Camera"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"></path>
              </svg>
            </button>
          </div>
          
          <div style={captureButtonsStyle}>
            <button 
              onClick={capturePhoto}
              style={primaryButtonStyle}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#065f46'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#047857'}
            >
              Capture
            </button>
            <button 
              onClick={cancelCapture}
              style={{
                ...secondaryButtonStyle,
                width: 'auto'
              }}
            >
              Cancel
            </button>
          </div>
          
          {/* Hidden canvas used for capturing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      )}

      {previewUrl && (
        <div style={previewContainerStyle}>
          <img
            src={previewUrl}
            alt="Preview"
            style={imagePreviewStyle}
          />
          
          <button 
            onClick={handleSubmit}
            style={primaryButtonStyle}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#065f46'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#047857'}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

export default TonguePhoto