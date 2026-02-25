import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import GlobeView from './pages/GlobeView'
import ChairSetupGuide from './pages/ChairSetupGuide'
import DelegateSetupGuide from './pages/DelegateSetupGuide'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GlobeView />} />
          <Route path="guide/chair" element={<ChairSetupGuide />} />
          <Route path="guide/delegate" element={<DelegateSetupGuide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
