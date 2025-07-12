export const saveExpenses = (expenses) => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

export const getExpenses = () => {
  const saved = localStorage.getItem('expenses');
  return saved ? JSON.parse(saved) : [];
};
