import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { Checkout } from './checkout/Checkout';
import { ToastHost } from './index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Checkout />
    <ToastHost />
  </StrictMode>,
);
