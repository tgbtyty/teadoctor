import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Justtree.png'

function FeelingInput() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const navigate = useNavigate()

  const presetOptions = [
    { id: 'sleep', text: '睡眠不好', translation: 'Poor sleep' },
    { id: 'energy', text: '精力不足', translation: 'Lack of energy' },
    { id: 'mood', text: '性情不好', translation: 'Bad mood' },
    { id: 'constipation', text: '便秘', translation: 'Constipation' },
    { id: 'appetite', text: '胃口不好', translation: 'Poor appetite' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine the selected options and custom text
    let finalText = '';
    
    // Add the selected preset options
    if (selectedOptions.length > 0) {
      const selectedTexts = selectedOptions.map(id => {
        const option = presetOptions.find(opt => opt.id === id);
        return `${option.text} (${option.translation})`;
      });
      finalText += selectedTexts.join(', ') + '. ';
    }
    
    // Add the custom text if provided
    if (customText.trim()) {
      finalText += customText;
    }
    
    // Store in localStorage and navigate
    localStorage.setItem('userFeeling', finalText);
    navigate('/tongue-photo');
  };

  const toggleOption = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const logoStyle = {
    width: '120px',
    height: 'auto',
    marginBottom: '20px'
  };

  const titleStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#98fb98',
    marginBottom: '10px',
    textAlign: 'center'
  };

  const subtitleStyle = {
    fontSize: '17px',
    color: '#bfbdbd',
    marginBottom: '40px',
    textAlign: 'center'
  };

  const formStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  };

  const optionsContainerStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const optionStyle = {
    backgroundColor: '#2a2a2a',
    border: '2px solid #98fb98',
    borderRadius: '8px',
    padding: '15px',
    color: '#98fb98',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const selectedOptionStyle = {
    ...optionStyle,
    backgroundColor: '#1e3a2e'
  };

  const optionTextStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const translationStyle = {
    fontSize: '14px',
    color: '#7dcea0',
    fontStyle: 'italic'
  };

  const checkmarkStyle = {
    color: '#98fb98',
    fontSize: '24px'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '150px',
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #98fb98',
    fontSize: '16px',
    backgroundColor: '#2a2a2a',
    color: '#98fb98',
    outline: 'none'
  };

  const buttonStyle = {
    backgroundColor: '#2a2a2a',
    color: '#98fb98',
    padding: '12px 30px',
    borderRadius: '8px',
    border: '2px solid #98fb98',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '10px'
  };

  return (
    <>
      <img src={logo} alt="Tea Guru Logo" style={logoStyle} />
      <h1 style={titleStyle}>Tea Guru</h1>
      <h2 style={subtitleStyle}>我可以帮你中医辨证、舌诊、养生搭配，请把你的要求告诉我吧!</h2>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={optionsContainerStyle}>
          {presetOptions.map(option => (
            <div 
              key={option.id} 
              style={selectedOptions.includes(option.id) ? selectedOptionStyle : optionStyle}
              onClick={() => toggleOption(option.id)}
            >
              <div style={optionTextStyle}>
                <span>{option.text}</span>
                <span style={translationStyle}>{option.translation}</span>
              </div>
              {selectedOptions.includes(option.id) && (
                <span style={checkmarkStyle}>✓</span>
              )}
            </div>
          ))}
          
          // Update the onClick handler for the "另外" option
<div 
  style={showCustomInput ? selectedOptionStyle : optionStyle}
  onClick={() => setShowCustomInput(!showCustomInput)}
>
  <div style={optionTextStyle}>
    <span>另外</span>
    <span style={translationStyle}>Other symptoms</span>
  </div>
  {showCustomInput && (
    <span style={checkmarkStyle}>✓</span>
  )}
</div>
        </div>
        
        {showCustomInput && (
          <textarea 
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            style={textareaStyle}
            placeholder="请描述其他症状..."
          />
        )}
        
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
          disabled={selectedOptions.length === 0 && !customText.trim()}
        >
          下一步
        </button>
      </form>
    </>
  )
}

export default FeelingInput