import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
} from 'react-bootstrap';
import AppNavbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryGraph from './components/SummaryGraph';
import { saveExpenses, getExpenses } from './utils/storage';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [activePage, setActivePage] = useState('dashboard');
  const [showForm, setShowForm] = useState(false); // NEW LINE
  

  useEffect(() => {
    AOS.init();
    setExpenses(getExpenses());
  }, []);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const addExpense = (expense) => setExpenses([...expenses, expense]);
const handleAdd = (expense) => {
  addExpense(expense);
  setShowForm(false); // Close the modal after adding
};

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentDate = new Date();
  const isMonthEnd = currentDate.getDate() >= 28;
  const uniqueDates = [...new Set(expenses.map(exp => exp.date))];
  const todaysExpenses = expenses.filter(exp => exp.date === today);
  const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(currentMonth));

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

  const renderContent = () => {
    if (activePage === 'dashboard') {
      return (
        <div className="dashboard-section">
          <h2 className="neon-text mb-4">Welcome back 👋</h2>
          <p className="sub-text">Track your spending, control your future. 🌈</p>
          {isMonthEnd && <SummaryGraph expenses={monthlyExpenses} />}
          <ExpenseList expenses={expenses.slice(-5)} />
        </div>
      );
    }

    if (activePage === 'today') return <ExpenseList expenses={todaysExpenses} />;

    if (activePage.startsWith('date-')) {
      const selectedDate = activePage.replace('date-', '');
      const filtered = expenses.filter(exp => exp.date === selectedDate);
      return <ExpenseList expenses={filtered} />;
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

    if (activePage === 'add') {
  return (
    <>
      <div className="text-center mb-4">
        <Button className="custom-button" onClick={() => setShowForm(true)}>
          + Add Expense
        </Button>
      </div>
      <ExpenseForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        addExpense={handleAdd}
      />
    </>
  );
}
  }

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
    </>
  );
}

export default App;
