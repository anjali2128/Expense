import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SummaryGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const income = parseFloat(localStorage.getItem('income')) || 0;
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const grouped = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    expenses.forEach(exp => {
      const [year, month] = exp.date.split('-');
      const key = `${year}-${month}`;
      const readableMonth = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
      if (!grouped[key]) {
        grouped[key] = { month: readableMonth, expenses: 0 };
      }
      grouped[key].expenses += exp.amount;
    });

    const chartData = Object.keys(grouped).map(key => ({
      month: grouped[key].month,
      income: income,
      expenses: grouped[key].expenses,
      savings: income - grouped[key].expenses
    }));

    setData(chartData);
  }, []);

  return (
    <div className="p-3 rounded shadow bg-white" style={{ width: '100%', height: 420 }}>
      <h4 className="mb-3">📊 Monthly Income vs Expenses</h4>

      {data.length === 0 ? (
        <p className="text-center text-muted">No data available. Add some expenses!</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f45c42" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f45c42" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00BFFF" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `₹${value}`} />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend />
            <Bar dataKey="income" fill="url(#incomeGradient)" name="Income" isAnimationActive />
            <Bar dataKey="expenses" fill="url(#expenseGradient)" name="Expenses" isAnimationActive />
            <Bar dataKey="savings" fill="url(#savingsGradient)" name="Savings" isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SummaryGraph;
