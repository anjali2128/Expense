import React from 'react';
import { Button } from 'react-bootstrap';

const ExpenseList = ({ expenses, onAdd }) => {
  const grouped = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <div className="expense-categorized-list">
      {Object.keys(grouped).map((category) => {
        const categoryTotal = grouped[category].reduce(
          (sum, exp) => sum + parseFloat(exp.amount || 0), 0
        );

        return (
          <div key={category} className="expense-category-card" data-aos="fade-up">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h5 className="category-title">{category} — ₹{categoryTotal.toFixed(2)}</h5>
              {onAdd && (
                <Button
                  size="sm"
                  variant="outline-info"
                  onClick={() => onAdd(category)}
                >
                  ➕ Add
                </Button>
              )}
            </div>
            <ul className="expense-items">
              {grouped[category].map((item, i) => (
                <li key={i}>₹{item.amount} — {item.description}</li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="total-expense-bar text-end mt-3">
        <strong>💸 Total: ₹{total.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default ExpenseList;
