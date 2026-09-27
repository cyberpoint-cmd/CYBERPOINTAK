# CYBERPOINTAK — Powerful PDF Tools. Simple & Free.

**CYBERPOINTAK** is a modern, high-performance, professional PDF utilities website built for seamless document manipulation. It features an original, sleek design, high usability, local-first execution capabilities, dark mode, responsive layouts, and zero paywalls or forced accounts.

---

## 🚀 Key Features

- **⚡ Fast & Instant Processing**: Work with PDF documents locally in your browser or via optimized node stream workers.
- **🔒 Privacy First**: Your files stay local or are immediately purged after processing. No permanent storage or tracking.
- **🎨 Premium Original Design**: Electric blue & deep navy visual identity, responsive cards, smooth micro-animations, glassmorphism header, and dark mode.
- **🔍 Real-Time Search**: Instant filter across 20+ PDF tools by name, description, or category.
- **📁 File Management**: Drag & drop upload zone, multi-file reordering, size & format validation, file previews.
- **📱 Fully Responsive**: Flawless experience across mobile (320px+), tablet, and desktop monitors.
- **🌙 Dark Mode**: Toggle between crisp light theme and `#0B1120` dark mode with automatic persistence.
- **📂 Local Processing History**: View recent files in a local history drawer (stored strictly in your browser).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, JavaScript, Modular CSS Variables, Lucide Icons, Canvas Confetti.
- **PDF Engine (Client)**: `pdf-lib`, `pdfjs-dist`, `jszip`.
- **Backend API**: Node.js, Express, Multer, `pdf-lib`, `pdf-parse`, `sharp`, `jszip`.
- **Styling**: Pure CSS design system with CSS custom properties (variables) for theme switching.

---

## ⚡ Functional V1 Tools (Working Local Tools)

1. **Merge PDF**: Combine multiple PDF files into one document in any custom order.
2. **Split PDF**: Extract specific page ranges (e.g. `1-3, 5, 8-10`) into a new PDF.
3. **Delete Pages**: Remove unwanted pages from your PDF file.
4. **Extract Pages**: Extract individual pages into new documents.
5. **Rotate PDF**: Rotate all or specific pages (90°, 180°, 270°).
6. **Compress PDF**: Optimize PDF document size while preserving readability.
7. **JPG to PDF**: Convert JPG / JPEG images into clean single or multi-page PDFs.
8. **PNG to PDF**: Convert PNG images into PDF files.
9. **PDF to JPG**: Extract every page of a PDF into high-quality JPG images (zipped).
10. **PDF to PNG**: Convert PDF pages into transparent-capable PNG images.
11. **PDF to Text**: Extract all readable raw text from a PDF document into `.txt`.
12. **Watermark PDF**: Add custom text watermarks across every page with custom opacity.
13. **Page Numbers**: Add dynamic page numbering ("Page X of Y") to header or footer.
14. **Protect PDF**: Encrypt PDF files with a custom user password.
15. **Unlock PDF**: Remove password security and restrictions from unlocked PDFs.
16. **Metadata Editor**: View and update document Title and Author properties.

*Advanced tools requiring heavy native OCR/Office binary engines (PDF → Word, OCR, PDF → Excel) are architected with "Coming Soon" status badges and informative modals without throwing errors or presenting broken fake buttons.*

---

## 💻 Local PC Setup & Quickstart

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Tested on Node `v24.15.0`)
- **NPM**: `v9.0.0` or higher

### Installation Commands

1. Open PowerShell or Command Prompt in the project folder:
   ```powershell
   cd c:\Users\admin\OneDrive\Desktop\CYBERSITE2
   ```

2. Install all root, server, and client dependencies:
   ```powershell
   npm run postinstall
   ```

### Running the App Locally

To launch both the Node.js Express backend and Vite React frontend concurrently:

```powershell
npm run dev
```

The application will start automatically:
- **Frontend URL**: [http://localhost:3000](http://localhost:3000)
- **Backend API URL**: [http://localhost:5000](http://localhost:5000)

---

## ⚙️ Configuration

You can customize global website properties in `client/src/data/config.js` and `server/config/siteConfig.js`:

```javascript
export const SITE_CONFIG = {
  SITE_NAME: "CYBERPOINTAK",
  TAGLINE: "Powerful PDF Tools. Simple & Free.",
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  PREMIUM_ENABLED: false,
};
```

---

## 🛑 How to Stop Server

In your terminal window, press `Ctrl + C` and type `Y` to confirm.

---

## 🔧 Troubleshooting

- **Port 3000 or 5000 in use**: If another process is using port 3000 or 5000, Vite will automatically offer the next port or you can terminate the conflicting process using `stop-process` or task manager.
- **Large Files**: Default max file size is set to 50MB. Modify `MAX_FILE_SIZE` in `client/src/data/config.js` to adjust limits.

---

## 🛣️ Future Roadmap

- Native WASM Tesseract OCR engine integration.
- PDF page re-ordering canvas interface.
- Optional Cloud sync & account authentication modules.
- Stripe / Subscription layer (ready via `PREMIUM_ENABLED` flag).

---

© 2026 **CYBERPOINTAK**. All rights reserved.
