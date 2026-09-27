import { PDFService } from '../services/pdfService.js';

export const mergePDF = async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length < 2) {
      return res.status(400).json({ success: false, error: 'Please upload at least 2 PDF files to merge.' });
    }
    const resultBuffer = await PDFService.mergePDFs(files);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_merged.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const splitPDF = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const range = req.body.range || req.body.pagesToExtract || '1';
    const resultBuffer = await PDFService.splitPDF(file, range);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_split.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const deletePages = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const pagesToDelete = req.body.pagesToDelete || '1';
    const resultBuffer = await PDFService.deletePages(file, pagesToDelete);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_deleted_pages.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const rotatePDF = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const angle = req.body.angle || 90;
    const resultBuffer = await PDFService.rotatePDF(file, angle);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_rotated.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const compressPDF = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const level = req.body.level || 'recommended';
    const resultBuffer = await PDFService.compressPDF(file, level);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_compressed.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const jpgToPdf = async (req, res, next) => {
  try {
    const files = req.files;
    const resultBuffer = await PDFService.imagesToPDF(files);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_images.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const watermarkPDF = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const text = req.body.watermarkText || 'CONFIDENTIAL';
    const fontSize = req.body.fontSize || 48;
    const opacity = req.body.opacity || 0.3;

    const resultBuffer = await PDFService.watermarkPDF(file, text, fontSize, opacity);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_watermark.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const pageNumbers = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const position = req.body.position || 'bottom-center';
    const resultBuffer = await PDFService.pageNumbers(file, position);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_numbered.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const pdfToText = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const resultBuffer = await PDFService.pdfToText(file);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_text.txt"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const protectPDF = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const password = req.body.userPassword || req.body.password;
    const resultBuffer = await PDFService.protectPDF(file, password);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_protected.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};

export const unlockPDF = async (req, res, next) => {
  try {
    const file = req.files && req.files[0];
    const password = req.body.password || '';
    const resultBuffer = await PDFService.unlockPDF(file, password);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberpointak_unlocked.pdf"');
    res.send(resultBuffer);
  } catch (err) {
    next(err);
  }
};
