import React, { useEffect, useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { EditorToolbar } from './EditorToolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { PDFPageCanvas } from './PDFPageCanvas';
import { extractPageTextItems, exportEditedPDF } from './pdfEditorUtils';
import { useHistory } from '../../context/HistoryContext';
import { Loader2, AlertCircle } from 'lucide-react';
import '../../styles/pdfEditor.css';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const PDFEditor = ({ file, onBackToTools }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [originalArrayBuffer, setOriginalArrayBuffer] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.25);
  const [isLoading, setIsLoading] = useState(true);
  const [scannedNotice, setScannedNotice] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Tools & Selection
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'add-text' | 'whiteout' | 'highlight'
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Editor Items State
  const [allTextItems, setAllTextItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [whiteoutItems, setWhiteoutItems] = useState([]);
  const [drawingItems, setDrawingItems] = useState([]);

  // Undo / Redo History Stack
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const { addRecentFile } = useHistory();
  const documentViewerRef = useRef(null);

  // Load PDF document on mount
  useEffect(() => {
    let isCancelled = false;

    async function loadPDF() {
      if (!file) return;
      setIsLoading(true);

      try {
        const buffer = await file.arrayBuffer();
        if (isCancelled) return;
        setOriginalArrayBuffer(buffer);

        const pdf = await pdfjsLib.getDocument({ data: buffer.slice(0) }).promise;
        if (isCancelled) return;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);

        // Extract text items across all pages
        const extracted = [];
        let hasAnyText = false;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 1 });
          const textContent = await page.getTextContent();
          const items = extractPageTextItems(textContent, vp, i, page.view[3] || 792);
          if (items.length > 0) hasAnyText = true;
          extracted.push(...items);
        }

        if (!hasAnyText) {
          setScannedNotice(true);
        }

        if (!isCancelled) {
          setAllTextItems(extracted);
          setIsLoading(false);
          // Push initial history snapshot
          const initialSnapshot = {
            textItems: extracted,
            addedItems: [],
            whiteoutItems: [],
            drawingItems: [],
          };
          setHistory([initialSnapshot]);
          setHistoryIndex(0);
        }
      } catch (err) {
        console.error('Failed to load PDF in editor:', err);
        setIsLoading(false);
      }
    }

    loadPDF();

    return () => {
      isCancelled = true;
    };
  }, [file]);

  // Push snapshot to Undo History
  const pushHistorySnapshot = (newTextItems, newAdded, newWhiteouts, newDrawings) => {
    const snapshot = {
      textItems: JSON.parse(JSON.stringify(newTextItems)),
      addedItems: JSON.parse(JSON.stringify(newAdded)),
      whiteoutItems: JSON.parse(JSON.stringify(newWhiteouts)),
      drawingItems: JSON.parse(JSON.stringify(newDrawings)),
    };
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(snapshot);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const snap = history[prevIdx];
      setAllTextItems(snap.textItems);
      setAddedItems(snap.addedItems);
      setWhiteoutItems(snap.whiteoutItems);
      setDrawingItems(snap.drawingItems);
      setHistoryIndex(prevIdx);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const snap = history[nextIdx];
      setAllTextItems(snap.textItems);
      setAddedItems(snap.addedItems);
      setWhiteoutItems(snap.whiteoutItems);
      setDrawingItems(snap.drawingItems);
      setHistoryIndex(nextIdx);
    }
  };

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Arrow Keys, Delete, ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
        return;
      }

      // ESC Key: deselect item
      if (e.key === 'Escape') {
        setSelectedItemId(null);
        return;
      }

      // Do not trigger Arrow keys or Delete if user is currently typing inside a textarea or input field
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      if (!selectedItemId) return;

      // Delete Key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteItem();
        return;
      }

      // Keyboard Arrow Movement
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 2; // 10pt with Shift, 2pt normal

        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        if (e.key === 'ArrowUp') dy = step; // PDF Y is bottom-up
        if (e.key === 'ArrowDown') dy = -step;

        const targetItem =
          allTextItems.find(t => t.id === selectedItemId) ||
          addedItems.find(a => a.id === selectedItemId) ||
          whiteoutItems.find(w => w.id === selectedItemId);

        if (targetItem) {
          handleUpdateItem(selectedItemId, {
            pdfX: targetItem.pdfX + dx,
            pdfY: targetItem.pdfY + dy,
            edited: true,
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, historyIndex, history, allTextItems, addedItems, whiteoutItems]);

  // Update item properties
  const handleUpdateItem = (id, updates) => {
    let updatedText = allTextItems;
    let updatedAdded = addedItems;
    let updatedWhiteout = whiteoutItems;

    if (allTextItems.some(t => t.id === id)) {
      updatedText = allTextItems.map(t => (t.id === id ? { ...t, ...updates } : t));
      setAllTextItems(updatedText);
    } else if (addedItems.some(a => a.id === id)) {
      updatedAdded = addedItems.map(a => (a.id === id ? { ...a, ...updates } : a));
      setAddedItems(updatedAdded);
    } else if (whiteoutItems.some(w => w.id === id)) {
      updatedWhiteout = whiteoutItems.map(w => (w.id === id ? { ...w, ...updates } : w));
      setWhiteoutItems(updatedWhiteout);
    }

    pushHistorySnapshot(updatedText, updatedAdded, updatedWhiteout, drawingItems);
  };

  // Delete item action
  const handleDeleteItem = () => {
    if (!selectedItemId) return;

    let updatedText = allTextItems;
    let updatedAdded = addedItems;
    let updatedWhiteout = whiteoutItems;

    if (allTextItems.some(t => t.id === selectedItemId)) {
      updatedText = allTextItems.map(t => (t.id === selectedItemId ? { ...t, deleted: true, edited: true } : t));
      setAllTextItems(updatedText);
    } else if (addedItems.some(a => a.id === selectedItemId)) {
      updatedAdded = addedItems.filter(a => a.id !== selectedItemId);
      setAddedItems(updatedAdded);
    } else if (whiteoutItems.some(w => w.id === selectedItemId)) {
      updatedWhiteout = whiteoutItems.filter(w => w.id !== selectedItemId);
      setWhiteoutItems(updatedWhiteout);
    }

    setSelectedItemId(null);
    pushHistorySnapshot(updatedText, updatedAdded, updatedWhiteout, drawingItems);
  };

  // Add new multiline text box at position
  const handleAddTextAt = (pageNumber, screenX, screenY, pdfX, pdfY) => {
    const newItem = {
      id: `add_${Date.now()}`,
      pageNumber,
      str: 'Type new text...',
      screenX,
      screenY,
      pdfX,
      pdfY,
      fontSizePdf: 14,
      fontFamily: 'Arial',
      bold: false,
      italic: false,
      underline: false,
      color: '#000000',
      align: 'left',
      opacity: 1,
      isOriginal: false,
      type: 'add-text',
    };

    const newAdded = [...addedItems, newItem];
    setAddedItems(newAdded);
    setSelectedItemId(newItem.id);
    setActiveTool('select');
    pushHistorySnapshot(allTextItems, newAdded, whiteoutItems, drawingItems);
  };

  // Add whiteout box at position
  const handleAddWhiteoutAt = (pageNumber, screenX, screenY, pdfX, pdfY) => {
    const newItem = {
      id: `wo_${Date.now()}`,
      pageNumber,
      screenX,
      screenY,
      pdfX,
      pdfY,
      pdfWidth: 120,
      pdfHeight: 30,
      type: 'whiteout',
    };

    const newWhiteouts = [...whiteoutItems, newItem];
    setWhiteoutItems(newWhiteouts);
    setSelectedItemId(newItem.id);
    setActiveTool('select');
    pushHistorySnapshot(allTextItems, addedItems, newWhiteouts, drawingItems);
  };

  // Export PDF and trigger download
  const handleExportPDF = async () => {
    if (!originalArrayBuffer) return;
    setIsExporting(true);

    try {
      const blob = await exportEditedPDF(
        originalArrayBuffer,
        allTextItems,
        addedItems,
        whiteoutItems,
        drawingItems
      );

      const blobUrl = URL.createObjectURL(blob);
      const outFilename = file.name ? file.name.replace(/\.pdf$/i, '_edited.pdf') : 'CYBERPOINTAK_edited.pdf';

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = outFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      addRecentFile({
        name: outFilename,
        toolName: 'Edit PDF',
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        downloadUrl: blobUrl,
      });

      setIsExporting(false);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to export PDF: ' + err.message);
      setIsExporting(false);
    }
  };

  // Resolve currently selected item
  const selectedItem =
    allTextItems.find(t => t.id === selectedItemId) ||
    addedItems.find(a => a.id === selectedItemId) ||
    whiteoutItems.find(w => w.id === selectedItemId);

  if (isLoading) {
    return (
      <div className="pdf-editor-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} className="text-primary animate-spin" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Opening PDF Editor...</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Extracting text items & initializing canvas layers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-editor-layout">
      {/* Top Toolbar */}
      <EditorToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        setZoom={setZoom}
        currentPage={currentPage}
        numPages={numPages}
        onPageChange={setCurrentPage}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
        onRotateDocument={() => {
          setZoom(z => (z === 1 ? 1.25 : 1));
        }}
      />

      {/* Scanned PDF Banner Notice */}
      {scannedNotice && (
        <div style={{ padding: '0.5rem 1rem', background: '#F59E0B', color: '#000', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>This PDF appears to be a scanned document or image. You can use "Whiteout" + "Add Text" to edit content.</span>
        </div>
      )}

      {/* Main Workspace */}
      <div className="editor-workspace">
        {/* Document Scrollable Workspace */}
        <div ref={documentViewerRef} className="pdf-document-viewer">
          {Array.from({ length: numPages }, (_, idx) => idx + 1).map((pNum) => (
            <PDFPageCanvas
              key={pNum}
              pdfDoc={pdfDoc}
              pageNumber={pNum}
              zoom={zoom}
              activeTool={activeTool}
              textItems={allTextItems}
              addedItems={addedItems}
              whiteoutItems={whiteoutItems}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onUpdateItem={(id, updates) => handleUpdateItem(id, updates)}
              onAddTextAt={handleAddTextAt}
              onAddWhiteoutAt={handleAddWhiteoutAt}
            />
          ))}
        </div>

        {/* Right Properties Panel */}
        <PropertiesPanel
          selectedItem={selectedItem}
          onUpdateItem={(updates) => handleUpdateItem(selectedItemId, updates)}
          onDeleteItem={handleDeleteItem}
        />
      </div>
    </div>
  );
};
