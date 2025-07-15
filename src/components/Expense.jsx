import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, ListGroup, Dropdown } from 'react-bootstrap';
import './Expense.css';
import SummaryGraph from './SummaryGraph';

const categories = ['Food 🍕', 'Transport 🚗', 'Shopping 🛍️', 'Bills 💡', 'Other 🌀'];

const Expense = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [income, setIncome] = useState(() => parseFloat(localStorage.getItem('income')) || 0);
  const [incomeInput, setIncomeInput] = useState('');
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('expenses')) || []);
  const [inputs, setInputs] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const isFirst = new Date().getDate() === 1;

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('income', income.toString());
  }, [expenses, income]);

  const handleSetIncome = () => {
    const value = parseFloat(incomeInput);
    if (!isNaN(value)) {
      setIncome(value);
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

  const todayExpenses = expenses.filter((e) => e.date === today);
  const getCategoryExpenses = (cat, from = today) =>
    expenses.filter((e) => e.date === from && e.category === cat);
  const totalToday = todayExpenses.reduce((acc, e) => acc + e.amount, 0);

  const allDates = [...new Set(expenses.map(e => e.date))].sort((a, b) => new Date(b) - new Date(a));
  const byDateExpenses = selectedDate
    ? expenses.filter((e) => e.date === selectedDate)
    : [];

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
          {activeTab === 'dashboard' && (
            <div>
              <h2>Welcome 👋</h2>
              <p>Manage your expenses with discipline. Every rupee counts!</p>
              <h5>Current Balance: ₹{income.toFixed(2)}</h5>

              {isFirst && (
                <div className="mt-4">
                  <h6>{income > 0 ? 'Update Income for this Month:' : "It's the 1st! Enter your monthly income:"}</h6>
                  <Form className="d-flex gap-2 flex-wrap">
                    <Form.Control
                      type="number"
                      value={incomeInput}
                      onChange={(e) => setIncomeInput(e.target.value)}
                      placeholder="Enter income"
                      style={{ maxWidth: '200px' }}
                    />
                    <Button variant="primary" onClick={handleSetIncome}>
                      {income > 0 ? 'Update' : 'Set'} Income
                    </Button>
                  </Form>
                </div>
              )}
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

              {selectedDate && (
                <Card>
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
            </div>
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
