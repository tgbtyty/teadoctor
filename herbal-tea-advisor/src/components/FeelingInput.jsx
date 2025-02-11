// src/components/FeelingInput.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function FeelingInput() {
  const [feeling, setFeeling] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Store the feeling in localStorage for now
    localStorage.setItem('userFeeling', feeling)
    navigate('/tongue-photo')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl mb-4 text-center">我帮您寻找最配合您的茶！</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          className="w-full h-40 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500"
          placeholder="Please describe how you're feeling..."
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )
}

export default FeelingInput