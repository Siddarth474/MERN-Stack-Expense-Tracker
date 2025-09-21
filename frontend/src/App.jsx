import { useState } from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import './App.css'
import RegisterForm from './components/loginRegister/RegisterForm'
import LoginForm from './components/loginRegister/LoginForm'
import ExpenseForm from './components/expensePages/ExpenseForm'
import { Toaster } from 'react-hot-toast';
import DashBoard from './components/expensePages/DashBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <Routes>
          <Route path='/' element={<Navigate to = '/login' />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/dashboard' element={<DashBoard />} />
          <Route path='/form' element={<ExpenseForm />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}

export default App
