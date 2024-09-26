import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // If you have any global styles

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);