import React, {useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleFailure, handleSuccess } from '../../utils/notification';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

//import { ApiCall } from '../utils/apiCall';

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [registerInfo, setRegisterInfo] = useState({
    fullname: '',
    username: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const Icon = showPassword ? Eye : EyeOff;

  const handleChange = (e) => {
    const {name, value} = e.target;
    const copyRegisterInfo = {...registerInfo};
    copyRegisterInfo[name] = value;
    setRegisterInfo(copyRegisterInfo);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    const {fullname, username, email, password} = registerInfo;

    if(!fullname || !username || !email || !password) {
      return handleFailure('All fields are required');
    }
    
    try {
      const url = "/v2/users/register";
      const response = await axios.post(url, registerInfo);

      const {success, message} = response.data;

      if(success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login');
        },2000);
      }


    } catch (error) {
      if (error.response) {
        const { message, data } = error.response.data;
        const details = data?.details?.[0]?.message;
        handleFailure(details || message);
      } else {
        handleFailure("SERVER ERROR: " + error.message);
      }
    }
  }

  return (
    <div className='h-screen w-full flex justify-center bg-gray-900 items-center'>
      <div className='max-w-[350px] sm:max-w-[400px] w-full bg-gray-300 p-5 rounded-md'>
      <h1 className='text-blue-600 font-bold text-2xl sm:text-[26px] text-center mb-3'>Register</h1>

      <form onSubmit={handleRegister}>
        <div className='flex flex-col gap-1 mb-3'>
          <label htmlFor='fullname' className='font-semibold'>Fullname</label>
          <input onChange={handleChange}
            name='fullname'
            id='fullname' 
            type='text' 
            placeholder='Enter fullname'
            autoFocus 
            value={registerInfo.fullname}
            className='px-2 py-1 rounded bg-white outline-0' />
        </div>

        <div className='flex flex-col gap-1 mb-3'>
          <label htmlFor='username' className='font-semibold'>Username</label>
          <input onChange={handleChange}
            name='username' 
            id='username' 
            type='text' 
            placeholder='Enter username'
            value={registerInfo.username} 
            className='px-2 py-1 rounded bg-white outline-0' />
        </div>

        <div className='flex flex-col gap-1 mb-3'> 
          <label htmlFor='email' className='font-semibold'>Email</label>
          <input onChange={handleChange}
            name='email' 
            id='email' 
            type='email' 
            placeholder='Enter email'
            value={registerInfo.email} 
            className='px-2 py-1 rounded bg-white outline-0' />
        </div>

        <div className='flex flex-col gap-1 mb-3'>
          <label htmlFor='password' className='font-semibold'>Password</label>
          <div className='flex items-center justify-between bg-white px-2 py-1 rounded'>
            <input onChange={handleChange} 
              name='password' 
              id='password' 
              type= {showPassword ? 'text' : 'password'} 
              placeholder='Enter password'
              value={registerInfo.password} 
              className='w-[90%] outline-0' />
              <Icon onClick={() => setShowPassword(!showPassword)} size={16} className='cursor-pointer' />
          </div>
        </div>
        
        <button type='submit' className='w-full bg-blue-600 text-white my-3 p-2 
        rounded cursor-pointer hover:bg-blue-500'>Register</button>
      </form>

      <div className='flex gap-1 mt-2 justify-center items-center'>
        <p>Already have an account?</p>
        <p className='underline text-blue-600 cursor-pointer'><Link to='/login'>log in</Link></p> 
      </div>
      </div>
    </div>
  )
}

export default RegisterForm