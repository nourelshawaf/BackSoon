import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Present from './pages/Present'
import './index.css'

// /present is the full-screen flowchart used while pitching; everything else is the site.
const isPresent = window.location.pathname.replace(/\/+$/, '') === '/present'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isPresent ? <Present /> : <App />}
  </React.StrictMode>,
)
