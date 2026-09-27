import React from 'react';
import { TOOL_CATEGORIES } from '../data/toolsData';

export const CategoriesNav = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="categories-bar">
      {TOOL_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => setActiveCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
