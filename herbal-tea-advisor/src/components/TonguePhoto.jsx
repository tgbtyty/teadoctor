import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload } from 'lucide-react'

function TonguePhoto() {
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)
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

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      fileInputRef.current.click()
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Could not access camera. Please upload a photo instead.')
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

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Tongue Analysis</h2>
      
      <button 
        onClick={handleCapture}
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