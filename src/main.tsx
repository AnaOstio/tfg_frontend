import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "./i18n";
import ReactQuery from './config/ReactQuery.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactQuery>
      <App />
    </ReactQuery>
  </React.StrictMode >,
)
