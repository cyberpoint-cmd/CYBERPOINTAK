import React from 'react';
import { Search, X } from 'lucide-react';

export const ToolSearch = ({ searchQuery, setSearchQuery, inputRef }) => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <Search size={22} className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search PDF tools... (e.g. merge, compress, rotate, split)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search PDF tools"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="clear-search-btn"
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
