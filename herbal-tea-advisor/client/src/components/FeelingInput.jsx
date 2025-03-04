import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Justtree.png'

function FeelingInput() {
  const [feeling, setFeeling] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('userFeeling', feeling)
    navigate('/tongue-photo')
  }

  const logoStyle = {
    width: '120px',
    height: 'auto',
    marginBottom: '20px'
  }



  const titleStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#98fb98', // Pale green
    marginBottom: '10px',
    textAlign: 'center'
  }

  const subtitleStyle = {
    fontSize: '17px',
    color: '#bfbdbd', // Pale green
    marginBottom: '40px',
    textAlign: 'center'
  }

  const formStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  }

  const textareaStyle = {
    width: '100%',
    minHeight: '200px',
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #98fb98',
    fontSize: '16px',
    backgroundColor: '#2a2a2a',
    color: '#98fb98',
    outline: 'none'
  }

  const buttonStyle = {
    backgroundColor: '#2a2a2a',
    color: '#98fb98',
    padding: '10px 30px',
    borderRadius: '8px',
    border: '2px solid #98fb98',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  return (
    <>
      <img src={logo} alt="Tea Guru Logo" style={logoStyle} />
      <h1 style={titleStyle}>Tea Guru</h1>
      <h2 style={subtitleStyle}>我可以帮你中医辨证、舌诊、养生搭配，请把你的要求告诉我吧!</h2>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea 
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          style={textareaStyle}
          placeholder="请把你的要求告诉我..."
          required
        />
        <button 
          type="submit" 
          style={buttonStyle}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#98fb98'
            e.currentTarget.style.color = '#1a1a1a'
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#2a2a2a'
            e.currentTarget.style.color = '#98fb98'
          }}
        >
          下一步
        </button>
      </form>
    </>
  )
}

export default FeelingInput