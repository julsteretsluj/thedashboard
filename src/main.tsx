import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FirebaseAuthProvider, FallbackAuthProvider } from './context/FirebaseAuthContext'
import App from './App'
import './index.css'

// Suppress known benign error from browser extensions (async message channel closed before response)
window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message ?? String(event.reason)
  if (typeof msg === 'string' && msg.includes('message channel closed before a response was received')) {
    event.preventDefault()
    event.stopPropagation()
  }
})

const hasFirebase =
  Boolean(import.meta.env.VITE_FIREBASE_API_KEY) &&
  Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)

const AuthWrapper = hasFirebase ? FirebaseAuthProvider : FallbackAuthProvider

const app = (
  <StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </BrowserRouter>
  </StrictMode>
)

createRoot(document.getElementById('root')!).render(app)
