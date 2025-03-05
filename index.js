import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Ensure the CSS file is imported
import App from './App'; // Main app component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure this matches your HTML structure
);
