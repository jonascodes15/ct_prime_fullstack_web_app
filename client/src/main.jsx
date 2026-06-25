import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SiteLoader from './components/common/SiteLoader';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteLoader />
    <App />
  </React.StrictMode>
);
