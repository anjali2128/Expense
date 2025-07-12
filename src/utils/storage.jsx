// Save expenses array to localStorage
export const saveExpenses = (expenses) => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

// Retrieve expenses array from localStorage
export const getExpenses = () => {
  const saved = localStorage.getItem('expenses');
  return saved ? JSON.parse(saved) : [];
};

// Save salary to localStorage
export const saveSalary = (amount) => {
  localStorage.setItem('monthlySalary', amount);
};

// Retrieve salary from localStorage
export const getSalary = () => {
  return parseFloat(localStorage.getItem('monthlySalary') || 0);
};
