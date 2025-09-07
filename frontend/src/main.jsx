import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router';
import 'react-toastify/ReactToastify.css';
import ExpenseApiProvider from './context/expenseContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseApiProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ExpenseApiProvider>
  </StrictMode>,
)
