import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import './index.css'
import App from './App.tsx'

if (import.meta.env.DEV && new URLSearchParams(location.search).has('seed')) {
  const { seedDemoData } = await import('./lib/seedDemo')
  await seedDemoData()
  history.replaceState(null, '', location.pathname)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
