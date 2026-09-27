import React, { useRef, useState } from 'react';
import { UploadCloud, FileUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';

export const UploadArea = ({ tool, onFilesSelected, acceptMultiple = false, maxFileSize = SITE_CONFIG.MAX_FILE_SIZE }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const supportedFormats = tool.supportedFormats || ['.pdf'];
  const acceptString = supportedFormats.join(',');

  const validateAndPassFiles = (files) => {
    setErrorMessage(null);
    const validFiles = [];
    const fileArray = Array.from(files);

    if (!acceptMultiple && fileArray.length > 1) {
      setErrorMessage(`The ${tool.name} tool accepts only 1 file at a time.`);
      return;
    }

    for (const file of fileArray) {
      // Validate file extension / mime type
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      const isValidFormat = supportedFormats.some(fmt => fmt.toLowerCase() === ext);

      if (!isValidFormat) {
        setErrorMessage(`Invalid file format: "${file.name}". Supported: ${supportedFormats.join(', ')}`);
        return;
      }

      if (file.size > maxFileSize) {
        setErrorMessage(`File "${file.name}" exceeds the maximum size limit of ${SITE_CONFIG.MAX_FILE_SIZE_LABEL}.`);
        return;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFiles(e.target.files);
    }
  };

  return (
    <div>
      <div
        className={`upload-box ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptString}
          multiple={acceptMultiple}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div className="upload-icon-wrapper">
          <UploadCloud size={36} />
        </div>

        <h3 className="upload-title">
          Drop your {acceptMultiple ? 'files' : 'file'} here or click to browse
        </h3>

        <p className="upload-hint">
          Supports: {supportedFormats.join(', ')} up to {SITE_CONFIG.MAX_FILE_SIZE_LABEL}
        </p>

        <button type="button" className="btn btn-primary btn-md">
          <FileUp size={18} />
          <span>Select {acceptMultiple ? 'Files' : 'File'}</span>
        </button>

        <div className="security-note">
          <ShieldCheck size={14} className="text-success" />
          <span>Your files are processed locally whenever supported</span>
        </div>
      </div>

      {errorMessage && (
        <div style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto', padding: '1rem', background: 'var(--error-bg)', color: 'var(--error-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
