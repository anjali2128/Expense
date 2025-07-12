import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" className="mb-4 neon-border-bottom">
      <Container>
        <Navbar.Brand className="neon-text">💸 Expense Distributor</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
