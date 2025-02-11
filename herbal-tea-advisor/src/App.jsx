// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FeelingInput from './components/FeelingInput'
import TonguePhoto from './components/TonguePhoto'
import Results from './components/Results'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-emerald-700 text-white p-4 shadow-lg">
          <h1 className="text-2xl font-bold text-center">中药茶配AI</h1>
        </header>
        <main className="container mx-auto px-4 py-8">
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





