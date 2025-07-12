import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  Modal,
  Form
} from 'react-bootstrap';
import AppNavbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryGraph from './components/SummaryGraph';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { saveExpenses, getExpenses } from './utils/storage';
import './components/SummaryGraph';
function App() {
  const [expenses, setExpenses] = useState([]);
  const [salary, setSalary] = useState(parseFloat(localStorage.getItem('monthlySalary') || 0));
  const [activePage, setActivePage] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [showSalaryInput, setShowSalaryInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const isFormInline = activePage === 'today' || activePage === 'add';

  useEffect(() => {
    AOS.init();
    setExpenses(getExpenses());
  }, []);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('monthlySalary', salary);
  }, [salary]);

  const addExpense = (expense) => setExpenses([...expenses, expense]);

  const handleAdd = (expense) => {
    addExpense(expense);
    setShowForm(false);
    setSelectedCategory('');
  };

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentDate = new Date();
  const isMonthEnd = currentDate.getDate() >= 28;
  const uniqueDates = [...new Set(expenses.map(exp => exp.date))];
  const todaysExpenses = expenses.filter(exp => exp.date === today);
  const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(currentMonth));
  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const balanceLeft = salary - totalSpent;

  const renderSidebar = () => (
    <ListGroup className="sidebar-menu">
      <ListGroup.Item action active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')}>
        🧠 Dashboard
      </ListGroup.Item>
      <ListGroup.Item action active={activePage === 'today'} onClick={() => setActivePage('today')}>
        📅 Today
      </ListGroup.Item>
      <ListGroup.Item>
        📆 By Date
        <ListGroup className="date-submenu mt-2">
          {uniqueDates.map(date => (
            <ListGroup.Item
              key={date}
              action
              active={activePage === `date-${date}`}
              onClick={() => setActivePage(`date-${date}`)}
            >
              {date}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </ListGroup.Item>
      {isMonthEnd && (
        <ListGroup.Item action active={activePage === 'graph'} onClick={() => setActivePage('graph')}>
          📈 Monthly Graph
        </ListGroup.Item>
      )}
      <ListGroup.Item action active={activePage === 'add'} onClick={() => setActivePage('add')}>
        ➕ Add Expense
      </ListGroup.Item>
      <ListGroup.Item action active={activePage === 'categories'} onClick={() => setActivePage('categories')}>
        🗂️ Categories
      </ListGroup.Item>
      <ListGroup.Item action active={activePage === 'stats'} onClick={() => setActivePage('stats')}>
        📊 Stats
      </ListGroup.Item>
      <ListGroup.Item action active={activePage === 'theme'} onClick={() => setActivePage('theme')}>
        🎨 Theme
      </ListGroup.Item>
      <ListGroup.Item action active={activePage === 'backup'} onClick={() => setActivePage('backup')}>
        🔁 Backup
      </ListGroup.Item>
    </ListGroup>
  );

  const SalaryModal = () => {
    const [input, setInput] = useState('');

    return (
      <Modal show={showSalaryInput} onHide={() => setShowSalaryInput(false)} className="neon-modal">
        <Modal.Header closeButton className="neon-header">
          <Modal.Title className="neon-title">Set Monthly Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body className="neon-body">
          <Form.Group>
            <Form.Control
              type="number"
              placeholder="Enter your salary"
              className="neon-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="neon-glow-button" onClick={() => {
            setSalary(parseFloat(input));
            setShowSalaryInput(false);
          }}>
            Save Salary
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const BalanceIndicator = () => {
    const mood = balanceLeft > 1000 ? '🤑' : balanceLeft > 0 ? '😬' : '💀';
    const percent = Math.max(0, Math.min(100, (balanceLeft / salary) * 100));

    return (
      <div className="balance-card" data-aos="fade-up">
        <h4>💰 Balance Left This Month</h4>
        <div className="liquid-meter" style={{ '--percent': `${percent}%` }}>
          <div className="amount">₹{balanceLeft.toFixed(2)} {mood}</div>
        </div>
      </div>
    );
  };
const renderCategorizedExpenses = (list) => {
  const categorized = {};

  list.forEach(exp => {
    const category = exp.category || 'Uncategorized';
    if (!categorized[category]) categorized[category] = [];
    categorized[category].push(exp);
  });

  return (
    <div>
      {Object.entries(categorized).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h5 className="neon-subtitle">{category}</h5>
          <ul className="expense-list">
            {items.map(item => (
              <li key={item.id} className="expense-item">
                <div className="expense-details">
                  <span>{item.description || 'No description'}</span>
                  <span className="expense-date">{item.date}</span>
                </div>
                <div className="expense-amount">₹{parseFloat(item.amount).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

  const renderContent = () => {
  const renderExpensesWithForm = (filteredList) => (
    <div className="d-md-flex flex-md-row gap-4">
      <div className="flex-fill">
        {renderCategorizedExpenses(filteredList)}
      </div>
      <div className="flex-shrink-0" style={{ minWidth: '300px' }}>
        <ExpenseForm
          show={true}
          handleClose={() => setActivePage('dashboard')}
          addExpense={handleAdd}
          presetCategory=""
        />
      </div>
    </div>
  );

  if (activePage === 'dashboard') {
    return (
      <div className="dashboard-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="neon-text">Welcome back 👋</h2>
          <Button className="neon-glow-button" onClick={() => setShowSalaryInput(true)}>Set Salary</Button>
        </div>
        <BalanceIndicator />
        <p className="sub-text">Total spent: ₹{totalSpent.toFixed(2)} / ₹{salary.toFixed(2)}</p>
        {isMonthEnd && <SummaryGraph expenses={monthlyExpenses} />}
        <ExpenseList expenses={expenses.slice(-5)} />
      </div>
    );
  }

  if (activePage === 'today') {
    return renderExpensesWithForm(todaysExpenses);
  }

  if (activePage.startsWith('date-')) {
    const selectedDate = activePage.replace('date-', '');
    const filtered = expenses.filter(exp => exp.date === selectedDate);
    return renderCategorizedExpenses(filtered);
  }

  if (activePage === 'add') {
    const filtered = expenses.filter(exp => exp.date === today);
    return renderExpensesWithForm(filtered);
  }

  if (activePage === 'graph') {
    return isMonthEnd ? (
      <SummaryGraph expenses={monthlyExpenses} />
    ) : (
      <div className="neon-text">📆 Graphs available only at month-end.</div>
    );
  }

  if (activePage === 'categories') return <div className="neon-text">📂 Category-wise breakdown coming soon!</div>;
  if (activePage === 'stats') return <div className="neon-text">📊 Insightful stats on your expenses — coming soon!</div>;
  if (activePage === 'backup') return <div className="neon-text">🔁 Backup to cloud feature under development.</div>;
  if (activePage === 'theme') {
    return (
      <div className="neon-text">
        <h2>🎨 Theme Settings</h2>
        <p className="sub-text">Dark mode is the only mode. More themes coming soon.</p>
      </div>
    );
  }

  return null;
};


       

  
  return (
    <>
      <AppNavbar />
      <Container fluid className="app-wrapper">
        <Row className="no-gutters flex-grow-1">
          <Col md={3} className="sidebar-container">
            {renderSidebar()}
          </Col>
          <Col md={9} className="content-container">
            {renderContent()}
          </Col>
        </Row>
      </Container>

     {!isFormInline && (
  <ExpenseForm
    show={showForm}
    handleClose={() => setShowForm(false)}
    addExpense={handleAdd}
    presetCategory={selectedCategory}
  />
)}


      <SalaryModal />
    </>
  );
}

export default App;
