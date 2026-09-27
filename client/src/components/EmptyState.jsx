import React from 'react';
import { SearchX, FileX, Clock } from 'lucide-react';

export const EmptyState = ({ type = 'search', title, message, onAction, actionLabel }) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <SearchX size={44} className="text-muted" />;
      case 'history':
        return <Clock size={44} className="text-muted" />;
      default:
        return <FileX size={44} className="text-muted" />;
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-card)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-xl)', margin: '2rem 0' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        {getIcon()}
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        {title || 'No results found'}
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
        {message || 'We could not find any tools matching your criteria. Try adjusting your search query or filter.'}
      </p>

      {onAction && actionLabel && (
        <button onClick={onAction} className="btn btn-secondary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
