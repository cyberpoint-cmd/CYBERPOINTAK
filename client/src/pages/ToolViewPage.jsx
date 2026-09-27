import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Wrench, ShieldCheck, Sparkles } from 'lucide-react';
import { TOOLS_LIST } from '../data/toolsData';
import { usePDFTool } from '../hooks/usePDFTool';
import { UploadArea } from '../components/UploadArea';
import { FilePreviewList } from '../components/FilePreviewList';
import { ProcessingState } from '../components/ProcessingState';
import { SuccessState } from '../components/SuccessState';
import { ErrorState } from '../components/ErrorState';
import { ComingSoonModal } from '../components/ComingSoonModal';
import { PDFEditor } from '../components/pdf-editor/PDFEditor';

export const ToolViewPage = () => {
  const { toolRoute } = useParams();
  const navigate = useNavigate();

  // Find tool by route (e.g., 'merge-pdf' -> route '/merge-pdf')
  const currentPath = `/${toolRoute}`;
  const tool = TOOLS_LIST.find(
    (t) => t.route === currentPath || t.id === toolRoute
  );

  if (!tool) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Tool Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>
          The tool you are looking for does not exist or has been moved.
        </p>
        <Link to="/tools" className="btn btn-primary">
          Explore All PDF Tools
        </Link>
      </div>
    );
  }

  // Handle coming-soon tools
  if (tool.status === 'coming-soon') {
    return (
      <ComingSoonModal tool={tool} onClose={() => navigate('/tools')} />
    );
  }

  return <ActiveToolView tool={tool} />;
};

const ActiveToolView = ({ tool }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [optionsState, setOptionsState] = useState(() => {
    const initialState = {};
    if (tool.options) {
      tool.options.forEach((opt) => {
        initialState[opt.id] = opt.defaultValue || '';
      });
    }
    return initialState;
  });

  const {
    status,
    errorMessage,
    resultBlobUrl,
    resultFilename,
    processTool,
    resetState,
  } = usePDFTool(tool);

  const handleFilesSelected = (newFiles) => {
    if (tool.acceptMultiple) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    } else {
      setSelectedFiles(newFiles);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorderFiles = (newFiles) => {
    setSelectedFiles(newFiles);
  };

  const handleOptionChange = (id, val) => {
    setOptionsState((prev) => ({ ...prev, [id]: val }));
  };

  const handleProcess = () => {
    processTool(selectedFiles, optionsState);
  };

  const handleResetAll = () => {
    resetState();
    setSelectedFiles([]);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/tools" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={16} />
          <span>Back to all tools</span>
        </Link>
      </div>

      {/* Tool Header */}
      <div className="tool-view-header">
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
          {tool.category}
        </span>
        <h1 className="tool-view-title">{tool.name}</h1>
        <p className="tool-view-subtitle">{tool.description}</p>
      </div>

      {/* UI State Router */}
      {status === 'processing' && (
        <ProcessingState />
      )}

      {status === 'success' && (
        <SuccessState
          resultFilename={resultFilename}
          resultBlobUrl={resultBlobUrl}
          onReset={handleResetAll}
        />
      )}

      {status === 'error' && (
        <ErrorState
          message={errorMessage}
          onRetry={handleProcess}
          onChooseNew={handleResetAll}
        />
      )}

      {status === 'idle' && (
        <div>
          {/* If tool is Edit PDF and file is selected, render full interactive PDFEditor */}
          {tool.id === 'edit-pdf' && selectedFiles.length > 0 ? (
            <PDFEditor
              file={selectedFiles[0]}
              onBackToTools={handleResetAll}
            />
          ) : selectedFiles.length === 0 ? (
            <UploadArea
              tool={tool}
              onFilesSelected={handleFilesSelected}
              acceptMultiple={tool.acceptMultiple}
            />
          ) : (
            <div>
              {/* Selected Files Preview List */}
              <FilePreviewList
                files={selectedFiles}
                onRemoveFile={handleRemoveFile}
                onReorderFiles={handleReorderFiles}
                onAddMoreFiles={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = tool.acceptMultiple;
                  input.accept = tool.supportedFormats.join(',');
                  input.onchange = (e) => {
                    if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                  };
                  input.click();
                }}
                acceptMultiple={tool.acceptMultiple}
                supportedFormats={tool.supportedFormats}
              />

              {/* Tool Specific Options Panel */}
              {tool.options && tool.options.length > 0 && (
                <div className="tool-options-panel">
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} className="text-primary" />
                    <span>Configure {tool.name} Options</span>
                  </h4>

                  {tool.options.map((opt) => (
                    <div key={opt.id} className="form-group">
                      <label className="form-label">{opt.label}</label>
                      {opt.type === 'select' ? (
                        <select
                          className="form-control"
                          value={optionsState[opt.id]}
                          onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                        >
                          {opt.selectOptions.map((so) => (
                            <option key={so.value} value={so.value}>
                              {so.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={opt.type || 'text'}
                          className="form-control"
                          value={optionsState[opt.id]}
                          onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <button
                  onClick={handleProcess}
                  className="btn btn-primary btn-lg w-full"
                  style={{ py: '1rem' }}
                >
                  <Play size={20} />
                  <span>Execute {tool.name}</span>
                </button>

                <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} className="text-success" />
                  <span>Fast local execution • Safe & Confidential</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
