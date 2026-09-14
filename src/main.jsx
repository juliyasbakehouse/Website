import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// The browser's default automatic scroll restoration tries to restore both
// the page's scroll position AND nested scrollable elements' positions on
// navigation/reload — which fought with the cake hero's own scroll-snap
// container, occasionally landing fresh loads mid-animation instead of at
// the start. Taking manual control here is the standard fix for this class
// of SPA scroll-restoration conflict.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
