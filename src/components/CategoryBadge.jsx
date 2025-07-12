import React from 'react';
import { Badge } from 'react-bootstrap';

const CategoryBadge = ({ category }) => {
  const variant = category.includes("Food") ? "danger" :
                  category.includes("Transport") ? "warning" :
                  category.includes("Bills") ? "info" :
                  "success";

  return <Badge bg={variant}>{category}</Badge>;
};

export default CategoryBadge;
