export const TOOL_CATEGORIES = [
  { id: "all", name: "All Tools" },
  { id: "organize", name: "Organize PDF" },
  { id: "optimize", name: "Optimize PDF" },
  { id: "convert-to", name: "Convert to PDF" },
  { id: "convert-from", name: "Convert from PDF" },
  { id: "edit", name: "Edit PDF" },
  { id: "security", name: "Security" },
  { id: "other", name: "Other Tools" },
];

export const TOOLS_LIST = [
  // ORGANIZE PDF
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one single document in your desired order.",
    category: "Organize PDF",
    categoryId: "organize",
    route: "/merge-pdf",
    icon: "Combine",
    supportedFormats: [".pdf"],
    acceptMultiple: true,
    status: "available",
    popular: true,
    badge: "POPULAR",
    options: []
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Separate one PDF into individual pages or extract specific page ranges.",
    category: "Organize PDF",
    categoryId: "organize",
    route: "/split-pdf",
    icon: "Split",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: true,
    badge: "POPULAR",
    options: [
      { id: "range", label: "Page Range (e.g. 1-3, 5, 7-10)", type: "text", defaultValue: "1-2" }
    ]
  },
  {
    id: "delete-pages",
    name: "Delete Pages",
    description: "Remove unwanted pages from your PDF document easily.",
    category: "Organize PDF",
    categoryId: "organize",
    route: "/delete-pages",
    icon: "Trash2",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: [
      { id: "pagesToDelete", label: "Pages to Delete (e.g. 1, 3-5)", type: "text", defaultValue: "1" }
    ]
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    description: "Select and save specific pages as a new independent PDF file.",
    category: "Organize PDF",
    categoryId: "organize",
    route: "/extract-pages",
    icon: "FileOutput",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: [
      { id: "pagesToExtract", label: "Pages to Extract (e.g. 1, 3-4)", type: "text", defaultValue: "1" }
    ]
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate individual or all pages of your PDF document (90°, 180°, 270°).",
    category: "Organize PDF",
    categoryId: "organize",
    route: "/rotate-pdf",
    icon: "RotateCw",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: true,
    badge: "FAST",
    options: [
      { 
        id: "angle", 
        label: "Rotation Angle", 
        type: "select", 
        defaultValue: "90",
        selectOptions: [
          { label: "90° Clockwise", value: "90" },
          { label: "180° Flip", value: "180" },
          { label: "270° Counter-Clockwise", value: "270" }
        ] 
      }
    ]
  },
  {
    id: "reorder-pages",
    name: "Reorder Pages",
    description: "Drag and drop to rearrange the pages in your PDF in any order.",
    category: "Organize PDF",
    categoryId: "organize",
    route: "/reorder-pages",
    icon: "ArrowDownUp",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: []
  },

  // OPTIMIZE PDF
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while preserving optimal document quality.",
    category: "Optimize PDF",
    categoryId: "optimize",
    route: "/compress-pdf",
    icon: "Minimize2",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: true,
    badge: "POPULAR",
    options: [
      {
        id: "level",
        label: "Compression Level",
        type: "select",
        defaultValue: "recommended",
        selectOptions: [
          { label: "Extreme Compression (Smallest size)", value: "extreme" },
          { label: "Recommended Compression (Good quality)", value: "recommended" },
          { label: "Less Compression (High quality)", value: "less" }
        ]
      }
    ]
  },
  {
    id: "repair-pdf",
    name: "Repair PDF",
    description: "Fix broken or corrupted PDF documents and recover readable content.",
    category: "Optimize PDF",
    categoryId: "optimize",
    route: "/repair-pdf",
    icon: "Wrench",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: false,
    options: []
  },

  // CONVERT TO PDF
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG and JPEG images into a clean single or multi-page PDF.",
    category: "Convert to PDF",
    categoryId: "convert-to",
    route: "/jpg-to-pdf",
    icon: "FileImage",
    supportedFormats: [".jpg", ".jpeg"],
    acceptMultiple: true,
    status: "available",
    popular: true,
    badge: "FAST",
    options: []
  },
  {
    id: "png-to-pdf",
    name: "PNG to PDF",
    description: "Convert PNG images into a professional high-resolution PDF document.",
    category: "Convert to PDF",
    categoryId: "convert-to",
    route: "/png-to-pdf",
    icon: "Image",
    supportedFormats: [".png"],
    acceptMultiple: true,
    status: "available",
    popular: false,
    options: []
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert DOC and DOCX files into clean read-only PDF documents.",
    category: "Convert to PDF",
    categoryId: "convert-to",
    route: "/word-to-pdf",
    icon: "FileText",
    supportedFormats: [".doc", ".docx"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: true,
    options: []
  },

  // CONVERT FROM PDF
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Extract every page of your PDF into high-quality JPG images.",
    category: "Convert from PDF",
    categoryId: "convert-from",
    route: "/pdf-to-jpg",
    icon: "ImageDown",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: true,
    badge: "POPULAR",
    options: []
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    description: "Convert PDF pages into clear PNG images with transparent background support.",
    category: "Convert from PDF",
    categoryId: "convert-from",
    route: "/pdf-to-png",
    icon: "FileCode",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: []
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF documents into editable Microsoft Word (.docx) documents.",
    category: "Convert from PDF",
    categoryId: "convert-from",
    route: "/pdf-to-word",
    icon: "FileSpreadsheet",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: true,
    options: []
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Extract tables and structured data from PDF files directly to Excel spreadsheets.",
    category: "Convert from PDF",
    categoryId: "convert-from",
    route: "/pdf-to-excel",
    icon: "Table",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: false,
    options: []
  },
  {
    id: "pdf-to-text",
    name: "PDF to Text",
    description: "Extract all raw readable text content from your PDF document instantly.",
    category: "Convert from PDF",
    categoryId: "convert-from",
    route: "/pdf-to-text",
    icon: "FileSearch",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: []
  },

  // EDIT PDF
  {
    id: "edit-pdf",
    name: "Edit PDF",
    description: "Add custom text, annotations, signatures and stamps to your PDF.",
    category: "Edit PDF",
    categoryId: "edit",
    route: "/edit-pdf",
    icon: "Edit3",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: true,
    badge: "NEW",
    options: [
      { id: "annotationText", label: "Add Custom Text / Note", type: "text", defaultValue: "Confidential Document" },
      { 
        id: "position", 
        label: "Text Position", 
        type: "select", 
        defaultValue: "bottom-right",
        selectOptions: [
          { label: "Top Left", value: "top-left" },
          { label: "Top Right", value: "top-right" },
          { label: "Bottom Left", value: "bottom-left" },
          { label: "Bottom Right", value: "bottom-right" },
          { label: "Center", value: "center" }
        ]
      }
    ]
  },
  {
    id: "add-text",
    name: "Add Text to PDF",
    description: "Insert custom text headings, paragraphs or notes into existing PDF pages.",
    category: "Edit PDF",
    categoryId: "edit",
    route: "/add-text",
    icon: "Type",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: [
      { id: "textToAdd", label: "Text Content", type: "text", defaultValue: "APPROVED BY CYBERPOINTAK" }
    ]
  },
  {
    id: "add-image",
    name: "Add Image",
    description: "Overlay logos, signatures, or images onto pages of your PDF document.",
    category: "Edit PDF",
    categoryId: "edit",
    route: "/add-image",
    icon: "PlusSquare",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: false,
    options: []
  },
  {
    id: "draw",
    name: "Draw on PDF",
    description: "Draw freehand shapes, arrows, or lines onto PDF documents.",
    category: "Edit PDF",
    categoryId: "edit",
    route: "/draw",
    icon: "PenTool",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: false,
    options: []
  },
  {
    id: "highlight",
    name: "Highlight PDF",
    description: "Highlight important text passages in translucent colors.",
    category: "Edit PDF",
    categoryId: "edit",
    route: "/highlight",
    icon: "Highlighter",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: false,
    options: []
  },

  // SECURITY
  {
    id: "protect-pdf",
    name: "Protect PDF",
    description: "Encrypt your PDF document with a secure password to prevent unauthorized access.",
    category: "Security",
    categoryId: "security",
    route: "/protect-pdf",
    icon: "Lock",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: true,
    badge: "SECURE",
    options: [
      { id: "userPassword", label: "Password", type: "password", defaultValue: "" }
    ]
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove security password and restrictions from protected PDF files.",
    category: "Security",
    categoryId: "security",
    route: "/unlock-pdf",
    icon: "Unlock",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: [
      { id: "password", label: "Current PDF Password (if known)", type: "password", defaultValue: "" }
    ]
  },

  // OTHER TOOLS
  {
    id: "watermark",
    name: "Watermark PDF",
    description: "Add an elegant custom text watermark across every page of your PDF.",
    category: "Other Tools",
    categoryId: "other",
    route: "/watermark",
    icon: "Stamp",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: true,
    options: [
      { id: "watermarkText", label: "Watermark Text", type: "text", defaultValue: "CONFIDENTIAL" },
      { id: "fontSize", label: "Font Size (pt)", type: "number", defaultValue: "48" },
      { id: "opacity", label: "Opacity (0.1 - 1.0)", type: "text", defaultValue: "0.3" }
    ]
  },
  {
    id: "page-numbers",
    name: "Page Numbers",
    description: "Add dynamic page numbers (Page 1 of N) to headers or footers.",
    category: "Other Tools",
    categoryId: "other",
    route: "/page-numbers",
    icon: "Hash",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: [
      { 
        id: "position", 
        label: "Number Position", 
        type: "select", 
        defaultValue: "bottom-center",
        selectOptions: [
          { label: "Bottom Right", value: "bottom-right" },
          { label: "Bottom Center", value: "bottom-center" },
          { label: "Top Right", value: "top-right" }
        ] 
      }
    ]
  },
  {
    id: "metadata",
    name: "PDF Metadata",
    description: "View and edit Title, Author, Subject, and Keywords in your PDF document.",
    category: "Other Tools",
    categoryId: "other",
    route: "/metadata",
    icon: "Info",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "available",
    popular: false,
    options: [
      { id: "title", label: "Document Title", type: "text", defaultValue: "CYBERPOINTAK Document" },
      { id: "author", label: "Author Name", type: "text", defaultValue: "CYBERPOINTAK User" }
    ]
  },
  {
    id: "ocr",
    name: "OCR PDF",
    description: "Recognize scanned text inside PDF images and make document searchable.",
    category: "Other Tools",
    categoryId: "other",
    route: "/ocr",
    icon: "ScanText",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: false,
    options: []
  },
  {
    id: "crop-pdf",
    name: "Crop PDF",
    description: "Crop margins or specific areas of PDF pages visually.",
    category: "Other Tools",
    categoryId: "other",
    route: "/crop-pdf",
    icon: "Crop",
    supportedFormats: [".pdf"],
    acceptMultiple: false,
    status: "coming-soon",
    popular: false,
    options: []
  }
];
