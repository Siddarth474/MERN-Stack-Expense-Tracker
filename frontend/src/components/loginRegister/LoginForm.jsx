import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { handleFailure, handleSuccess } from '../../utils/notification';
import axios from '../../utils/apiCall';
import { Eye, EyeOff } from 'lucide-react';
import { ExpenseApi } from '../../context/expenseContext';

const LoginForm = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_PUBLIC_URL;

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const {setUsername} = useContext(ExpenseApi);

  const [showPassword, setShowPassword] = useState(false);
  const Icon = showPassword ? Eye : EyeOff;

  const handleChange = (e) => {
    const {name, value} = e.target;
    const copyLoginInfo = {...loginInfo};
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const {email, password} = loginInfo;
    if(!email || !password) {
      return handleFailure('Password & Email are required!');
    }

    try {
      const response = await axios.post('/users/login', loginInfo);

      const {success, message, data} = response.data;
      console.log(response.data)
      const {user} = data;
      setUsername(user.username);
      if(success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
     
      setLoginInfo({
        email: "",
        password: ""
      });
      
    } catch (error) {
      if(error.response) {
        const {data, message} = error.response.data;
        console.log(error.response.data)
        const details = data?.details[0]?.message;
        handleFailure(details || message);
      }
      else handleFailure("SERVER ERROR: " + error.message);
    }
  }

  return (
    <div className='h-screen w-full flex flex-col justify-center bg-[#1E1E2E] items-center'>
        <div className='max-w-[400px] w-full bg-gray-300 p-5 m-4 rounded-md'>
        <h1 className='text-blue-600 font-bold text-2xl sm:text-[26px] text-center mb-3'>Login</h1>
        <form onSubmit={handleLogin}>
          <div className='flex flex-col gap-1 mb-3'> 
            <label htmlFor='email' className='font-semibold'>Email</label>
            <input onChange={handleChange} 
            name='email' 
            id='email' 
            type='email' 
            placeholder='Enter email' 
            autoFocus
            value={loginInfo.email}
            className='px-2 py-1 rounded bg-white outline-0' />
          </div>

          <div className='flex flex-col gap-1 mb-3'>
            <label htmlFor='password' className='font-semibold'>Password</label>
            <div className='flex items-center justify-between bg-white px-2 py-1 rounded'>
              <input onChange={handleChange} 
                name='password' 
                id='password' 
                type={showPassword ? 'text' : 'password'} 
                placeholder='Enter password'
                value={loginInfo.password} 
                className='w-[90%] outline-0' />
                <Icon onClick={() => setShowPassword(!showPassword)} size={16} className='cursor-pointer' />
            </div>
          </div>

          <button type='submit' className='w-full bg-blue-600 text-white my-3 p-2 
          rounded cursor-pointer hover:bg-blue-500'>Login</button>
        </form>
        
        <div className='flex gap-1 mt-2 justify-center items-center'>
          <p>Don't have an account?</p>
          <p className='underline text-blue-600 cursor-pointer'><Link to='/register'>register</Link></p> 
        </div>
      </div>
      <div className='max-w-[400px] w-full bg-gray-300 p-3 m-2 rounded-md'>
        <h2 className='text-lg font-bold mb-2 underline'>Demo Account</h2>
        <div>
          <p><span className='font-semibold'>Email:</span> rakesh@gmail.com</p>
          <p><span className='font-semibold'>Password:</span> 1234567</p>
        </div>
        <div className='mt-3'>
          <p><span className='font-semibold'>Email:</span> user@gmail.com</p>
          <p><span className='font-semibold'>Password:</span> 12345678</p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm