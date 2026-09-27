import React from 'react';
import { FileText, Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';

export const FilePreviewList = ({ files, onRemoveFile, onReorderFiles, onAddMoreFiles, acceptMultiple = false, supportedFormats }) => {
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const moveFile = (index, direction) => {
    if (!onReorderFiles) return;
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    onReorderFiles(newFiles);
  };

  return (
    <div className="files-preview-list">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
          Selected Files ({files.length})
        </h4>
        {acceptMultiple && onAddMoreFiles && (
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onAddMoreFiles}
          >
            <Plus size={16} />
            <span>Add More Files</span>
          </button>
        )}
      </div>

      {files.map((file, idx) => (
        <div key={`${file.name}-${idx}`} className="file-item-card">
          <div className="file-item-info">
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={20} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="file-item-name" title={file.name}>{file.name}</div>
              <div className="file-item-size">{formatSize(file.size)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {acceptMultiple && files.length > 1 && onReorderFiles && (
              <>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 32, height: 32 }}
                  onClick={() => moveFile(idx, 'up')}
                  disabled={idx === 0}
                  title="Move Up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 32, height: 32 }}
                  onClick={() => moveFile(idx, 'down')}
                  disabled={idx === files.length - 1}
                  title="Move Down"
                >
                  <ArrowDown size={16} />
                </button>
              </>
            )}

            <button
              type="button"
              className="icon-btn"
              style={{ width: 32, height: 32, color: 'var(--error-color)' }}
              onClick={() => onRemoveFile(idx)}
              title="Remove file"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
