import React, { useContext, useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios';
import { handleFailure, handleSuccess } from '../../utils/notification';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Utensils, Home, 
  Bus, ShoppingBag, 
  Film, HeartPulse, 
  Wallet, Plus,
  Menu, CircleEllipsis,
  ClipboardX, Trash2,
  SquarePen,
  Gift,
  BriefcaseBusiness
} from "lucide-react";
import { ExpenseApi } from '../../context/expenseContext';
import MonthlyReportPage from './MonthlyReportPage';
import { formatCurrency } from '../../utils/currencyFormat';
import YearlyReportPage from './YearlyReportPage';


const DashBoard = () => {
  const [transactionsList, setTransactionsList] = useState([]);
  const toastShown = useRef(false);
  const {step} = useContext(ExpenseApi);
  const [hovered, setHovered] = useState(null);
  const [filters, setFilters] = useState({
    sortByDate: "",
    sortByAmount: "",
    type: ""
  });
  const {setTransactionInfo, setIsEdit, setToggle, darkMode} = useContext(ExpenseApi);

  const navigate = useNavigate();

  const categoryIcons = {
    "food & drinks": <Utensils className="w-5 h-5 text-yellow-500" />,
    "rent / bills": <Home className="w-5 h-5 text-indigo-500" />,
    "transport": <Bus className="w-5 h-5 text-orange-500" />,
    "gift" : <Gift className="w-5 h-5 text-pink-500" /> ,
    "shopping": <ShoppingBag className="w-5 h-5 text-pink-500" />,
    "entertainment": <Film className="w-5 h-5 text-purple-500" />,
    "health": <HeartPulse className="w-5 h-5 text-red-500" />,
    "salary": <Wallet className="w-5 h-5 text-green-500" />,
    "freelancing" : <BriefcaseBusiness className="w-5 h-5 text-green-500" />,
    "others": <CircleEllipsis className="w-5 h-5 text-gray-500" />,
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const url = '/v2/transactions/';
      const response = await axios.get(url);
      const {data, message, success} = response.data;

      if(success) {
        if(!toastShown.current) {
          handleSuccess(message);
          toastShown.current = true;
        }
        setTransactionsList(data);
      }
    };
    fetchTransactions();
  }, []);

  const deleteTransaction  = async (id) => {
    try {
      const url = `/v2/transactions/${id}`;
      const response = await axios.delete(url);
      const {message, success} = response.data;

      if(success) {
        handleSuccess(message);
        setTransactionsList((prev) => prev.filter((txn) => txn._id !== id));
      }

    } catch (error) {
      if(error.response) {
        console.log(error.response);
        const {message} = error.response.data;
        handleFailure(message);
      }
      else handleFailure("SERVER ERROR: " + error.message || "Failed to delete transaction");
    }
  }

  const handleEdit = (id) => {
    const transaction = transactionsList.find((t) => t._id === id);
    setTransactionInfo({
      ...transaction,
      date: transaction.date.split("T")[0],
    });
    setIsEdit(true);
    navigate('/form');
  }

  const applyFilters = (transactions) => {
    let result = [...transactions];

    if (filters.type) {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.sortByDate === "latest") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filters.sortByDate === "oldest") {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (filters.sortByAmount === "low") {
      result.sort((a, b) => a.amount - b.amount);
    } else if (filters.sortByAmount === "high") {
      result.sort((a, b) => b.amount - a.amount);
    }

    return result;
  };

  return (
    <div className='flex'>
      <Sidebar />
      
      {/* Transaction page side */}
      <div className={`w-full flex flex-col items-center h-screen lg:w-[76%] 
        ${darkMode ? 'bg-[#121212] ' : 'bg-gray-200'}`}>
        {/* transactions box */}
        { !transactionsList.length && 
          <h1 className='block md:hidden text-[26px] text-blue-800 font-bold underline mt-5'>Transactions</h1> 
        }
        <div className={`flex-1 flex flex-col w-full sm:m-8 items-center
          ${!transactionsList.length ? 'md:justify-center' : ''} overflow-y-auto`}>

          {!transactionsList.length && (
            <div className={`${darkMode ? 'text-white' : 'text-black'} 
            flex flex-col justify-center items-center mt-15 md:mt-0`}>
              <ClipboardX className='w-[60px] h-[60px] md:h-[90px] md:w-[90px]'/>
              <h1 className='text-2xl md:text-[26px] font-semibold mt-3'>No Transactions Yet!!</h1>
            </div>
          )}

          {transactionsList.length > 0 && step === 1 && (
            <div className={`max-w-[700px] sm:shadow-md w-full flex flex-col text-black p-7 sm:rounded-md
            ${darkMode ? 'bg-[#2A2A2A] text-white ' : 'bg-gray-200 text-black'} `}>
              <h1 className='text-[26px]  font-bold underline mb-5'>Transactions</h1>
              {/* Filter bars */}
              <div className='flex gap-5 overflow-x-auto pb-2'>
                <select onChange={(e) => setFilters({ ...filters, sortByDate: e.target.value })}
                value={filters.sortByDate} 
                className={` py-1 px-3 rounded border border-gray-500  shadow outline-0 shrink-0 w-[120px] 
                ${darkMode ? 'bg-[#191818] text-white' : 'bg-gray-100 text-black'}`}>
                  <option hidden >Date</option>
                  <option value='latest'>By Latest</option>
                  <option value='oldest'>By Oldest</option>
                </select>

                <select onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                value={filters.type}
                className={` py-1 px-3 rounded border border-gray-500  shadow outline-0 shrink-0 w-[120px]
                ${darkMode ? 'bg-[#191818] text-white' : 'bg-gray-100 text-black'}`}>
                  <option hidden>Type</option>
                  <option value=''>None</option>
                  <option value='expense'>Expense</option>
                  <option value='income'>Income</option>
                </select>
                
                <select onChange={(e) => setFilters({ ...filters, sortByAmount: e.target.value })}
                value={filters.sortByAmount}
                className={`py-1 px-3 rounded border border-gray-500  shadow outline-0 shrink-0 w-[120px]
                ${darkMode ? 'bg-[#191818] text-white' : 'bg-gray-100 text-black'}`}>
                  <option hidden>Amount</option>
                  <option value='low'>Low to High</option>
                  <option value='high'>High to Low</option>
                </select>
              </div>

              {/* Transactions Cards */}
              <div className='overflow-y-auto w-full mt-2 max-h-[400px]'>
                {applyFilters(transactionsList).map((t) => (
                  <div key={t._id} onMouseEnter={() => setHovered(t._id)} onMouseLeave={() => setHovered(null)}
                  className={`grid w-full grid-cols-1 sm:grid-cols-4 items-center gap-3 p-3 rounded cursor-pointer
                  shadow-md mt-5 transform-gpu hover:shadow-lg  
                  ${darkMode ? 'bg-[#1E1E1E] text-white hover:bg-[#333333]' : 'bg-gray-100 text-black'}
                  hover:-translate-y-1 transition duration-200`}>
                    <p className='flex items-center gap-2 capitalize font-semibold '>
                      {categoryIcons[t.category] || categoryIcons["others"]} {t.category}
                    </p>
                    <p className='p-1 sm:text-center'>
                      {t.date.split("T")[0]}
                    </p>
                    <p className={
                      `font-semibold text-lg ${t.type === "income" ? "text-green-500" : "text-red-500"}
                      sm:text-right`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </p>
                    {hovered === t._id && (
                      <div className='flex gap-7 transition-opacity duration-300 sm:gap-2 justify-end sm:justify-evenly right-0'>
                        <Trash2 size={17} onClick={() => deleteTransaction(t._id)}
                        className='text-red-500 hover:text-red-700' />
                        <SquarePen onClick={() => handleEdit(t._id)}
                        size={17} className='hover:text-gray-600' />
                    </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
            
          {/* Monthly Report */}
          {transactionsList.length > 0 && step === 2 && (
            <div>
              <MonthlyReportPage />
            </div>
          )}

          {/* Yearly Report */}
          {transactionsList.length > 0 && step == 3 && (
            <div>
              <YearlyReportPage />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='w-full p-4 h-[10%] bg-[#1E1E2E] flex items-center relative'>
          <Link to='/form'
            className=' w-33 sm:w-[200px] h-12 bg-blue-600 text-white left-1/2 -translate-x-1/2
           -top-5 absolute font-bold rounded-full flex justify-center items-center shadow-lg border-t-2
            border-white cursor-pointer'>
              <Plus size={30} className='font-bold' />
          </Link>
          <Menu onClick={() => setToggle(true)}
            size={25} 
            className='block lg:hidden text-white font-bold' 
          />
        </div>
      </div>
    </div>
  )
}

export default DashBoard