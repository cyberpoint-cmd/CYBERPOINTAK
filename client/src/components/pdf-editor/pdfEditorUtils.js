import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

/**
 * Screen to PDF Coordinate Conversion
 * PDF coordinates origin (0, 0) is at Bottom-Left.
 * Browser canvas origin (0, 0) is at Top-Left.
 */
export function screenToPdfCoordinates(screenX, screenY, viewport, pageHeight) {
  if (viewport && viewport.convertToPdfPoint) {
    const [pdfX, pdfY] = viewport.convertToPdfPoint(screenX, screenY);
    return { x: pdfX, y: pdfY };
  }
  const scale = viewport ? viewport.scale : 1;
  const pdfX = screenX / scale;
  const pdfY = pageHeight - (screenY / scale);
  return { x: pdfX, y: pdfY };
}

/**
 * PDF to Screen Coordinate Conversion
 */
export function pdfToScreenCoordinates(pdfX, pdfY, viewport, pageHeight) {
  if (viewport && viewport.convertToViewportPoint) {
    const [screenX, screenY] = viewport.convertToViewportPoint(pdfX, pdfY);
    return { x: screenX, y: screenY };
  }
  const scale = viewport ? viewport.scale : 1;
  const screenX = pdfX * scale;
  const screenY = (pageHeight - pdfY) * scale;
  return { x: screenX, y: screenY };
}

/**
 * Maps pdfjs textContent items to structured editor text items
 */
export function extractPageTextItems(textContent, viewport, pageNumber, pageHeight) {
  if (!textContent || !textContent.items) return [];

  return textContent.items.map((item, idx) => {
    // PDF transform matrix [a, b, c, d, e, f]
    // e = pdfX, f = pdfY (baseline)
    const tx = item.transform;
    const pdfX = tx[4];
    const pdfY = tx[5];

    // Convert font size from matrix height
    const fontSizePdf = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]) || Math.abs(tx[3]) || Math.abs(tx[0]) || 12;
    const pdfWidth = item.width || (item.str.length * fontSizePdf * 0.5);
    const pdfHeight = item.height || fontSizePdf;

    // Viewport bounding box on screen
    let screenX = pdfX;
    let screenY = pageHeight - pdfY;
    let screenWidth = pdfWidth;
    let screenHeight = pdfHeight;
    let fontSizeScreen = fontSizePdf;

    if (viewport) {
      const [vX, vY] = viewport.convertToViewportPoint(pdfX, pdfY);
      screenX = vX;
      screenY = vY - (fontSizePdf * viewport.scale);
      screenWidth = pdfWidth * viewport.scale;
      screenHeight = pdfHeight * viewport.scale;
      fontSizeScreen = fontSizePdf * viewport.scale;
    }

    return {
      id: `p${pageNumber}_t${idx}_${Date.now()}`,
      pageNumber,
      str: item.str,
      originalStr: item.str,
      pdfX,
      pdfY,
      originalPdfX: pdfX,
      originalPdfY: pdfY,
      pdfWidth,
      pdfHeight,
      fontSizePdf,
      screenX,
      screenY,
      screenWidth,
      screenHeight,
      fontSizeScreen,
      fontName: item.fontName || 'sans-serif',
      fontFamily: mapPdfFontToStandard(item.fontName),
      bold: false,
      italic: false,
      underline: false,
      color: '#000000',
      align: 'left',
      opacity: 1,
      edited: false,
      deleted: false,
      isOriginal: true,
    };
  });
}

/**
 * Helper to map PDF internal font names to clean standard fonts
 */
export function mapPdfFontToStandard(pdfFontName = '') {
  const name = pdfFontName.toLowerCase();
  if (name.includes('times') || name.includes('serif')) return 'Times New Roman';
  if (name.includes('courier') || name.includes('mono')) return 'Courier New';
  if (name.includes('georgia')) return 'Georgia';
  if (name.includes('verdana')) return 'Verdana';
  return 'Arial';
}

/**
 * Parse hex color to pdf-lib rgb object
 */
export function hexToPdfRgb(hexColor = '#000000') {
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2) || '00', 16) / 255;
  const g = parseInt(hex.substring(2, 4) || '00', 16) / 255;
  const b = parseInt(hex.substring(4, 6) || '00', 16) / 255;
  return rgb(r, g, b);
}

/**
 * Helper to check if string contains Hindi / Devanagari or Non-Latin Unicode characters
 */
export function isUnicodeString(str = '') {
  return /[^\u0000-\u00FF]/.test(str);
}

/**
 * EXPORT ENGINE using pdf-lib
 * Handles multiline text (\n), font formatting, text box movement, whiteouts, and original text masking.
 */
export async function exportEditedPDF(originalArrayBuffer, allTextItems, addedItems, whiteoutItems, drawingItems) {
  const pdfDoc = await PDFDocument.load(originalArrayBuffer, { ignoreEncryption: true });

  // Register fontkit for custom Unicode/TTF font embedding
  pdfDoc.registerFontkit(fontkit);

  // Load Standard Fonts
  const fonts = {
    Arial: await pdfDoc.embedFont(StandardFonts.Helvetica),
    'Arial-Bold': await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    'Arial-Italic': await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
    'Arial-BoldItalic': await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
    
    Helvetica: await pdfDoc.embedFont(StandardFonts.Helvetica),
    'Helvetica-Bold': await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    'Helvetica-Italic': await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
    
    'Times New Roman': await pdfDoc.embedFont(StandardFonts.TimesRoman),
    'Times New Roman-Bold': await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
    'Times New Roman-Italic': await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
    
    'Courier New': await pdfDoc.embedFont(StandardFonts.Courier),
    'Courier New-Bold': await pdfDoc.embedFont(StandardFonts.CourierBold),

    Georgia: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    Verdana: await pdfDoc.embedFont(StandardFonts.Helvetica),
  };

  // Attempt to load Devanagari / Unicode TTF font for Hindi support
  let devanagariFont = null;
  try {
    const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansdevanagari/NotoSansDevanagari-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    if (fontBytes && fontBytes.byteLength > 0) {
      devanagariFont = await pdfDoc.embedFont(fontBytes);
    }
  } catch (e) {
    console.warn('Unicode Devanagari font fetch fallback:', e);
  }

  const selectFont = (fontFamily = 'Arial', bold = false, italic = false, text = '') => {
    if (isUnicodeString(text) && devanagariFont) {
      return devanagariFont;
    }

    let key = fontFamily;
    if (bold && italic) key += '-BoldItalic';
    else if (bold) key += '-Bold';
    else if (italic) key += '-Italic';
    return fonts[key] || fonts[fontFamily] || fonts['Arial'];
  };

  const pageCount = pdfDoc.getPageCount();

  for (let p = 1; p <= pageCount; p++) {
    const page = pdfDoc.getPage(p - 1);

    // 1. Process Whiteouts on this page
    const pageWhiteouts = whiteoutItems.filter(w => w.pageNumber === p);
    for (const w of pageWhiteouts) {
      page.drawRectangle({
        x: w.pdfX,
        y: w.pdfY,
        width: w.pdfWidth,
        height: w.pdfHeight,
        color: rgb(1, 1, 1),
        opacity: 1,
      });
    }

    // 2. Process Original Text Edits, Deletions, & Movements on this page
    const pageOriginalItems = allTextItems.filter(t => t.pageNumber === p && (t.edited || t.deleted || t.pdfX !== t.originalPdfX || t.pdfY !== t.originalPdfY));

    for (const item of pageOriginalItems) {
      // Always cover original text at its ORIGINAL location
      const origX = item.originalPdfX !== undefined ? item.originalPdfX : item.pdfX;
      const origY = item.originalPdfY !== undefined ? item.originalPdfY : item.pdfY;
      const coverPadding = 2;
      const rectHeight = Math.max(item.pdfHeight, item.fontSizePdf || 12);

      page.drawRectangle({
        x: origX - coverPadding,
        y: origY - (rectHeight * 0.25) - coverPadding,
        width: Math.max(item.pdfWidth, 20) + (coverPadding * 2),
        height: rectHeight + (coverPadding * 2),
        color: rgb(1, 1, 1),
        opacity: 1,
      });

      // Draw replacement text at NEW position if not deleted
      if (!item.deleted && item.str.trim() !== '') {
        const font = selectFont(item.fontFamily, item.bold, item.italic, item.str);
        const color = hexToPdfRgb(item.color || '#000000');
        const size = item.fontSizePdf || 12;
        const lineHeight = size * 1.25;

        // Split multiline string by \n
        const lines = item.str.split('\n');

        lines.forEach((lineStr, lIdx) => {
          if (lineStr.trim() === '') return;

          const lineY = item.pdfY - (lIdx * lineHeight);
          let lineX = item.pdfX;

          // Alignment adjustments for multiline text
          if (item.align === 'center' || item.align === 'right') {
            try {
              const textW = font.widthOfTextAtSize(lineStr, size);
              const maxW = Math.max(item.pdfWidth, textW);
              if (item.align === 'center') lineX = item.pdfX + (maxW - textW) / 2;
              if (item.align === 'right') lineX = item.pdfX + (maxW - textW);
            } catch (e) {}
          }

          try {
            page.drawText(lineStr, {
              x: lineX,
              y: lineY,
              size,
              font,
              color,
              opacity: item.opacity || 1,
            });

            if (item.underline) {
              const textWidth = font.widthOfTextAtSize(lineStr, size);
              page.drawLine({
                start: { x: lineX, y: lineY - 2 },
                end: { x: lineX + textWidth, y: lineY - 2 },
                thickness: 1,
                color,
                opacity: item.opacity || 1,
              });
            }
          } catch (fontErr) {
            page.drawText(lineStr, {
              x: lineX,
              y: lineY,
              size,
              font: fonts['Arial'],
              color,
              opacity: item.opacity || 1,
            });
          }
        });
      }
    }

    // 3. Process Newly Added Multiline Text Elements on this page
    const pageAdded = addedItems.filter(a => a.pageNumber === p && !a.deleted);

    for (const item of pageAdded) {
      if (!item.str || item.str.trim() === '') continue;

      const font = selectFont(item.fontFamily, item.bold, item.italic, item.str);
      const color = hexToPdfRgb(item.color || '#000000');
      const size = item.fontSizePdf || 14;
      const lineHeight = size * 1.25;

      const lines = item.str.split('\n');

      lines.forEach((lineStr, lIdx) => {
        if (lineStr.trim() === '') return;

        const lineY = item.pdfY - (lIdx * lineHeight);
        let lineX = item.pdfX;

        try {
          page.drawText(lineStr, {
            x: lineX,
            y: lineY,
            size,
            font,
            color,
            opacity: item.opacity || 1,
          });

          if (item.underline) {
            const textWidth = font.widthOfTextAtSize(lineStr, size);
            page.drawLine({
              start: { x: lineX, y: lineY - 2 },
              end: { x: lineX + textWidth, y: lineY - 2 },
              thickness: 1.2,
              color,
              opacity: item.opacity || 1,
            });
          }
        } catch (fontErr) {
          page.drawText(lineStr, {
            x: lineX,
            y: lineY,
            size,
            font: fonts['Arial'],
            color,
            opacity: item.opacity || 1,
          });
        }
      });
    }

    // 4. Process Drawings & Highlights on this page
    const pageDrawings = drawingItems.filter(d => d.pageNumber === p);
    for (const d of pageDrawings) {
      if (d.type === 'highlight') {
        page.drawRectangle({
          x: d.pdfX,
          y: d.pdfY,
          width: d.pdfWidth,
          height: d.pdfHeight,
          color: hexToPdfRgb(d.color || '#FACC15'),
          opacity: d.opacity || 0.4,
        });
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
