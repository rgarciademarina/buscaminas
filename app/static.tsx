import React from 'react';
import ReactDOM from 'react-dom/client';
import { BuscaminasGame } from './components/BuscaminasGame';
import './tailwind.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BuscaminasGame />
  </React.StrictMode>
);
