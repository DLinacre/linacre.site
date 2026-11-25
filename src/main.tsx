import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Studio from './studio/Studio';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Studio />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.error('Service worker registration failed:', err);
    });
  });
}
