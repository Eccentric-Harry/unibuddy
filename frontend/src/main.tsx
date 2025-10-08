import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './lib/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 theme-transition">
        <App />
      </div>
    </ThemeProvider>
  </StrictMode>,
)
