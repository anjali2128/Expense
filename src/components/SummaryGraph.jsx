import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const SummaryGraph = ({ expenses }) => {
  const grouped = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([category, amount]) => ({ category, amount }));

  return (
    <div className="graph-section mt-5" data-aos="fade-up">
      <h3 className="text-white mb-3">Expense Summary 📊</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#00ffe1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryGraph;
