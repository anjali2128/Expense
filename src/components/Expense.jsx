import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, ListGroup, Dropdown } from 'react-bootstrap';
import './Expense.css';
import SummaryGraph from './SummaryGraph';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



const Expense = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [income, setIncome] = useState(() => parseFloat(localStorage.getItem('income')) || 0);
  const [incomeInput, setIncomeInput] = useState('');
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('expenses')) || []);
  const [inputs, setInputs] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
const filteredExpenses = expenses.filter(e => {
  const eDate = new Date(e.date);
  const fromDate = new Date(dateRange.from);
  const toDate = new Date(dateRange.to);
  return dateRange.from && dateRange.to && eDate >= fromDate && eDate <= toDate;
});

const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('darkMode') === 'true';
});

useEffect(() => {
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('darkMode', darkMode);
}, [darkMode]);
const handleResetData = () => {
  if (window.confirm("⚠️ Are you sure you want to reset all data? This can't be undone.")) {
    localStorage.clear();
    setExpenses([]);
    setIncome(0);
    setMonthlyIncome(0);
    setInputs({});
    setDescriptions({});
    setSelectedDate('');
    setDateRange({ from: '', to: '' });
    alert("✅ All data has been reset.");
  }
};

const [budgetLimit, setBudgetLimit] = useState(() => parseFloat(localStorage.getItem('budgetLimit')) || 0);
const categories = ['Food 🍕', 'Transport 🚗', 'Shopping 🛍️', 'Bills 💡', 'Other 🌀'];
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(expenses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `Expenses_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const isFirst = new Date().getDate() === 1;
const categoryStats = categories.map(cat => {
  const total = expenses
    .filter(e => e.date.startsWith(thisMonth) && e.category === cat)
    .reduce((sum, e) => sum + e.amount, 0);
  return { category: cat, total };
});

  const todayExpenses = expenses.filter((e) => e.date === today);
  const getCategoryExpenses = (cat, from = today) =>
    expenses.filter((e) => e.date === from && e.category === cat);
  const totalToday = todayExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalThisMonth = expenses
    .filter((e) => e.date.startsWith(thisMonth))
    .reduce((acc, e) => acc + e.amount, 0);

  const allDates = [...new Set(expenses.map(e => e.date))].sort((a, b) => new Date(b) - new Date(a));
  const byDateExpenses = selectedDate
    ? expenses.filter((e) => e.date === selectedDate)
    : [];
const getCurrentMonthKey = () => {
  const now = new Date();
  return `income-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
};

const [monthlyIncome, setMonthlyIncome] = useState(() => {
  const key = getCurrentMonthKey();
  return parseFloat(localStorage.getItem(key)) || 0;
});
useEffect(() => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('income', income.toString());
  localStorage.setItem('budgetLimit', budgetLimit.toString());

  // Save monthly income
  const key = getCurrentMonthKey();
  if (monthlyIncome > 0) {
    localStorage.setItem(key, monthlyIncome.toString());
  }
}, [expenses, income, monthlyIncome]);
const incomeKey = getCurrentMonthKey();
const isIncomeMissing = !localStorage.getItem(incomeKey);
const isFirstOrMissing = new Date().getDate() === 1 || isIncomeMissing;

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('income', income.toString());
  }, [expenses, income]);

  useEffect(() => {
    const alertThreshold = 0.9 * income;
    if (totalToday >= alertThreshold && income > 0) {
      alert("⚠️ Warning: You’ve used 90% or more of your income!");
    }
  }, [totalToday, income]);

 const handleSetIncome = () => {
  const value = parseFloat(incomeInput);
  if (!isNaN(value)) {
    setIncome(value); // current working income
    setMonthlyIncome(value); // monthly base salary
    setIncomeInput('');
  }
};


  const handleInputChange = (category, value) => {
    setInputs((prev) => ({ ...prev, [category]: value }));
  };

  const handleDescriptionChange = (category, value) => {
    setDescriptions((prev) => ({ ...prev, [category]: value }));
  };

  const handleAddExpense = (category) => {
    const amount = parseFloat(inputs[category]);
    const desc = descriptions[category] || '';
    if (!isNaN(amount) && amount > 0) {
      const newExpense = {
        id: Date.now(),
        date: today,
        category,
        amount,
        description: desc,
      };
      setExpenses([...expenses, newExpense]);
      setIncome(income - amount);
      setInputs((prev) => ({ ...prev, [category]: '' }));
      setDescriptions((prev) => ({ ...prev, [category]: '' }));
    }
  };

  const handleDeleteExpense = (id, amount) => {
    const updatedExpenses = expenses.filter(e => e.id !== id);
    setExpenses(updatedExpenses);
    setIncome(income + amount); // refund back the deleted amount
  };




  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="bg-dark text-white p-3 min-vh-100">
          <h5 className="mb-4">💸 Expense Tracker</h5>
          <ListGroup variant="flush">
            {['dashboard', 'today', 'bydate', 'stats'].map((tab) => (
              <ListGroup.Item
                key={tab}
                action
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className="text-white bg-transparent border-0"
                style={{ cursor: 'pointer' }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>


        {/* Main Content */}
        <Col md={10} className="p-4">
        <Button className="mt-3 mb-3" variant="warning" onClick={exportToExcel}>
  📁 Export All Expenses to Excel
</Button>
<div className="d-flex justify-content-end align-items-center gap-2 mb-3">
  <Button variant={darkMode ? 'light' : 'dark'} onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
  </Button>
  <Button variant="outline-danger" onClick={handleResetData}>
    🧼 Reset All
  </Button>
</div>

          {activeTab === 'dashboard' && (
            <div>
              <h2>Welcome 👋</h2>
              <p>Manage your expenses with discipline. Every rupee counts!</p>
              <h5>Current Balance: ₹{income.toFixed(2)}</h5>

              {isFirstOrMissing && (
  <div className="mt-4">
    <h6>{monthlyIncome > 0 ? 'Update Salary for this Month:' : "Enter your monthly salary:"}</h6>
    <Form className="d-flex gap-2 flex-wrap">
      <Form.Control
        type="number"
        value={incomeInput}
        onChange={(e) => setIncomeInput(e.target.value)}
        placeholder="Enter salary"
        style={{ maxWidth: '200px' }}
      />
      <Button variant="primary" onClick={handleSetIncome}>
        {monthlyIncome > 0 ? 'Update' : 'Set'} Salary
      </Button>
    </Form>
  </div>
  
)}
<Card className={`mt-3 ${darkMode ? 'bg-dark text-white' : 'bg-light'}`}>

  <Card.Body>
    <h6>📆 Daily Budget Estimator</h6>
    {(() => {
      const todayDate = new Date();
      const daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate();
      const remainingDays = daysInMonth - todayDate.getDate();
      const remaining = monthlyIncome - totalThisMonth;
      const dailyBudget = remainingDays > 0 ? (remaining / remainingDays).toFixed(2) : 0;
      return (
        <p>You can spend <strong>₹{dailyBudget}</strong> per day to stay within budget.</p>
      );
    })()}
  </Card.Body>
</Card>

<Card className="mt-4">
  <Card.Body>
    <h5>📊 Monthly Summary</h5>
    <p>Total Income (Salary): ₹{monthlyIncome.toFixed(2)}</p>
    <p>Total Spent: ₹{totalThisMonth.toFixed(2)}</p>
    <p><strong>Remaining (Savings): ₹{(monthlyIncome - totalThisMonth).toFixed(2)}</strong></p>
  </Card.Body>
</Card>

            </div>
          )}

          {activeTab === 'today' && (
            <div>
              <h3 className="mb-4">Today's Expenses ({today})</h3>

              {categories.map((cat) => (
                <Card className="mb-3" key={cat}>
                  <Card.Body>
                    <Card.Title>{cat}</Card.Title>
                    <Form className="d-flex flex-wrap gap-2">
                      <Form.Control
                        type="number"
                        placeholder="Amount"
                        value={inputs[cat] || ''}
                        onChange={(e) => handleInputChange(cat, e.target.value)}
                        style={{ maxWidth: '120px' }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Description (optional)"
                        value={descriptions[cat] || ''}
                        onChange={(e) => handleDescriptionChange(cat, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <Button variant="success" onClick={() => handleAddExpense(cat)}>
                        Add
                      </Button>
                    </Form>

                    <ListGroup variant="flush" className="mt-3">
                      {getCategoryExpenses(cat).map((exp) => (
                        <ListGroup.Item key={exp.id} className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>₹{exp.amount}</strong>
                            {exp.description && <div className="text-muted small">{exp.description}</div>}
                          </div>
                          <div className="text-end">
                            <span className="me-2">{exp.category}</span>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteExpense(exp.id, exp.amount)}>🗑️</Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))}

              <Card bg="info" text="white" className="p-3 text-center">
                <h5>Total Spent Today: ₹{totalToday.toFixed(2)}</h5>
              </Card>
            </div>
          )}

                    {activeTab === 'bydate' && (
            <div>
              <h3>📅 View Expenses by Date</h3>
              <Dropdown className="my-3">
                <Dropdown.Toggle variant="secondary">
                  {selectedDate || 'Select a Date'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {allDates.map((date) => (
                    <Dropdown.Item key={date} onClick={() => setSelectedDate(date)}>
                      {date}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Form className="d-flex flex-wrap gap-3 mb-4">
                <Form.Group>
                  <Form.Label>From:</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>To:</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  />
                </Form.Group>
              </Form>

              {selectedDate && (
                <Card className="mb-4">
                  <Card.Header><strong>Expenses on {selectedDate}</strong></Card.Header>
                  <Card.Body>
                    {categories.map((cat) => {
                      const catExpenses = getCategoryExpenses(cat, selectedDate);
                      if (catExpenses.length === 0) return null;
                      return (
                        <div key={cat} className="mb-4">
                          <h6>{cat}</h6>
                          <ListGroup>
                            {catExpenses.map((e) => (
                              <ListGroup.Item key={e.id} className="d-flex justify-content-between align-items-start">
                                <div>
                                  <strong>₹{e.amount}</strong>
                                  {e.description && <div className="text-muted small">{e.description}</div>}
                                </div>
                                <div className="text-end">
                                  <span>{e.category}</span>
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </div>
                      );
                    })}
                  </Card.Body>
                </Card>
              )}

              {filteredExpenses.length > 0 && (
                <Card className="mb-4">
                  <Card.Header><strong>Expenses from {dateRange.from} to {dateRange.to}</strong></Card.Header>
                  <ListGroup variant="flush">
                    {filteredExpenses.map(e => (
                      <ListGroup.Item key={e.id} className="d-flex justify-content-between">
                        <div>
                          ₹{e.amount} - {e.category}
                          {e.description && <div className="text-muted small">{e.description}</div>}
                        </div>
                        <div>{e.date}</div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              )}
            </div> // ✅ Make sure this closes the tab condition
          )}


      

          {activeTab === 'stats' && (
            <div>
              <SummaryGraph />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Expense;
