import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';

const ExpenseList = ({ expenses }) => {
  return (
    <ListGroup>
      {expenses.map((exp) => (
        <ListGroup.Item key={exp.id} className="d-flex justify-content-between align-items-center bg-dark text-white neon-border">
          <div>
            <strong>{exp.category}</strong> - {exp.description}
            <div className="small text-muted">{exp.date}</div>
          </div>
          <Badge bg="info">₹{exp.amount}</Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ExpenseList;
