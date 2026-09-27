import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Download, RefreshCw, Home, FileText, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SuccessState = ({ resultFilename, resultBlobUrl, onReset, onDownload }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if confetti blocked
    }
  }, []);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (resultBlobUrl) {
      const a = document.createElement('a');
      a.href = resultBlobUrl;
      a.download = resultFilename || 'cyberpointak_output.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="state-container animate-fade-in">
      <div className="success-icon-box">
        <Check size={40} strokeWidth={3} />
      </div>

      <h3 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Your PDF is ready!
      </h3>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <FileText size={18} className="text-primary" />
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{resultFilename || 'Processed_Document.pdf'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={handleDownload} className="btn btn-primary btn-lg w-full">
          <Download size={20} />
          <span>Download PDF</span>
        </button>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={onReset} className="btn btn-secondary w-full">
            <RefreshCw size={16} />
            <span>Process Another File</span>
          </button>

          <Link to="/" className="btn btn-secondary w-full">
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={15} className="text-success" />
        <span>Your files are automatically removed from memory after processing.</span>
      </div>
    </div>
  );
};
