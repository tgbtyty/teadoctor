import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FeelingInput from './components/FeelingInput'
import TonguePhoto from './components/TonguePhoto'
import Results from './components/Results'

function App() {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a' // Dark background
  }

  const mainContentStyle = {
    width: '100%',
    maxWidth: '800px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }

  return (
    <Router>
      <div style={containerStyle}>
        <main style={mainContentStyle}>
          <Routes>
            <Route path="/" element={<FeelingInput />} />
            <Route path="/tongue-photo" element={<TonguePhoto />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App