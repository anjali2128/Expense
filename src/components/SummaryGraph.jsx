import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { Dropdown, ButtonGroup, ToggleButton, Card, Row, Col, Form } from 'react-bootstrap';

const SummaryGraph = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [filter, setFilter] = useState('recent');
  const [years, setYears] = useState([]);

  useEffect(() => {
    const income = parseFloat(localStorage.getItem('income')) || 0;
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const grouped = {};
    const yearSet = new Set();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    expenses.forEach(exp => {
      const [year, month] = exp.date.split('-');
      yearSet.add(year);
      const key = `${year}-${month}`;
      const readableMonth = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
      if (!grouped[key]) {
        grouped[key] = { month: readableMonth, year, expenses: 0 };
      }
      grouped[key].expenses += exp.amount;
    });

    const chartData = Object.keys(grouped)
      .sort()
      .map(key => ({
        month: grouped[key].month,
        year: grouped[key].year,
        income: income,
        expenses: grouped[key].expenses,
        savings: income - grouped[key].expenses
      }));

    setData(chartData);
    setYears(Array.from(yearSet).sort());
  }, []);

  useEffect(() => {
    const now = new Date();
    let result = [];

    if (filter === 'recent') {
      result = data.slice(-6);
    } else {
      result = data.filter(entry => entry.year === filter);
    }

    setFilteredData(result);
  }, [data, filter]);

  const averages = {
    income: Math.round(filteredData.reduce((acc, d) => acc + d.income, 0) / filteredData.length || 0),
    expenses: Math.round(filteredData.reduce((acc, d) => acc + d.expenses, 0) / filteredData.length || 0),
    savings: Math.round(filteredData.reduce((acc, d) => acc + d.savings, 0) / filteredData.length || 0)
  };

  return (
    <div className="p-3 rounded shadow bg-white" style={{ width: '100%', minHeight: 500 }}>
      <h4 className="mb-3">📊 Monthly Income vs Expenses</h4>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="recent">🕓 Last 6 Months</option>
            {years.map(y => (
              <option key={y} value={y}>📅 {y}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6} className="text-md-end mt-2 mt-md-0">
          <ButtonGroup toggle="true">
            <ToggleButton
              type="radio"
              variant="outline-primary"
              name="chart"
              value="bar"
              checked={chartType === 'bar'}
              onChange={() => setChartType('bar')}
            >
              📊 Bar Chart
            </ToggleButton>
            <ToggleButton
              type="radio"
              variant="outline-primary"
              name="chart"
              value="line"
              checked={chartType === 'line'}
              onChange={() => setChartType('line')}
            >
              📈 Line Chart
            </ToggleButton>
          </ButtonGroup>
        </Col>
      </Row>

      {filteredData.length === 0 ? (
        <p className="text-center text-muted">No data available. Add some expenses!</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'bar' ? (
            <BarChart data={filteredData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
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
              <Bar dataKey="income" fill="url(#incomeGradient)" name="Income" />
              <Bar dataKey="expenses" fill="url(#expenseGradient)" name="Expenses" />
              <Bar dataKey="savings" fill="url(#savingsGradient)" name="Savings" />
            </BarChart>
          ) : (
            <LineChart data={filteredData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#82ca9d" name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#f45c42" name="Expenses" />
              <Line type="monotone" dataKey="savings" stroke="#00BFFF" name="Savings" />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}

      {/* Average Summary Card */}
      <Card className="mt-4 bg-light text-center">
        <Card.Body>
          <Row>
            <Col>
              <h6 className="text-muted">Avg. Income</h6>
              <h5 className="text-success">₹{averages.income}</h5>
            </Col>
            <Col>
              <h6 className="text-muted">Avg. Expenses</h6>
              <h5 className="text-danger">₹{averages.expenses}</h5>
            </Col>
            <Col>
              <h6 className="text-muted">Avg. Savings</h6>
              <h5 className="text-primary">₹{averages.savings}</h5>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SummaryGraph;
