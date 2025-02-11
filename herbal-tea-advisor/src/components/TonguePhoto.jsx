// src/components/TonguePhoto.jsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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
      // Store the image in localStorage as base64 for now
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
      // Implementation for camera capture would go here
      // For now, just trigger file input
      fileInputRef.current.click()
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Could not access camera. Please upload a photo instead.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl mb-4 text-center">Tongue Analysis</h2>
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleCapture}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Take Photo
          </button>
          <span className="text-gray-500">or</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Upload Photo
          </button>
        </div>

        {previewUrl && (
          <div className="mt-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
            <button
              onClick={handleSubmit}
              className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TonguePhoto