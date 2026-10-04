import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const rootEl = document.getElementById('root');

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  // Fail visibly instead of a blank white screen (e.g. the app was
  // built without environment variables).
  rootEl.innerHTML =
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;' +
    'background:#FFFBF5;color:#1C1917;font-family:sans-serif;padding:24px;text-align:center;">' +
    '<div><div style="font-size:48px;margin-bottom:16px;">🛒</div>' +
    '<h1 style="font-size:20px;margin:0 0 8px;">P-ELLA Market failed to start</h1>' +
    '<p style="color:#78716C;font-size:14px;margin:0;">The app was built without its configuration. ' +
    'Please install the latest version or contact support.</p></div></div>';
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
