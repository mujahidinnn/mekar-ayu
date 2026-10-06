import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './lib/i18n'

if (import.meta.env.DEV && new URLSearchParams(location.search).has('seed')) {
  const { seedDemoData } = await import('./lib/seedDemo')
  await seedDemoData()
  history.replaceState(null, '', location.pathname)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
