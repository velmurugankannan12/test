import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './app/App';
import { AppStateProvider } from './utils/AppStateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  // </React.StrictMode>
);

