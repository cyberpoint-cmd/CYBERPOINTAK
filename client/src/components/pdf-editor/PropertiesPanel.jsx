import React from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  Trash2, Type, Sliders, Palette, Layers, AlertCircle
} from 'lucide-react';

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

const COLOR_PRESETS = ['#000000', '#2563EB', '#EF4444', '#10B981', '#F59E0B', '#FFFFFF'];

export const PropertiesPanel = ({
  selectedItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  if (!selectedItem) {
    return (
      <div className="editor-properties-panel">
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
          <Type size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#94A3B8', marginBottom: '0.5rem' }}>
            No Text Selected
          </h4>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
            Click on any existing PDF text to edit it, or select "Add Text" / "Whiteout" from the top toolbar.
          </p>
        </div>
      </div>
    );
  }

  const isText = selectedItem.type !== 'whiteout';

  return (
    <div className="editor-properties-panel animate-fade-in">
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
          {selectedItem.isOriginal ? 'EXISTING PDF TEXT' : selectedItem.type === 'whiteout' ? 'WHITEOUT SHAPE' : 'ADDED TEXT'}
        </span>
        <button
          onClick={onDeleteItem}
          className="editor-tool-btn"
          style={{ color: '#EF4444', borderColor: '#EF4444' }}
          title="Delete Element"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>

      {/* Editable Text Content */}
      {isText && (
        <div className="prop-group">
          <label className="prop-label">Text Content</label>
          <textarea
            value={selectedItem.str}
            onChange={(e) => onUpdateItem({ str: e.target.value, edited: true })}
            className="prop-control-input"
            rows={3}
            style={{ resize: 'vertical' }}
            placeholder="Type text here..."
          />
        </div>
      )}

      {/* Font Family & Size */}
      {isText && (
        <>
          <div className="prop-group">
            <label className="prop-label">Font Family</label>
            <select
              value={selectedItem.fontFamily || 'Arial'}
              onChange={(e) => onUpdateItem({ fontFamily: e.target.value, edited: true })}
              className="prop-control-select"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="prop-group">
            <label className="prop-label">Font Size (pt)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={Math.round(selectedItem.fontSizePdf || 12)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateItem({ fontSizePdf: val, edited: true });
                }}
                className="prop-control-select"
                style={{ flex: 1 }}
              >
                {FONT_SIZES.map((sz) => (
                  <option key={sz} value={sz}>{sz} pt</option>
                ))}
              </select>
              <input
                type="number"
                value={Math.round(selectedItem.fontSizePdf || 12)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 12;
                  onUpdateItem({ fontSizePdf: val, edited: true });
                }}
                className="prop-control-input"
                style={{ width: '70px' }}
              />
            </div>
          </div>

          {/* Formatting: Bold, Italic, Underline */}
          <div className="prop-group">
            <label className="prop-label">Text Style</label>
            <div className="btn-group">
              <button
                type="button"
                onClick={() => onUpdateItem({ bold: !selectedItem.bold, edited: true })}
                className={`toggle-prop-btn ${selectedItem.bold ? 'active' : ''}`}
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                onClick={() => onUpdateItem({ italic: !selectedItem.italic, edited: true })}
                className={`toggle-prop-btn ${selectedItem.italic ? 'active' : ''}`}
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                onClick={() => onUpdateItem({ underline: !selectedItem.underline, edited: true })}
                className={`toggle-prop-btn ${selectedItem.underline ? 'active' : ''}`}
                title="Underline"
              >
                <Underline size={16} />
              </button>
            </div>
          </div>

          {/* Text Color */}
          <div className="prop-group">
            <label className="prop-label">Text Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="color"
                value={selectedItem.color || '#000000'}
                onChange={(e) => onUpdateItem({ color: e.target.value, edited: true })}
                style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }}
              />
              <div className="color-swatch-row">
                {COLOR_PRESETS.map((hex) => (
                  <div
                    key={hex}
                    className={`color-dot ${selectedItem.color === hex ? 'active' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => onUpdateItem({ color: hex, edited: true })}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Opacity */}
      <div className="prop-group">
        <label className="prop-label">Opacity ({Math.round((selectedItem.opacity || 1) * 100)}%)</label>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={selectedItem.opacity || 1}
          onChange={(e) => onUpdateItem({ opacity: parseFloat(e.target.value), edited: true })}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      {selectedItem.isOriginal && (
        <div style={{ padding: '0.75rem', background: '#0F172A', borderRadius: 6, fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertCircle size={15} className="text-primary" style={{ flexShrink: 0 }} />
          <span>Original text will be cleanly whited-out and replaced in exported PDF.</span>
        </div>
      )}
    </div>
  );
};
