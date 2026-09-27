import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import sharp from 'sharp';
import JSZip from 'jszip';

export class PDFService {
  // Merge multiple PDF files into one PDF
  static async mergePDFs(files) {
    if (!files || files.length < 2) {
      throw new Error('Please upload at least 2 PDF files to merge.');
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    return Buffer.from(pdfBytes);
  }

  // Split / Extract pages from PDF
  static async splitPDF(file, rangeStr = '1') {
    if (!file) throw new Error('No PDF file provided for splitting.');

    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    const totalPages = pdf.getPageCount();
    const indices = parsePageRanges(rangeStr, totalPages);

    if (indices.length === 0) {
      throw new Error(`Invalid page range "${rangeStr}". Document has ${totalPages} pages.`);
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, indices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    return Buffer.from(pdfBytes);
  }

  // Delete pages from PDF
  static async deletePages(file, pagesToDeleteStr = '1') {
    if (!file) throw new Error('No PDF file provided.');

    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    const totalPages = pdf.getPageCount();
    const deleteSet = new Set(parsePageRanges(pagesToDeleteStr, totalPages));

    const keepIndices = [];
    for (let i = 0; i < totalPages; i++) {
      if (!deleteSet.has(i)) keepIndices.push(i);
    }

    if (keepIndices.length === 0) {
      throw new Error('Cannot delete all pages in the PDF document.');
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, keepIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    return Buffer.from(pdfBytes);
  }

  // Rotate pages in PDF
  static async rotatePDF(file, angle = 90) {
    if (!file) throw new Error('No PDF file provided.');

    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    const angleNum = parseInt(angle, 10);
    const pages = pdf.getPages();

    pages.forEach((page) => {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angleNum) % 360));
    });

    const pdfBytes = await pdf.save();
    return Buffer.from(pdfBytes);
  }

  // Compress PDF (stream optimization & page rebuild)
  static async compressPDF(file, level = 'recommended') {
    if (!file) throw new Error('No PDF file provided.');

    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    
    // Save with stream compression and object streams
    const pdfBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false
    });

    return Buffer.from(pdfBytes);
  }

  // JPG / PNG to PDF
  static async imagesToPDF(files) {
    if (!files || files.length === 0) {
      throw new Error('Please upload at least one image.');
    }

    const newPdf = await PDFDocument.create();

    for (const file of files) {
      let imageBuffer = file.buffer;
      const isPng = file.mimetype.includes('png') || file.originalname.toLowerCase().endsWith('.png');

      // Convert images using sharp for clean embedding
      let image;
      if (isPng) {
        image = await newPdf.embedPng(imageBuffer);
      } else {
        // Normalize JPG using sharp
        const jpegBuffer = await sharp(imageBuffer).jpeg({ quality: 90 }).toBuffer();
        image = await newPdf.embedJpg(jpegBuffer);
      }

      const page = newPdf.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
      });
    }

    const pdfBytes = await newPdf.save();
    return Buffer.from(pdfBytes);
  }

  // Watermark PDF
  static async watermarkPDF(file, text = 'CONFIDENTIAL', fontSize = 48, opacity = 0.3) {
    if (!file) throw new Error('No PDF file provided.');

    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    const fontSizeNum = parseInt(fontSize, 10);
    const opacityNum = parseFloat(opacity);

    const pages = pdf.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSizeNum);
      const textHeight = font.heightAtSize(fontSizeNum);

      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: height / 2 - textHeight / 2,
        size: fontSizeNum,
        font,
        color: rgb(0.2, 0.4, 0.9),
        opacity: opacityNum,
        rotate: degrees(45)
      });
    });

    const pdfBytes = await pdf.save();
    return Buffer.from(pdfBytes);
  }

  // Add Page Numbers
  static async pageNumbers(file, position = 'bottom-center') {
    if (!file) throw new Error('No PDF file provided.');

    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const pages = pdf.getPages();
    const total = pages.length;

    pages.forEach((page, idx) => {
      const { width, height } = page.getSize();
      const label = `Page ${idx + 1} of ${total}`;
      const fontSize = 10;
      const textWidth = font.widthOfTextAtSize(label, fontSize);

      let x = width / 2 - textWidth / 2;
      let y = 20;

      if (position === 'bottom-right') x = width - textWidth - 30;
      if (position === 'top-right') { x = width - textWidth - 30; y = height - 30; }

      page.drawText(label, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.3, 0.3, 0.3)
      });
    });

    const pdfBytes = await pdf.save();
    return Buffer.from(pdfBytes);
  }

  // PDF to Text
  static async pdfToText(file) {
    if (!file) throw new Error('No PDF file provided.');

    const data = await pdfParse(file.buffer);
    const outputText = `=== TEXT EXTRACTED BY CYBERPOINTAK ===\nTitle: ${data.info.Title || 'Document'}\nPages: ${data.numpages}\n\n${data.text}`;
    return Buffer.from(outputText, 'utf-8');
  }

  // Protect PDF with Password
  static async protectPDF(file, userPassword = '') {
    if (!file) throw new Error('No PDF file provided.');
    if (!userPassword) throw new Error('Please specify a password to protect your PDF.');

    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    pdf.setTitle('Protected Document - CYBERPOINTAK');
    const pdfBytes = await pdf.save({
      userPassword,
      ownerPassword: userPassword + '_owner'
    });

    return Buffer.from(pdfBytes);
  }

  // Unlock PDF
  static async unlockPDF(file, password = '') {
    if (!file) throw new Error('No PDF file provided.');

    const pdf = await PDFDocument.load(file.buffer, { password, ignoreEncryption: true });
    const pdfBytes = await pdf.save();
    return Buffer.from(pdfBytes);
  }
}

// Helper to parse page range strings
function parsePageRanges(rangeStr, maxPages) {
  const pages = new Set();
  if (!rangeStr) return Array.from({ length: maxPages }, (_, i) => i);

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
