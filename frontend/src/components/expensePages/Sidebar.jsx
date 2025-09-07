import React, { useContext, useState } from 'react'
import { CircleUserRound, LayoutDashboard, Moon, Sun, User, Wallet } from 'lucide-react'
import { ChartNoAxesColumn } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { ExpenseApi } from '../../context/expenseContext';
import { handleFailure, handleSuccess } from '../../utils/notification';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {

  const {step, setStep, toggle, setToggle, username, darkMode, setDarkMode} = useContext(ExpenseApi);
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);

  const logOutUser = async () => {
    try {
      const url = '/v2/users/logout';
      const response = await axios.get(url);
      const {message, success} = response.data;
      
      if(success) {
        handleSuccess(message);
        setTimeout(navigate('/login'), 1000);
      }
      setStep(1);
    } catch (error) {
      if(error.response) {
        const {data, message} = error.response.data;
        const details = data?.details[0]?.message;
        handleFailure(details || message);
      }
      else handleFailure("SERVER ERROR: " + error.message);
    }
  }

  return (
    <>
    <div 
      className={`fixed top-0 left-0 bg-black h-full w-full opacity-40 z-45
      ${toggle ? 'block' : 'hidden'}`}>
    </div>
    <div 
      className={`fixed top-0 left-0 bg-black h-full w-full opacity-40 z-45
      ${showPopUp ? 'block' : 'hidden'}`}>
    </div>

    {showPopUp && (<div className='top-[40%] max-w-[300px] w-full mx-auto left-1/2 absolute z-70 bg-[#170d47]  p-5 rounded text-white
    -translate-x-1/2 -translate-y-1/2'>
      <h1 className='text-center font-bold text-xl mb-3'>Log Out</h1>
      <p className='font-semibold'>Are you sure you want to log out?</p>
      <div className='flex items-center gap-3 mt-5'>
        <button onClick={() => {logOutUser(); setShowPopUp(false)}}
        className='bg-blue-700 rounded p-2 font-semibold w-1/2 cursor-pointer hover:bg-blue-600'>OK</button>
        <button onClick={() => setShowPopUp(false)}
        className='bg-gray-300 w-1/2 text-black font-semibold rounded p-2 cursor-pointer hover:bg-gray-400'>Cancel</button>
      </div>
    </div>)}

    <div className={`flex flex-col w-[300px] lg:w-[24%] text-white z-60 bg-[#1E1E2E] 
     min-h-screen fixed top-0 left-0 ${toggle ? 'translate-x-0' : '-translate-x-full'} 
     transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}>
      <div className='flex items-center gap-3 p-4 border-b'>
        <Wallet />
        <h1 className='text-xl font-semibold'>Expense Tracker</h1>
      </div>
      <div className='flex-1 m-7'>
        <div onClick={() => {setStep(1); setToggle(false)}}
        className={`flex items-center gap-4 mb-5 py-2 ${step === 1 ? 'bg-blue-600' : ''}
        px-3 rounded-md cursor-pointer hover:bg-blue-700`}>
          <LayoutDashboard />
          <p className='text-lg font-semibold'>Dashboard</p>
        </div>
        <div onClick={() => {setStep(2); setToggle(false)}}
        className={`flex items-center gap-4 mb-5 py-2 ${step === 2 ? 'bg-blue-600' : ''}
        px-3 rounded-md cursor-pointer hover:bg-blue-700`}>
          <ChartNoAxesColumn />
          <p className='text-lg font-semibold'>Monthly Report</p>
        </div>
        <div onClick={() => {setStep(3); setToggle(false)}}
        className={`flex items-center gap-4 mb-5 py-2 ${step === 3 ? 'bg-blue-600' : ''}
          px-3 rounded-md cursor-pointer hover:bg-blue-700`}>
          <TrendingUp />
          <p className='text-lg font-semibold'>Yearly Report</p>
        </div>
        <div onClick={() => {setShowPopUp(true); setToggle(false)}}
        className={`flex items-center gap-4 mb-5 py-2 ${step === 4 ? 'bg-blue-600' : ''}
          px-3 rounded-md cursor-pointer hover:bg-blue-700`}>
          <LogOut />
          <p className='text-lg font-semibold'>Log out</p> 
        </div>
      </div>
      <div className='flex h-[12%] justify-between items-center py-4 px-6 border-t'>
        {darkMode ? 
        <Moon onClick={() => {setDarkMode(!darkMode); setToggle(false)}} className='cursor-pointer' /> :
        <Sun onClick={() => {setDarkMode(!darkMode); setToggle(false)}} className='cursor-pointer' />}
        <div className='flex items-center gap-2 px-3 relative py-2 rounded transition-colors bg-blue-600'>
          <CircleUserRound size={26} />
          <div className=' absolute top-1 left-9 h-2 w-2 rounded-full bg-green-400 '></div>
          <p className='font-semibold'>{username}</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Sidebar