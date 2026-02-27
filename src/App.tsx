import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import GlobeView from './pages/GlobeView'
import Home from './pages/Home'
import ChairRoom from './pages/ChairRoom'
import DelegateDashboard from './pages/DelegateDashboard'
import ChairSetupGuide from './pages/ChairSetupGuide'
import DelegateSetupGuide from './pages/DelegateSetupGuide'
import About from './pages/About'
import MenuPage from './pages/Menu'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chair" element={<ChairRoom />} />
          <Route path="delegate" element={<DelegateDashboard />} />
          <Route path="globe" element={<GlobeView />} />
          <Route path="guide/chair" element={<ChairSetupGuide />} />
          <Route path="guide/delegate" element={<DelegateSetupGuide />} />
          <Route path="about" element={<About />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
