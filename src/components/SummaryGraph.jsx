import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SummaryGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const income = parseFloat(localStorage.getItem('income')) || 0;
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const grouped = {};

    expenses.forEach(exp => {
      const [year, month] = exp.date.split('-');
      const key = `${year}-${month}`;
      grouped[key] = grouped[key] || { month: key, expenses: 0 };
      grouped[key].expenses += exp.amount;
    });

    const chartData = Object.keys(grouped).map(monthKey => ({
      month: monthKey,
      income: income,
      expenses: grouped[monthKey].expenses,
    }));

    setData(chartData);
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h4 className="mb-3">📊 Monthly Income vs Expenses</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#82ca9d" name="Income" />
          <Bar dataKey="expenses" fill="#f45c42" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryGraph;

