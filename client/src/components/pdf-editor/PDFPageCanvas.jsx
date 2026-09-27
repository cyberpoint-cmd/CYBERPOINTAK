import React, { useEffect, useRef, useState } from 'react';

export const PDFPageCanvas = ({
  pdfDoc,
  pageNumber,
  zoom,
  activeTool,
  textItems,
  addedItems,
  whiteoutItems,
  selectedItemId,
  onSelectItem,
  onUpdateItem,
  onAddTextAt,
  onAddWhiteoutAt,
}) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [viewport, setViewport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dragging state
  const [dragState, setDragState] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      if (!pdfDoc) return;
      setIsLoading(true);

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const vp = page.getViewport({ scale: zoom });
        setViewport(vp);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(vp.width * outputScale);
        canvas.height = Math.floor(vp.height * outputScale);
        canvas.style.width = `${Math.floor(vp.width)}px`;
        canvas.style.height = `${Math.floor(vp.height)}px`;

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        await page.render({
          canvasContext: context,
          viewport: vp,
          transform,
        }).promise;

        if (!isCancelled) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error(`Page ${pageNumber} render error:`, err);
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageNumber, zoom]);

  // Handle Canvas Clicking for Add Text & Whiteout tools
  const handleWrapperClick = (e) => {
    if (e.target !== wrapperRef.current && e.target !== canvasRef.current) {
      return;
    }

    if (!wrapperRef.current || !viewport) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const [pdfX, pdfY] = viewport.convertToPdfPoint(clickX, clickY);

    if (activeTool === 'add-text') {
      onAddTextAt(pageNumber, clickX, clickY, pdfX, pdfY);
    } else if (activeTool === 'whiteout') {
      onAddWhiteoutAt(pageNumber, clickX, clickY, pdfX, pdfY);
    } else {
      onSelectItem(null);
      setEditingItemId(null);
    }
  };

  // Pointer Down handler for Select / Drag movement
  const handlePointerDownItem = (e, item) => {
    e.stopPropagation();
    onSelectItem(item.id);

    // If double click or already selected, enable editing mode
    if (selectedItemId === item.id) {
      setEditingItemId(item.id);
    }

    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (err) {}

    setDragState({
      itemId: item.id,
      startX: e.clientX,
      startY: e.clientY,
      initialScreenX: item.screenX,
      initialScreenY: item.screenY,
      initialPdfX: item.pdfX,
      initialPdfY: item.pdfY,
    });
  };

  const handlePointerMove = (e) => {
    if (!dragState || !viewport) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    // Only move if mouse actually moved more than 3px to avoid accidental displacement
    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;

    const newScreenX = dragState.initialScreenX + dx;
    const newScreenY = dragState.initialScreenY + dy;

    const [pdfX, pdfY] = viewport.convertToPdfPoint(newScreenX, newScreenY);

    onUpdateItem(dragState.itemId, {
      screenX: newScreenX,
      screenY: newScreenY,
      pdfX,
      pdfY,
      edited: true,
    });
  };

  const handlePointerUp = (e) => {
    if (dragState) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {}
      setDragState(null);
    }
  };

  // Filter items for this page
  const pageTextItems = textItems.filter(t => t.pageNumber === pageNumber);
  const pageAddedItems = addedItems.filter(a => a.pageNumber === pageNumber);
  const pageWhiteouts = whiteoutItems.filter(w => w.pageNumber === pageNumber);

  return (
    <div
      ref={wrapperRef}
      className="pdf-page-wrapper"
      onClick={handleWrapperClick}
      onPointerMove={dragState ? handlePointerMove : undefined}
      onPointerUp={dragState ? handlePointerUp : undefined}
      style={{
        width: viewport ? `${viewport.width}px` : '612px',
        height: viewport ? `${viewport.height}px` : '792px',
        cursor: activeTool === 'add-text' ? 'crosshair' : activeTool === 'whiteout' ? 'copy' : 'default',
      }}
    >
      {/* Background Rendered PDF Canvas */}
      <canvas ref={canvasRef} className="pdf-page-canvas" />

      {/* Interactive Overlay Layer */}
      {viewport && (
        <div className="pdf-text-layer-overlay">
          {/* 1. Whiteout Shapes */}
          {pageWhiteouts.map((w) => {
            const isSelected = selectedItemId === w.id;
            let sX = w.screenX;
            let sY = w.screenY;
            let sW = w.pdfWidth * viewport.scale;
            let sH = w.pdfHeight * viewport.scale;

            if (viewport.convertToViewportPoint) {
              const [vX, vY] = viewport.convertToViewportPoint(w.pdfX, w.pdfY);
              sX = vX;
              sY = vY - sH;
            }

            return (
              <div
                key={w.id}
                className={`pdf-whiteout-box ${isSelected ? 'selected' : ''}`}
                style={{
                  left: `${sX}px`,
                  top: `${sY}px`,
                  width: `${sW}px`,
                  height: `${sH}px`,
                  cursor: 'move',
                }}
                onPointerDown={(e) => handlePointerDownItem(e, w)}
              />
            );
          })}

          {/* 2. Original PDF Text Items (NO DUPLICATE TEXT) */}
          {pageTextItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            const isEditing = editingItemId === item.id;
            const isEdited = item.edited || item.pdfX !== item.originalPdfX || item.pdfY !== item.originalPdfY;
            const isDeleted = item.deleted;

            let sX = item.screenX;
            let sY = item.screenY;
            let fontSz = (item.fontSizePdf || 12) * viewport.scale;
            let sW = item.pdfWidth * viewport.scale;
            let sH = fontSz * (item.str.split('\n').length || 1);

            if (viewport.convertToViewportPoint) {
              const [vX, vY] = viewport.convertToViewportPoint(item.pdfX, item.pdfY);
              sX = vX;
              sY = vY - fontSz;
            }

            // UNSELECTED & UNEDITED: Render 100% INVISIBLE detection box
            if (!isSelected && !isEdited && !isDeleted) {
              return (
                <div
                  key={item.id}
                  className="pdf-text-item-box invisible-detect-box"
                  style={{
                    left: `${sX}px`,
                    top: `${sY}px`,
                    width: `${Math.max(sW, 20)}px`,
                    height: `${Math.max(sH, 16)}px`,
                  }}
                  title="Click to select / Drag to move"
                  onPointerDown={(e) => handlePointerDownItem(e, item)}
                  onDoubleClick={() => setEditingItemId(item.id)}
                />
              );
            }

            // DELETED ORIGINAL TEXT: Cover original canvas text with solid white rectangle
            if (isDeleted && !isSelected) {
              let origX = item.screenX;
              let origY = item.screenY;
              if (viewport.convertToViewportPoint && item.originalPdfX !== undefined) {
                const [vX, vY] = viewport.convertToViewportPoint(item.originalPdfX, item.originalPdfY);
                origX = vX;
                origY = vY - fontSz;
              }

              return (
                <div
                  key={item.id}
                  style={{
                    position: 'absolute',
                    left: `${origX - 1}px`,
                    top: `${origY - 1}px`,
                    width: `${Math.max(sW, 20) + 2}px`,
                    height: `${Math.max(sH, 16) + 2}px`,
                    backgroundColor: '#FFFFFF',
                    pointerEvents: 'auto',
                    zIndex: 10,
                  }}
                  onPointerDown={(e) => handlePointerDownItem(e, item)}
                />
              );
            }

            // Calculate original whiteout mask position on screen
            let maskX = item.screenX;
            let maskY = item.screenY;
            if (viewport.convertToViewportPoint && item.originalPdfX !== undefined) {
              const [vX, vY] = viewport.convertToViewportPoint(item.originalPdfX, item.originalPdfY);
              maskX = vX;
              maskY = vY - fontSz;
            }

            return (
              <React.Fragment key={item.id}>
                {/* Solid white rectangle covering original canvas text position */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${maskX - 2}px`,
                    top: `${maskY - 2}px`,
                    width: `${Math.max(sW, 20) + 4}px`,
                    height: `${Math.max(sH, 16) + 4}px`,
                    backgroundColor: '#FFFFFF',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />

                {/* Selected/Moved Text Item */}
                <div
                  className={`pdf-text-item-box ${isSelected ? 'selected' : ''} ${isEdited ? 'edited' : ''}`}
                  style={{
                    left: `${sX}px`,
                    top: `${sY}px`,
                    minWidth: `${Math.max(sW, 30)}px`,
                    minHeight: `${Math.max(sH, 20)}px`,
                    fontSize: `${fontSz}px`,
                    fontFamily: item.fontFamily || 'Arial',
                    fontWeight: item.bold ? 'bold' : 'normal',
                    fontStyle: item.italic ? 'italic' : 'normal',
                    textDecoration: item.underline ? 'underline' : 'none',
                    textAlign: item.align || 'left',
                    color: item.color || '#000000',
                    opacity: item.opacity || 1,
                    backgroundColor: '#FFFFFF',
                    padding: '2px 4px',
                    cursor: 'move',
                    zIndex: 20,
                  }}
                  onPointerDown={(e) => handlePointerDownItem(e, item)}
                  onDoubleClick={() => setEditingItemId(item.id)}
                >
                  {isEditing || isSelected ? (
                    <textarea
                      className="text-item-input"
                      value={item.str}
                      onChange={(e) => onUpdateItem(item.id, { str: e.target.value, edited: true })}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Escape') {
                          setEditingItemId(null);
                        }
                      }}
                      rows={item.str.split('\n').length || 1}
                      autoFocus
                    />
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: '100%' }}>
                      {item.str}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* 3. Newly Added Text Items (Supports Multiline) */}
          {pageAddedItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            const isEditing = editingItemId === item.id;

            let sX = item.screenX;
            let sY = item.screenY;
            let fontSz = (item.fontSizePdf || 14) * viewport.scale;

            if (viewport.convertToViewportPoint) {
              const [vX, vY] = viewport.convertToViewportPoint(item.pdfX, item.pdfY);
              sX = vX;
              sY = vY - fontSz;
            }

            return (
              <div
                key={item.id}
                className={`pdf-text-item-box ${isSelected ? 'selected' : ''}`}
                style={{
                  left: `${sX}px`,
                  top: `${sY}px`,
                  fontSize: `${fontSz}px`,
                  fontFamily: item.fontFamily || 'Arial',
                  fontWeight: item.bold ? 'bold' : 'normal',
                  fontStyle: item.italic ? 'italic' : 'normal',
                  textDecoration: item.underline ? 'underline' : 'none',
                  textAlign: item.align || 'left',
                  color: item.color || '#000000',
                  opacity: item.opacity || 1,
                  backgroundColor: '#FFFFFF',
                  padding: '4px 6px',
                  borderRadius: '3px',
                  cursor: 'move',
                  zIndex: 25,
                }}
                onPointerDown={(e) => handlePointerDownItem(e, item)}
                onDoubleClick={() => setEditingItemId(item.id)}
              >
                {isEditing || isSelected ? (
                  <textarea
                    className="text-item-input"
                    value={item.str}
                    onChange={(e) => onUpdateItem(item.id, { str: e.target.value, edited: true })}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Escape') {
                        setEditingItemId(null);
                      }
                    }}
                    placeholder="Type text..."
                    rows={item.str.split('\n').length || 1}
                    autoFocus
                  />
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minWidth: '80px' }}>
                    {item.str || 'Type text...'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
