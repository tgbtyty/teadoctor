import { useEffect, useState, useRef } from 'react'
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const tongueImageRef = useRef(null)
  const tongueCanvasRef = useRef(null)
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
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '10px 10px 0 0',
    background: '#000',
    display: 'block'
  }

  const tongueOverlayContainerStyle = {
    position: 'relative',
    width: '100%',
    borderRadius: '10px 10px 0 0',
    overflow: 'hidden'
  }

  const tongueCanvasStyle = {
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
        opacity: 0.3;
      }
      50% {
        opacity: 0.8;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .scanner-line {
      position: absolute;
      left: 0;
      height: 2px;
      width: 100%;
      background: linear-gradient(90deg, rgba(152, 251, 152, 0) 0%, rgba(152, 251, 152, 0.8) 50%, rgba(152, 251, 152, 0) 100%);
      animation: scanLine 3s linear infinite;
      z-index: 2;
    }

    .tongue-points {
      animation: pulse 2s ease-in-out infinite;
    }

    .annotation-line {
      animation: fadeIn 1s ease-out forwards;
      stroke-dasharray: 5,3;
    }
  `;

  // Draw the tongue analysis overlay on top of the image
  const drawTongueAnalysisOverlay = () => {
    if (!tongueImageRef.current || !tongueCanvasRef.current || !imageLoaded) return;
    
    const img = tongueImageRef.current;
    const canvas = tongueCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match the image's display size
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a semi-intelligent tongue detection area
    // This creates a more realistic-looking "analysis" by adapting to the image proportions
    
    // Calculate the center area of the image (where the tongue is likely to be)
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const centerX = imgWidth / 2;
    const centerY = imgHeight / 2;
    
    // For the main analysis area, make an oval shape targeted at the center of the image
    // Adapt sizes based on image orientation
    const isWide = imgWidth > imgHeight;
    
    // Create a tongue-like shape
    const tongueWidth = isWide ? imgWidth * 0.45 : imgWidth * 0.6;
    const tongueHeight = isWide ? imgHeight * 0.7 : imgHeight * 0.5;
    
    // Draw tongue outline (slightly oval, tongue-like shape)
    ctx.beginPath();
    // Draw a rounded-top tongue shape
    ctx.moveTo(centerX - tongueWidth/2, centerY + tongueHeight/3);
    ctx.bezierCurveTo(
      centerX - tongueWidth/2, centerY - tongueHeight/2,
      centerX + tongueWidth/2, centerY - tongueHeight/2,
      centerX + tongueWidth/2, centerY + tongueHeight/3
    );
    // Draw the bottom round part of the tongue
    ctx.bezierCurveTo(
      centerX + tongueWidth/2, centerY + tongueHeight*0.8,
      centerX - tongueWidth/2, centerY + tongueHeight*0.8,
      centerX - tongueWidth/2, centerY + tongueHeight/3
    );
    
    // Style the tongue outline
    ctx.strokeStyle = 'rgba(152, 251, 152, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add pulse effect to the tongue area
    ctx.fillStyle = 'rgba(152, 251, 152, 0.1)';
    ctx.fill();
    
    // Add analysis points
    const pointSize = Math.min(imgWidth, imgHeight) * 0.01;
    const pointSpacing = Math.min(imgWidth, imgHeight) * 0.06;
    
    for (let i = -3; i <= 3; i++) {
      for (let j = -1; j <= 2; j++) {
        if (Math.random() > 0.3) {  // Skip some points randomly
          const x = centerX + i * pointSpacing + (Math.random() - 0.5) * pointSpacing;
          const y = centerY + j * pointSpacing + (Math.random() - 0.5) * pointSpacing;
          
          // Skip points too far from the tongue shape
          const distFromCenterX = (x - centerX) / (tongueWidth/2);
          const distFromCenterY = (y - centerY) / (tongueHeight/2);
          const ellipticalDist = distFromCenterX * distFromCenterX + distFromCenterY * distFromCenterY;
          
          if (ellipticalDist < 1) {
            ctx.beginPath();
            ctx.arc(x, y, pointSize, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(152, 251, 152, 0.8)';
            ctx.fill();
          }
        }
      }
    }
    
    // Add analysis cross-lines
    const numLines = 4;
    for (let i = 0; i < numLines; i++) {
      const startX = centerX - tongueWidth * 0.4;
      const startY = centerY - tongueHeight * 0.3 + (i * tongueHeight * 0.6 / (numLines - 1));
      const endX = centerX + tongueWidth * 0.4;
      const endY = startY;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'rgba(152, 251, 152, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Add some annotations around the tongue
    // Top annotation
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - tongueHeight * 0.4);
    ctx.lineTo(centerX, centerY - tongueHeight * 0.6);
    ctx.lineTo(centerX + 50, centerY - tongueHeight * 0.6);
    ctx.strokeStyle = 'rgba(152, 251, 152, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.font = '10px Arial';
    ctx.fillStyle = 'rgba(152, 251, 152, 0.8)';
    ctx.fillText('舌尖', centerX + 55, centerY - tongueHeight * 0.6 + 3);
    
    // Side annotation
    ctx.beginPath();
    ctx.moveTo(centerX + tongueWidth * 0.4, centerY);
    ctx.lineTo(centerX + tongueWidth * 0.6, centerY);
    ctx.lineTo(centerX + tongueWidth * 0.6, centerY + 30);
    ctx.stroke();
    
    ctx.fillText('舌苔', centerX + tongueWidth * 0.6 + 5, centerY + 33);
    
    // Add technical overlay elements
    // Corner markers
    const markerSize = Math.min(imgWidth, imgHeight) * 0.03;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(markerSize, markerSize);
    ctx.lineTo(markerSize*2, markerSize);
    ctx.moveTo(markerSize, markerSize);
    ctx.lineTo(markerSize, markerSize*2);
    ctx.strokeStyle = 'rgba(152, 251, 152, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(imgWidth - markerSize, markerSize);
    ctx.lineTo(imgWidth - markerSize*2, markerSize);
    ctx.moveTo(imgWidth - markerSize, markerSize);
    ctx.lineTo(imgWidth - markerSize, markerSize*2);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(markerSize, imgHeight - markerSize);
    ctx.lineTo(markerSize*2, imgHeight - markerSize);
    ctx.moveTo(markerSize, imgHeight - markerSize);
    ctx.lineTo(markerSize, imgHeight - markerSize*2);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(imgWidth - markerSize, imgHeight - markerSize);
    ctx.lineTo(imgWidth - markerSize*2, imgHeight - markerSize);
    ctx.moveTo(imgWidth - markerSize, imgHeight - markerSize);
    ctx.lineTo(imgWidth - markerSize, imgHeight - markerSize*2);
    ctx.stroke();
    
    // Add data displays
    ctx.font = '9px Arial';
    ctx.fillStyle = 'rgba(152, 251, 152, 0.8)';
    ctx.fillText('舌诊分析', markerSize, markerSize - 5);
    ctx.fillText('AI 图像识别', imgWidth - markerSize - 80, imgHeight - markerSize + 15);
    
    // Add scan line (this is done with CSS animation)
    const scanLine = document.createElement('div');
    scanLine.className = 'scanner-line';
    const overlay = document.getElementById('tongue-overlay-container');
    if (overlay) {
      // Remove any existing scan lines
      const existingLines = overlay.getElementsByClassName('scanner-line');
      Array.from(existingLines).forEach(line => line.remove());
      
      // Add the new scan line
      overlay.appendChild(scanLine);
    }
  };

  useEffect(() => {
    const analyzeData = async () => {
      try {
        const userFeeling = localStorage.getItem('userFeeling');
        const tongueImage = localStorage.getItem('tongueImage');
  
        console.log("UserFeeling data size:", userFeeling?.length || 0);
        console.log("TongueImage data size:", tongueImage?.length || 0);
  
        if (!userFeeling) {
          throw new Error('Missing user feeling information');
        }
        
        if (!tongueImage) {
          throw new Error('Missing tongue image');
        }
        
        if (tongueImage.length > 5000000) {
          throw new Error('Image too large (>5MB)');
        }
  
        // Make a request to our backend API
        console.log("Sending API request...");
        const response = await fetch(`${API_BASE_URL}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userFeeling,
            tongueImage
          }),
        });
  
        // Check if response is ok
        if (!response.ok) {
          console.error("API response error:", response.status, response.statusText);
          const errorData = await response.text();
          console.error("Error response body:", errorData);
          throw new Error(errorData || `Error analyzing data: ${response.statusText}`);
        }
  
        console.log("Parsing API response...");
        const parsedAnalysis = await response.json();
        setAnalysis(parsedAnalysis);
        console.log("Analysis data received and set");
      } catch (err) {
        console.error('Analysis error details:', err);
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    analyzeData();
  }, []);

  // Effect to draw the tongue analysis overlay when the image is loaded
  useEffect(() => {
    if (imageLoaded) {
      drawTongueAnalysisOverlay();
      
      // Update the overlay on window resize
      const handleResize = () => drawTongueAnalysisOverlay();
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [imageLoaded]);

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
        <div style={tongueOverlayContainerStyle} id="tongue-overlay-container">
          <img 
            ref={tongueImageRef}
            src={tongueImage} 
            alt="Tongue Image" 
            style={tongueImageStyle}
            onLoad={() => setImageLoaded(true)}
          />
          <canvas 
            ref={tongueCanvasRef}
            style={tongueCanvasStyle}
          />
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