import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FirebaseAuthProvider, FallbackAuthProvider } from './context/FirebaseAuthContext'
import App from './App'
import './index.css'

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
