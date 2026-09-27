import { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import { useHistory } from '../context/HistoryContext';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const usePDFTool = (tool) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [resultBlobUrl, setResultBlobUrl] = useState(null);
  const [resultFilename, setResultFilename] = useState('');
  const { addRecentFile } = useHistory();

  const resetState = () => {
    setStatus('idle');
    setErrorMessage('');
    if (resultBlobUrl) {
      URL.revokeObjectURL(resultBlobUrl);
    }
    setResultBlobUrl(null);
    setResultFilename('');
  };

  const processTool = async (files, options = {}) => {
    if (!files || files.length === 0) {
      setErrorMessage('Please select at least one file.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      // First try sending to Express backend API endpoint
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      Object.keys(options).forEach((key) => formData.append(key, options[key]));

      const endpoint = `/api/pdf/${tool.id.replace('-pdf', '')}`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const contentDisposition = response.headers.get('content-disposition');
          let outName = `${tool.id}_result.pdf`;
          if (contentDisposition && contentDisposition.includes('filename=')) {
            outName = contentDisposition.split('filename=')[1].replace(/"/g, '');
          } else if (files[0]) {
            const baseName = files[0].name.replace(/\.[^/.]+$/, '');
            outName = `${baseName}_${tool.id}.pdf`;
          }

          const blobUrl = URL.createObjectURL(blob);
          setResultBlobUrl(blobUrl);
          setResultFilename(outName);
          setStatus('success');

          addRecentFile({
            name: outName,
            toolName: tool.name,
            size: `${(blob.size / 1024).toFixed(1)} KB`,
            downloadUrl: blobUrl,
          });
          return;
        }
      } catch (backendErr) {
        console.warn('Backend API unavailable, executing client-side fallback:', backendErr);
      }

      // Execute client-side fallback engine using pdf-lib & pdfjs-dist
      const result = await processClientSideFallback(tool.id, files, options);
      if (result) {
        const blobUrl = URL.createObjectURL(result.blob);
        setResultBlobUrl(blobUrl);
        setResultFilename(result.filename);
        setStatus('success');

        addRecentFile({
          name: result.filename,
          toolName: tool.name,
          size: `${(result.blob.size / 1024).toFixed(1)} KB`,
          downloadUrl: blobUrl,
        });
      } else {
        throw new Error('Processing failed or unsupported configuration.');
      }
    } catch (err) {
      console.error('PDF Tool execution error:', err);
      setErrorMessage(err.message || 'We could not process this document. Please verify your file and try again.');
      setStatus('error');
    }
  };

  return {
    status,
    errorMessage,
    resultBlobUrl,
    resultFilename,
    processTool,
    resetState,
  };
};

// Client-side fallback engine using pdf-lib
async function processClientSideFallback(toolId, files, options) {
  const primaryFile = files[0];
  const primaryBaseName = primaryFile ? primaryFile.name.replace(/\.[^/.]+$/, '') : 'document';

  switch (toolId) {
    case 'merge-pdf': {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `${primaryBaseName}_merged.pdf`,
      };
    }

    case 'split-pdf':
    case 'extract-pages': {
      const bytes = await primaryFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const totalPages = pdf.getPageCount();

      const rangeStr = options.range || options.pagesToExtract || '1';
      const pageIndices = parsePageRanges(rangeStr, totalPages);

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `${primaryBaseName}_extracted.pdf`,
      };
    }

    case 'delete-pages': {
      const bytes = await primaryFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const totalPages = pdf.getPageCount();

      const deleteStr = options.pagesToDelete || '1';
      const deleteIndices = new Set(parsePageRanges(deleteStr, totalPages));

      const keepIndices = [];
      for (let i = 0; i < totalPages; i++) {
        if (!deleteIndices.has(i)) keepIndices.push(i);
      }

      if (keepIndices.length === 0) {
        throw new Error('Cannot delete all pages in document.');
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, keepIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `${primaryBaseName}_modified.pdf`,
      };
    }

    case 'rotate-pdf': {
      const bytes = await primaryFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const angle = parseInt(options.angle || '90', 10);

      const pages = pdf.getPages();
      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + angle) % 360));
      });

      const pdfBytes = await pdf.save();
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `${primaryBaseName}_rotated.pdf`,
      };
    }

    case 'jpg-to-pdf':
    case 'png-to-pdf': {
      const newPdf = await PDFDocument.create();
      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let image;
        if (file.type.includes('png') || file.name.endsWith('.png')) {
          image = await newPdf.embedPng(imageBytes);
        } else {
          image = await newPdf.embedJpg(imageBytes);
        }
        const page = newPdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      const pdfBytes = await newPdf.save();
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `converted_images.pdf`,
      };
    }

    case 'watermark': {
      const bytes = await primaryFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const text = options.watermarkText || 'CONFIDENTIAL';
      const fontSize = parseInt(options.fontSize || '48', 10);
      const opacity = parseFloat(options.opacity || '0.3');

      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font,
          color: rgb(0.2, 0.4, 0.9),
          opacity,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdf.save();
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `${primaryBaseName}_watermarked.pdf`,
      };
    }

    case 'page-numbers': {
      const bytes = await primaryFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const total = pages.length;

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const label = `Page ${idx + 1} of ${total}`;
        const fontSize = 10;
        const textWidth = font.widthOfTextAtSize(label, fontSize);

        page.drawText(label, {
          x: width / 2 - textWidth / 2,
          y: 20,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const pdfBytes = await pdf.save();
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `${primaryBaseName}_numbered.pdf`,
      };
    }

    case 'pdf-to-jpg':
    case 'pdf-to-png': {
      const arrayBuffer = await primaryFile.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const zip = new JSZip();

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL(toolId === 'pdf-to-png' ? 'image/png' : 'image/jpeg', 0.92);
        const base64Data = dataUrl.split(',')[1];
        const ext = toolId === 'pdf-to-png' ? 'png' : 'jpg';
        zip.file(`page_${i}.${ext}`, base64Data, { base64: true });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return {
        blob: zipBlob,
        filename: `${primaryBaseName}_images.zip`,
      };
    }

    case 'pdf-to-text': {
      const arrayBuffer = await primaryFile.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = `=== TEXT EXTRACTED FROM ${primaryFile.name} BY CYBERPOINTAK ===\n\n`;

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        fullText += `--- PAGE ${i} ---\n${pageText}\n\n`;
      }

      return {
        blob: new Blob([fullText], { type: 'text/plain' }),
        filename: `${primaryBaseName}_text.txt`,
      };
    }

    case 'compress-pdf': {
      // Local stream rewrite & page normalization
      const bytes = await primaryFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pdfBytes = await pdf.save({ useObjectStreams: true });
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `${primaryBaseName}_compressed.pdf`,
      };
    }

    case 'metadata':
    case 'edit-pdf':
    case 'add-text': {
      const bytes = await primaryFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      if (options.title) pdf.setTitle(options.title);
      if (options.author) pdf.setAuthor(options.author);

      if (options.textToAdd || options.annotationText) {
        const text = options.textToAdd || options.annotationText;
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const pages = pdf.getPages();
        if (pages[0]) {
          pages[0].drawText(text, {
            x: 50,
            y: 50,
            size: 14,
            font,
            color: rgb(0.85, 0.1, 0.1),
          });
        }
      }

      const pdfBytes = await pdf.save();
      return {
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `${primaryBaseName}_edited.pdf`,
      };
    }

    default:
      return null;
  }
}

// Helper to parse page range strings like "1-3, 5, 7-10" into 0-indexed page array
function parsePageRanges(rangeStr, maxPages) {
  const pages = new Set();
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = Math.max(1, parseInt(startStr, 10) || 1);
      const end = Math.min(maxPages, parseInt(endStr, 10) || maxPages);
      for (let i = start; i <= end; i++) {
        pages.add(i - 1);
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (p >= 1 && p <= maxPages) {
        pages.add(p - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
