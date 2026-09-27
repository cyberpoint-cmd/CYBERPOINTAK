import React from 'react';
import { Clock, Download, Trash2, FileText, XCircle } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';
import { EmptyState } from './EmptyState';

export const RecentFilesSection = () => {
  const { recentFiles, removeRecentFile, clearHistory } = useHistory();

  if (!recentFiles || recentFiles.length === 0) {
    return null;
  }

  return (
    <section style={{ margin: '3rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} className="text-primary" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Recent Processed Files (Local Session)
            </h3>
          </div>

          <button 
            onClick={clearHistory} 
            className="btn btn-secondary btn-sm text-error"
            style={{ fontSize: '0.8rem' }}
          >
            <XCircle size={14} />
            <span>Clear History</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {recentFiles.slice(0, 6).map((file) => (
            <div key={file.id} className="card-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={18} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.name}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {file.toolName} • {file.date}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {file.downloadUrl && (
                  <a 
                    href={file.downloadUrl} 
                    download={file.name} 
                    className="icon-btn" 
                    style={{ width: 32, height: 32 }}
                    title="Download again"
                  >
                    <Download size={15} />
                  </a>
                )}
                <button
                  onClick={() => removeRecentFile(file.id)}
                  className="icon-btn"
                  style={{ width: 32, height: 32, color: 'var(--error-color)' }}
                  title="Remove from history"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
