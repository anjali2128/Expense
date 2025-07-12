import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import './ExpenseForm.css';

const categories = ['Food 🍕', 'Transport 🚗', 'Shopping 🛍️', 'Bills 💡', 'Other 🌀'];
const ExpenseForm = ({ show, handleClose, addExpense, presetCategory, inline = false }) => {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    if (presetCategory) {
      setForm((prev) => ({ ...prev, category: presetCategory }));
    }
  }, [presetCategory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) return;
    addExpense({ ...form, id: Date.now() });
    setForm({ amount: '', category: '', description: '', date: '' });
    handleClose();
  };
if (!show) return null;

const formContent = (
  <Form onSubmit={handleSubmit}>
    <Form.Group className="mb-3">
      <Form.Label>💰 Amount</Form.Label>
      <Form.Control
        className="neon-input"
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Enter amount"
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>📂 Category</Form.Label>
      <Form.Select
        className="neon-input"
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option value="">Choose a category</option>
        {categories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </Form.Select>
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>📝 Description</Form.Label>
      <Form.Control
        className="neon-input"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="What was this for?"
      />
    </Form.Group>
    <Form.Group>
      <Form.Label>📅 Date</Form.Label>
      <Form.Control
        className="neon-input"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
    </Form.Group>
    <Button type="submit" className="custom-button neon-glow-button mt-4 w-100">
      💾 Save Expense
    </Button>
  </Form>
);

if (inline) {
  return (
    <div className="inline-expense-form neon-body p-3 rounded">
      <h4 className="neon-title mb-3">➕ Add New Expense</h4>
      {formContent}
    </div>
  );
}

return (
  <Modal show={show} onHide={handleClose} centered dialogClassName="neon-modal">
    <Modal.Header closeButton className="neon-header">
      <Modal.Title className="neon-title">💸 Add Expense</Modal.Title>
    </Modal.Header>
    <Modal.Body className="neon-body">{formContent}</Modal.Body>
  </Modal>
);

};

export default ExpenseForm;
