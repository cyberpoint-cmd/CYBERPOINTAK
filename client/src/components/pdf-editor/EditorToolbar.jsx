import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, ArrowLeft, Undo2, Redo2, Move, Type, Square, 
  RotateCw, Download, ChevronLeft, ChevronRight
} from 'lucide-react';

export const EditorToolbar = ({
  activeTool,
  setActiveTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  setZoom,
  currentPage,
  numPages,
  onPageChange,
  onExportPDF,
  isExporting,
  onRotateDocument,
}) => {
  return (
    <div className="editor-header-toolbar">
      {/* Brand & Back */}
      <div className="editor-toolbar-group">
        <Link to="/tools" className="editor-tool-btn" title="Back to PDF Tools">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <FileText size={16} />
          </div>
          <span>CYBER<span style={{ color: '#3B82F6' }}>POINTAK</span></span>
        </div>
      </div>

      {/* Primary Editing Tools */}
      <div className="editor-toolbar-group">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="editor-tool-btn"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="editor-tool-btn"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </button>

        <div style={{ width: 1, height: 24, backgroundColor: '#334155', margin: '0 0.25rem' }} />

        {/* ↖ Select / Move Tool Button */}
        <button
          onClick={() => setActiveTool('select')}
          className={`editor-tool-btn ${activeTool === 'select' ? 'active' : ''}`}
          title="Select & Move Text (Drag with mouse or Arrow keys)"
        >
          <Move size={16} />
          <span>↖ Select / Move</span>
        </button>

        <button
          onClick={() => setActiveTool('add-text')}
          className={`editor-tool-btn ${activeTool === 'add-text' ? 'active' : ''}`}
          title="Add New Text Box"
        >
          <Type size={16} />
          <span>Add Text</span>
        </button>

        <button
          onClick={() => setActiveTool('whiteout')}
          className={`editor-tool-btn ${activeTool === 'whiteout' ? 'active' : ''}`}
          title="Whiteout / Cover Area"
        >
          <Square size={16} />
          <span>Whiteout</span>
        </button>

        <button
          onClick={onRotateDocument}
          className="editor-tool-btn"
          title="Rotate Document View"
        >
          <RotateCw size={16} />
        </button>
      </div>

      {/* Navigation, Zoom & Export */}
      <div className="editor-toolbar-group">
        {/* Page Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="editor-tool-btn"
            style={{ padding: '0.3rem 0.5rem' }}
          >
            <ChevronLeft size={16} />
          </button>
          <span>Page {currentPage} of {numPages || 1}</span>
          <button
            onClick={() => onPageChange(Math.min(numPages || 1, currentPage + 1))}
            disabled={currentPage >= (numPages || 1)}
            className="editor-tool-btn"
            style={{ padding: '0.3rem 0.5rem' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom Selector */}
        <select
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="prop-control-select"
          style={{ width: '85px', padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
        >
          <option value={0.5}>50%</option>
          <option value={0.75}>75%</option>
          <option value={1.0}>100%</option>
          <option value={1.25}>125%</option>
          <option value={1.5}>150%</option>
          <option value={2.0}>200%</option>
        </select>

        {/* Download PDF Button */}
        <button
          onClick={onExportPDF}
          disabled={isExporting}
          className="editor-tool-btn active"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', padding: '0.5rem 1.25rem' }}
        >
          {isExporting ? (
            <span>Saving PDF...</span>
          ) : (
            <>
              <Download size={16} />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
