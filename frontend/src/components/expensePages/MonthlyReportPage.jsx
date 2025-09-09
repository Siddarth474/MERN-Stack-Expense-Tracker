import React, { useContext, useEffect, useRef, useState } from 'react'
import ExpenseDonutChart from '../pieChart/ExpenseDonutChart';
import axios from '../../utils/apiCall';
import { handleFailure, handleSuccess } from '../../utils/notification';
import { formatCurrency } from '../../utils/currencyFormat';
import { ExpenseApi } from '../../context/expenseContext';

const MonthlyReportPage = () => {
  
  const {darkMode} = useContext(ExpenseApi);

  const CATEGORY_COLORS = {
    "salary": "#16A34A", 
    "gift": "#EC4899",  
    "freelancing": "#22C55E",
    "rent / bills": "#4F46E5",
    "food & drinks": "#FFA500",
    "transport": "#2563EB",
    "shopping": "#DB2777",
    "entertainment": "#9333EA",
    "health": "#DC2626",
    "other income": "#144821",
    "other expense" : '#4B5563'
  };

  const now = new Date();
  const toastShown = useRef(false);

  const [reportPeriod, setReportPeriod] = useState({
      month: now.getMonth() + 1,
      year: now.getFullYear()
  });

  const [monthlyReport, setMonthlyReport] = useState([]);

  const months = [
      { name: "January", number: 1 },
      { name: "February", number: 2 },
      { name: "March", number: 3 },
      { name: "April", number: 4 },
      { name: "May", number: 5 },
      { name: "June", number: 6 },
      { name: "July", number: 7 },
      { name: "August", number: 8 },
      { name: "September", number: 9 },
      { name: "October", number: 10 },
      { name: "November", number: 11 },
      { name: "December", number: 12 }
  ];

  const handleChange = (e) => {
      const {name, value} = e.target;
      const copyInfo = {...reportPeriod};
      copyInfo[name] = value;
      setReportPeriod(copyInfo);
  }

  const getMontlyReport = async () => {
      try {
          const {month, year} = reportPeriod;
          const response = await axios.get(`/transactions/report/monthly?month=${month}&year=${year}`);
          const {success, message, data} = response.data;

          if(success) {
              if(!toastShown.current) {
                  handleSuccess(message);
                  toastShown.current = true;
              }
              setMonthlyReport(data);
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

  useEffect(() => {getMontlyReport()}, []);

  return (
  <div className="p-4 rounded ">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Donut Chart */}
      <div className={` rounded shadow-md flex h-max justify-center
        ${darkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
        <ExpenseDonutChart data={monthlyReport.breakdown} COLORS={CATEGORY_COLORS} />
      </div>

      {/* Monthly Report Section */}
      <div className={`p-5 rounded flex shadow-md flex-col
        ${darkMode ? 'bg-[#2A2A2A] text-white': 'bg-white text-black' }`}>
        <h1 className="text-xl font-bold mb-3">Monthly Report</h1>

        {/* Filters */}
        <div className="flex flex-wrap text-black gap-2 mb-5">
          <div className='flex justify-between gap-2'>
              <select
              onChange={handleChange}
              name="month"
              value={reportPeriod.month}
              className={`border border-gray-500 capitalize px-2 py-1 outline-0 rounded cursor-pointer
                ${darkMode ? 'bg-[#191818] text-white' : 'bg-white text-black'}`}
              >
                <option value="">Select Month</option>
                {months.map((month, ind) => (
                    <option key={ind} value={month.number}>
                    {month.name}
                    </option>
                ))}
              </select>

              <input
              onChange={handleChange}
              name="year"
              value={reportPeriod.year}
              type="number"
              placeholder="Enter year"
              className={`outline-0 border w-full border-gray-500 px-2 py-1 rounded cursor-pointer
                ${darkMode ? 'bg-[#191818] text-white' : 'bg-white text-black'}`}
              />
          </div>

          <button
            onClick={getMontlyReport}
            className="bg-blue-600 py-1 px-3 w-full lg:w-max text-white font-semibold rounded hover:bg-blue-500 cursor-pointer"
          >
            GET
          </button>
        </div>
        <div className='flex justify-between items-center flex-wrap gap-2 p-3 shadow-md rounded'>
          <p className='font-semibold '>Total Income:  
            <span className='text-green-500 ml-1'> {formatCurrency(monthlyReport.totalIncome)}</span>
          </p>
          <p className='font-semibold'>Total Expense: 
            <span className='text-red-500 ml-1'> {formatCurrency(monthlyReport.totalExpense)}</span>
          </p>
        </div>
        {/* Report List */}
        <div className="grid grid-cols-1 gap-4 mt-5 overflow-y-auto max-h-[350px]">
          {monthlyReport.breakdown?.map((m, ind) => (
            <div
              key={ind}
              className={`grid grid-cols-2 flex-wrap gap-4 font-semibold shadow-md py-2 px-3 rounded
              ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'}`}>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full'
                style={{ backgroundColor: CATEGORY_COLORS[m.category] || '#888' }}></div>
                <p className='capitalize' style={{ color: CATEGORY_COLORS[m.category]}}>{m.category}</p>
              </div>
              <p className={`text-right ${m.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {m.type === "income" ? "+" : "-"}{formatCurrency(m.amount)}
              </p>
            </div>
          ))}
        </div>
        <div className=' p-2 border-t mt-3'>
          <p className='font-semibold'> Net Amount:
            <span className={`font-semibold ml-2 
              ${monthlyReport.netAmount > 0 ? 'text-green-500' : 'text-red-500'}`}> 
              {formatCurrency(monthlyReport.netAmount)}
            </span>
          </p>
        </div>
      </div>
    </div>
</div>
  )
}

export default MonthlyReportPage