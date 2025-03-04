import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingAnimation from './LoadingAnimation'
import defaultHerbImage from '../assets/chineseherb.PNG'
import logo from '../assets/Justtree.png'

// API base URL - will come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Results() {
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tongueImage, setTongueImage] = useState(null)
  const navigate = useNavigate()

  const containerStyle = {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  }

  const logoStyle = {
    width: '120px',
    height: 'auto',
    marginBottom: '20px',
    alignSelf: 'center'
  }

  const boxStyle = {
    backgroundColor: '#2a2a2a',
    border: '2px solid #98fb98',
    borderRadius: '12px',
    padding: '20px',
    color: '#98fb98'
  }

  const herbBoxStyle = {
    backgroundColor: '#2a2a2a',
    border: '2px solid #98fb98',
    borderRadius: '12px',
    padding: '0',
    color: '#98fb98',
    display: 'flex',
    overflow: 'hidden'
  }

  const herbImageContainerStyle = {
    width: '200px',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0
  }

  const herbImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }

  const herbImageOverlayStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50px',
    background: 'linear-gradient(to right, transparent, #2a2a2a)'
  }

  const herbContentStyle = {
    flex: 1,
    padding: '20px'
  }

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#98fb98',
    textAlign: 'center',
    marginBottom: '30px'
  }

  const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#99eb96'
  }

  const buttonStyle = {
    backgroundColor: '#2a2a2a',
    color: '#98fb98',
    padding: '10px 30px',
    borderRadius: '8px',
    border: '2px solid #98fb98',
    fontSize: '16px',
    cursor: 'pointer',
    alignSelf: 'center',
    marginTop: '20px',
    transition: 'all 0.2s ease'
  }

  // Added tongue diagnosis box styling
  const tongueBoxStyle = {
    ...boxStyle,
    padding: '0',
  }

  const tongueImageStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'contain',
    borderRadius: '10px 10px 0 0',
    position: 'relative',
    background: '#000',
    display: 'block'
  }

  const tongueOverlayContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '300px',
    borderRadius: '10px 10px 0 0',
    overflow: 'hidden'
  }

  const tongueOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  }

  const tongueContentStyle = {
    padding: '20px'
  }

  // Generate a "scanning" animation effect
  const scannerAnimation = `
    @keyframes scanLine {
      0% {
        top: 0%;
      }
      100% {
        top: 100%;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 0.8;
      }
    }
  `;

  useEffect(() => {
    const analyzeData = async () => {
      try {
        const userFeeling = localStorage.getItem('userFeeling')
        const tongueImageData = localStorage.getItem('tongueImage')

        if (!userFeeling || !tongueImageData) {
          throw new Error('Missing required information')
        }

        // Store the tongue image for displaying
        setTongueImage(tongueImageData)

        // Make a request to our backend API
        const response = await fetch(`${API_BASE_URL}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userFeeling,
            tongueImage: tongueImageData
          }),
        })

        // Check if response is ok
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error analyzing data');
        }

        const parsedAnalysis = await response.json();
        setAnalysis(parsedAnalysis);
      } catch (err) {
        console.error('Analysis error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    analyzeData()
  }, [])

  if (loading) return <LoadingAnimation />

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={boxStyle}>
          <h2 style={sectionTitleStyle}>Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')}
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
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <style>
        {scannerAnimation}
      </style>
      
      <img src={logo} alt="Tea Guru Logo" style={logoStyle} />
      <h1 style={titleStyle}>Tea Guru</h1>

      {/* Tongue Diagnosis Box */}
      <div style={tongueBoxStyle}>
        <div style={tongueOverlayContainerStyle}>
          <img 
            src={tongueImage} 
            alt="Tongue Image" 
            style={tongueImageStyle}
          />
          <svg 
            style={tongueOverlayStyle} 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Animated scanner line */}
            <line 
              x1="0" 
              y1="50" 
              x2="100" 
              y2="50" 
              stroke="#98fb98" 
              strokeWidth="0.5" 
              strokeDasharray="2,1"
              style={{ 
                animation: 'scanLine 2s linear infinite',
                position: 'absolute',
                top: '0'
              }}
            />
            
            {/* Target area highlight - roughly centered around likely tongue position */}
            <circle 
              cx="50" 
              cy="50" 
              r="30" 
              fill="none" 
              stroke="#98fb98" 
              strokeWidth="0.8" 
              strokeDasharray="3,1"
              style={{ animation: 'pulse 2s ease-in-out infinite' }} 
            />
            
            {/* Corner brackets */}
            <path d="M 5,5 L 5,15 M 5,5 L 15,5" stroke="#98fb98" strokeWidth="1" />
            <path d="M 95,5 L 95,15 M 95,5 L 85,5" stroke="#98fb98" strokeWidth="1" />
            <path d="M 5,95 L 5,85 M 5,95 L 15,95" stroke="#98fb98" strokeWidth="1" />
            <path d="M 95,95 L 95,85 M 95,95 L 85,95" stroke="#98fb98" strokeWidth="1" />
            
            {/* Data points */}
            <text x="3" y="3" fontSize="3" fill="#98fb98">舌诊分析</text>
            <text x="80" y="97" fontSize="2.5" fill="#98fb98">AI 图像识别</text>
          </svg>
        </div>
        <div style={tongueContentStyle}>
          <h2 style={sectionTitleStyle}>舌象分析</h2>
          <p>{analysis?.patientOverview.tongueAnalysis}</p>
        </div>
      </div>

      {/* General Analysis Box */}
      <div style={boxStyle}>
        <h2 style={sectionTitleStyle}>整体分析</h2>
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ color: '#7dcea0', marginBottom: '8px' }}>基本分析</h3>
          <p>{analysis?.patientOverview.primaryConcerns}</p>
        </div>
        <div>
          <h3 style={{ color: '#7dcea0', marginBottom: '8px' }}>AI建议</h3>
          <p>{analysis?.patientOverview.recommendationBasis}</p>
        </div>
      </div>

      {/* Emperor Herb Box */}
      <div style={herbBoxStyle}>
        <div style={herbImageContainerStyle}>
          <img 
            src={defaultHerbImage} 
            alt={analysis?.herbalFormula.emperor.traditional_name}
            style={herbImageStyle}
          />
          <div style={herbImageOverlayStyle}></div>
        </div>
        <div style={herbContentStyle}>
          <h2 style={{ ...sectionTitleStyle, color: '#ff9999' }}>君方</h2>
          <h3 style={{ color: '#ff9999', marginBottom: '8px' }}>
            {analysis?.herbalFormula.emperor.traditional_name}
          </h3>
          <p style={{ marginBottom: '15px' }}>{analysis?.herbalFormula.emperor.role}</p>
          <p>{analysis?.herbalFormula.emperor.specific_benefits}</p>
        </div>
      </div>

      {/* Minister Herb Box */}
      <div style={herbBoxStyle}>
        <div style={herbImageContainerStyle}>
          <img 
            src={defaultHerbImage} 
            alt={analysis?.herbalFormula.minister.traditional_name}
            style={herbImageStyle}
          />
          <div style={herbImageOverlayStyle}></div>
        </div>
        <div style={herbContentStyle}>
          <h2 style={{ ...sectionTitleStyle, color: '#99ff99' }}>臣方</h2>
          <h3 style={{ color: '#99ff99', marginBottom: '8px' }}>
            {analysis?.herbalFormula.minister.traditional_name}
          </h3>
          <p style={{ marginBottom: '15px' }}>{analysis?.herbalFormula.minister.role}</p>
          <p>{analysis?.herbalFormula.minister.specific_benefits}</p>
        </div>
      </div>

      {/* Assistant and Courier Herbs Box */}
      <div style={boxStyle}>
        {/* Assistant Herb */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ width: '200px', flexShrink: 0 }}>
            <img 
              src={defaultHerbImage} 
              alt={analysis?.herbalFormula.assistant.traditional_name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ ...sectionTitleStyle, color: '#9999ff' }}>佐使方</h2>
            <h3 style={{ color: '#9999ff', marginBottom: '8px' }}>
              {analysis?.herbalFormula.assistant.traditional_name}
            </h3>
            <p style={{ marginBottom: '15px' }}>{analysis?.herbalFormula.assistant.role}</p>
            <p>{analysis?.herbalFormula.assistant.specific_benefits}</p>
          </div>
        </div>
        
        {/* Courier Herb */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '200px', flexShrink: 0 }}>
            <img 
              src={defaultHerbImage} 
              alt={analysis?.herbalFormula.courier.traditional_name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#ffff99', marginBottom: '8px', fontSize: '24px', fontWeight: 'bold' }}>
              {analysis?.herbalFormula.courier.traditional_name}
            </h3>
            <p style={{ marginBottom: '15px' }}>{analysis?.herbalFormula.courier.role}</p>
            <p>{analysis?.herbalFormula.courier.specific_benefits}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/')}
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
        Start Over
      </button>
    </div>
  )
}

export default Results