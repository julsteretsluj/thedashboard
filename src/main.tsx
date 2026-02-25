import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SupabaseAuthProvider, FallbackAuthProvider } from './context/SupabaseAuthContext'
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

const hasSupabase =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY)

const AuthWrapper = hasSupabase ? SupabaseAuthProvider : FallbackAuthProvider

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
