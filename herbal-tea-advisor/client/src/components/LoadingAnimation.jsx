import React from 'react';

const LoadingAnimation = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px'
  };

  const loadingTextStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#98fb98', // Changed to match app theme green
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#bfbdbd', // Light gray color for better contrast
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          @keyframes sway {
            0%, 100% { transform: translateX(0px) rotate(0deg); }
            50% { transform: translateX(10px) rotate(-10deg); }
          }
          .leaf {
            animation: float 3s ease-in-out infinite;
          }
          .leaf:nth-child(2) {
            animation: sway 3s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          .leaf:nth-child(3) {
            animation: float 3s ease-in-out infinite;
            animation-delay: 1s;
          }
        `}
      </style>
      
      <div style={{ position: 'relative', width: '96px', height: '96px', marginBottom: '32px' }}>
        {/* Three floating leaves */}
        <svg className="leaf" style={{ position: 'absolute', top: '0', left: '0' }} viewBox="0 0 24 24" width="40" height="40" fill="#98fb98">
          <path d="M17.5,7.2c0,0-4.5-4.5-9.5-1.5s-4,9-4,9s4.5,4.5,9.5,1.5S17.5,7.2,17.5,7.2z"/>
        </svg>
        <svg className="leaf" style={{ position: 'absolute', top: '32px', left: '32px' }} viewBox="0 0 24 24" width="35" height="35" fill="#7dcea0">
          <path d="M17.5,7.2c0,0-4.5-4.5-9.5-1.5s-4,9-4,9s4.5,4.5,9.5,1.5S17.5,7.2,17.5,7.2z"/>
        </svg>
        <svg className="leaf" style={{ position: 'absolute', top: '16px', left: '64px' }} viewBox="0 0 24 24" width="30" height="30" fill="#047857">
          <path d="M17.5,7.2c0,0-4.5-4.5-9.5-1.5s-4,9-4,9s4.5,4.5,9.5,1.5S17.5,7.2,17.5,7.2z"/>
        </svg>
      </div>

      <h2 style={loadingTextStyle}>正在分析...</h2>
      <p style={subtitleStyle}>请稍等片刻，我们正在为您准备个性化的茶饮推荐</p>
    </div>
  );
};

export default LoadingAnimation;