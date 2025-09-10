import React, { useContext, useState } from 'react'
import Sidebar from './Sidebar'
import { handleFailure, handleSuccess } from '../../utils/notification';
import axios from '../../utils/apiCall';
import { useNavigate, Link } from 'react-router-dom';
import { ExpenseApi } from '../../context/expenseContext';

const ExpenseForm = () => {
  const navigate = useNavigate();

  const {transactionInfo, setTransactionInfo, isEdit, setIsEdit, darkMode} = useContext(ExpenseApi);
  
  const expenseCategories = [
    'food & drinks', 
    'rent / bills', 
    'transport', 
    'shopping', 
    'entertainment',
    'health',
    'other expense'
  ];

  const incomeCategories = [
    'salary',
    'freelancing',
    'gift',
    'other income'
  ]

  const handleChange = (e) => {
    const {name, value} = e.target;
    const copyInfo = {...transactionInfo};
    copyInfo[name] = value;
    setTransactionInfo(copyInfo);
  }

  const addTransaction = async (info) => {
    try {
      const response = await axios.post('/transactions/add', info);
      const {success, message} = response.data;

      if(success) {
        handleSuccess(message);
        setTransactionInfo({
          category: '',
          amount: '',
          description: '',
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
        });
        setTimeout(() => navigate('/dashboard'), 1100);
      }

    } catch (error) {
      if(error.response) {
        const {data, message} = error.response.data;
        const details = data?.details[0]?.message;
        handleFailure(details || message);
      }
      else handleFailure("SERVER ERROR: " + error.message);
    }
  }

  const updateTransaction = async (id, updatedInfo) => {
    try {
      const response = await axios.patch(`/transactions/${id}`, updatedInfo);
      const {success, message} = response.data;

      if(success) {
        handleSuccess(message);
        setTransactionInfo({
          category: '',
          amount: '',
          description: '',
          type: "expense",
          date: new Date().toISOString().split('T')[0],
        });
        setTimeout(() => navigate('/dashboard'), 1100);
      }

    } catch (error) {
      if(error.response) {
        const {data, message} = error.response.data;
        const details = data?.details[0]?.message;
        handleFailure(details || message);
      }
      else handleFailure("SERVER ERROR: " + error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if(isEdit) {
      updateTransaction(transactionInfo._id, transactionInfo);
      setIsEdit(false);
    }
    else addTransaction(transactionInfo);
  }

  const handleCancel = () => {
    navigate('/dashboard');
    setIsEdit(false);
    setTransactionInfo({
      category: '',
      amount: '',
      description: '',
      type: "expense",
      date: new Date().toISOString().split('T')[0]
    });
  }

  return (
    <div className='flex'>
        <Sidebar />
        <div className={`w-full flex justify-center items-center lg:w-[76%] h-screen
          ${darkMode ? 'bg-[#121212]' : 'bg-gray-300'} `}>
          <div className={`max-w-[500px] w-full text-black p-5 m-4 rounded-md
            ${darkMode ? 'bg-[#2A2A2A] text-white': 'bg-white text-black'}`}>
            <h1 className='text-2xl font-semibold mb-5'>Add Transaction</h1>
            
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <p className='font-semibold mb-1'>Type</p>
                <div className='flex gap-5 items-center'>
                  <div className='flex items-center'>
                    <label htmlFor='income' className='mr-4'>Income:</label>
                    <input onChange={handleChange} 
                      id='income' 
                      name='type' 
                      value='income'
                      type='radio' 
                      checked={transactionInfo.type === 'income'} 
                      className='w-4 h-4 cursor-pointer' />
                  </div>

                  <div className='flex items-center'>
                    <label htmlFor='expense' className='mr-4'>Expense:</label>
                    <input onChange={handleChange}
                      id='expense' 
                      name='type'
                      value='expense'
                      type='radio'
                      checked={transactionInfo.type === 'expense'} 
                      className='w-4 h-4 cursor-pointer'/>
                  </div>
                </div>
              </div>
              {transactionInfo.type === 'expense' && 
                (<div className='flex flex-col gap-1 mb-3'>
                  <label className='font-semibold'>Category</label>
                  <select onChange={handleChange} 
                    name='category' 
                    value={transactionInfo.category} 
                    className={`capitalize px-2 py-1 outline-0 rounded cursor-pointe
                    ${darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-gray-200'}`}>
                      <option value=''>Select category</option>
                      {expenseCategories.map((item, index) => (
                        <option key={index}>{item}</option>
                      ))}
                  </select>
                </div>)}

              {transactionInfo.type === 'income' && 
                (<div className='flex flex-col gap-1 mb-3'>
                  <label className='font-semibold'>Category</label>
                  <select onChange={handleChange} 
                    name='category' 
                    value={transactionInfo.category} 
                    className={`capitalize px-2 py-1 outline-0 rounded cursor-pointe
                    ${darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-gray-200'}`}>
                      <option value=''>Select category</option>
                      {incomeCategories.map((item, index) => (
                        <option key={index}>{item}</option>
                      ))}
                  </select>
                </div>)}

              <div className='flex flex-col gap-1 mb-3'>
                <label htmlFor='amount' className='font-semibold'>Amount</label>
                <input onChange={handleChange}
                  name='amount' 
                  id='amount'
                  value={transactionInfo.amount} 
                  type='number' 
                  placeholder='Enter amount'
                  className={`px-2 py-1 outline-0 rounded ${darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-gray-200'}`} />
              </div>

              <div className='flex flex-col gap-1 mb-3'>
                <label htmlFor='description' className='font-semibold'>Description (optional)</label>
                <input onChange={handleChange}
                  name='description' 
                  id='description' 
                  value={transactionInfo.description} 
                  type='text' 
                  placeholder='Enter description'
                  className={`px-2 py-1 outline-0 rounded ${darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-gray-200'}`} />
              </div>

              <div className='flex flex-col gap-1 mb-3'>
                <label htmlFor='date' className='font-semibold'>Date</label>
                <input onChange={handleChange}
                  id='date'
                  name='date'
                  value={transactionInfo.date} 
                  type='date' 
                  
                  className={`px-2 py-1 outline-0 rounded ${darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-gray-200'}`} />
              </div>
              <div className='flex gap-3'>
                <button type='submit' className='w-full bg-blue-600 text-white p-2 
                rounded mt-5 font-semibold cursor-pointer hover:bg-blue-500'>{isEdit ? 'Edit' : 'Add'}</button>
                <button type='button' onClick={handleCancel}
                className='w-full text-center bg-gray-300 text-black p-2 
                rounded mt-5 font-semibold cursor-pointer hover:bg-gray-200'>Cancel</button> 
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default ExpenseForm