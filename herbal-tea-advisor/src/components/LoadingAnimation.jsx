import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
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
      
      <div className="relative w-24 h-24 mb-8">
        {/* Three floating leaves */}
        <svg className="leaf absolute top-0 left-0" viewBox="0 0 24 24" width="40" height="40" fill="#98fb98">
          <path d="M17.5,7.2c0,0-4.5-4.5-9.5-1.5s-4,9-4,9s4.5,4.5,9.5,1.5S17.5,7.2,17.5,7.2z"/>
        </svg>
        <svg className="leaf absolute top-8 left-8" viewBox="0 0 24 24" width="35" height="35" fill="#7dcea0">
          <path d="M17.5,7.2c0,0-4.5-4.5-9.5-1.5s-4,9-4,9s4.5,4.5,9.5,1.5S17.5,7.2,17.5,7.2z"/>
        </svg>
        <svg className="leaf absolute top-4 left-16" viewBox="0 0 24 24" width="30" height="30" fill="#047857">
          <path d="M17.5,7.2c0,0-4.5-4.5-9.5-1.5s-4,9-4,9s4.5,4.5,9.5,1.5S17.5,7.2,17.5,7.2z"/>
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-green-600 mb-2">正在分析...</h2>
      <p className="text-gray-500">请稍等片刻，我们正在为您准备个性化的茶饮推荐</p>
    </div>
  );
};

export default LoadingAnimation;