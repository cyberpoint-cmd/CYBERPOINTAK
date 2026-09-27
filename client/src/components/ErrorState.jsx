import React from 'react';
import { AlertTriangle, RefreshCw, FilePlus } from 'lucide-react';

export const ErrorState = ({ message, onRetry, onChooseNew }) => {
  return (
    <div className="state-container animate-fade-in" style={{ borderColor: 'var(--error-color)' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--error-bg)', color: 'var(--error-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
        <AlertTriangle size={36} />
      </div>

      <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.75rem' }}>
        Something went wrong
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '460px', margin: '0 auto 2rem auto' }}>
        {message || "We couldn't process this file. Please make sure the PDF is not password protected or corrupted and try again."}
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary">
            <RefreshCw size={18} />
            <span>Try Again</span>
          </button>
        )}

        <button onClick={onChooseNew} className="btn btn-secondary">
          <FilePlus size={18} />
          <span>Choose Another File</span>
        </button>
      </div>
    </div>
  );
};
