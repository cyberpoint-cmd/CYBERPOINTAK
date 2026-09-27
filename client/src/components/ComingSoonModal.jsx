import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Sparkles, ArrowRight, X } from 'lucide-react';

export const ComingSoonModal = ({ tool, onClose }) => {
  if (!tool) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="card-panel animate-fade-in" style={{ maxWidth: '520px', width: '100%', padding: '2rem', position: 'relative' }}>
        <button 
          onClick={onClose} 
          className="icon-btn" 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
        >
          <X size={18} />
        </button>

        <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'var(--warning-bg)', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Wrench size={32} />
        </div>

        <span className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>ADVANCED TOOL • COMING SOON</span>

        <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          {tool.name}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          The local conversion engine for <strong>{tool.name}</strong> requires high-performance native libraries (such as OCR tesseract / LibreOffice engines). We are building a lightweight local engine for future updates!
        </p>

        <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} className="text-primary" />
            <span>Try fully working local tools right now:</span>
          </div>
          Merge PDF, Split PDF, Compress PDF, JPG to PDF, PDF to JPG, Rotate PDF, Delete Pages, Extract Pages, Watermark, and Page Numbers!
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/merge-pdf" onClick={onClose} className="btn btn-primary w-full">
            <span>Try Merge PDF</span>
            <ArrowRight size={16} />
          </Link>
          <button onClick={onClose} className="btn btn-secondary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
