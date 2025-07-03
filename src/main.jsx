import React from 'react';
import ReactDOM from 'react-dom/client';

// Polyfill para crypto.getRandomValues em ambiente de desenvolvimento Node.js
import crypto from 'crypto';
if (typeof window !== 'undefined' && (!window.crypto || !window.crypto.getRandomValues)) {
  window.crypto = window.crypto || {};
  window.crypto.getRandomValues = (arr) => crypto.randomFillSync(arr);
}

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);