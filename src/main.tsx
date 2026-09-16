import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// /present is the full-screen flowchart used while pitching; everything else is the site.
// It is split out so regular visitors never download it.
const Present = lazy(() => import('./pages/Present'))
const isPresent = window.location.pathname.replace(/\/+$/, '') === '/present'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isPresent ? (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Present />
        </Suspense>
      ) : (
        <App />
      )}
    </ErrorBoundary>
  </React.StrictMode>,
)
