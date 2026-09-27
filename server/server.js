import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_CONFIG } from './config/siteConfig.js';
import { upload } from './middleware/upload.js';
import { errorHandler } from './middleware/errorHandler.js';
import * as pdfController from './controllers/pdfController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    site: SITE_CONFIG.SITE_NAME,
    tagline: SITE_CONFIG.TAGLINE,
    time: new Date().toISOString()
  });
});

// PDF Processing API Routes
const handleUpload = upload.array('files', 20);

app.post('/api/pdf/merge', handleUpload, pdfController.mergePDF);
app.post('/api/pdf/split', handleUpload, pdfController.splitPDF);
app.post('/api/pdf/extract', handleUpload, pdfController.splitPDF);
app.post('/api/pdf/extract-pages', handleUpload, pdfController.splitPDF);
app.post('/api/pdf/delete-pages', handleUpload, pdfController.deletePages);
app.post('/api/pdf/rotate', handleUpload, pdfController.rotatePDF);
app.post('/api/pdf/compress', handleUpload, pdfController.compressPDF);
app.post('/api/pdf/jpg-to-pdf', handleUpload, pdfController.jpgToPdf);
app.post('/api/pdf/png-to-pdf', handleUpload, pdfController.jpgToPdf);
app.post('/api/pdf/watermark', handleUpload, pdfController.watermarkPDF);
app.post('/api/pdf/page-numbers', handleUpload, pdfController.pageNumbers);
app.post('/api/pdf/pdf-to-text', handleUpload, pdfController.pdfToText);
app.post('/api/pdf/protect', handleUpload, pdfController.protectPDF);
app.post('/api/pdf/unlock', handleUpload, pdfController.unlockPDF);
app.post('/api/pdf/metadata', handleUpload, pdfController.watermarkPDF);

// Serve Static Production Client (if built)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.send(`
        <div style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h2>CYBERPOINTAK Backend Server Active</h2>
          <p>Running on Port ${SITE_CONFIG.PORT}. Launch Vite frontend at <a href="http://localhost:3000">http://localhost:3000</a></p>
        </div>
      `);
    }
  });
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(SITE_CONFIG.PORT, () => {
  console.log(`==================================================`);
  console.log(`  CYBERPOINTAK Server running at http://localhost:${SITE_CONFIG.PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`==================================================`);
});
