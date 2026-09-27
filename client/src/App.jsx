import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { ToolViewPage } from './pages/ToolViewPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ComingSoonModal } from './components/ComingSoonModal';
import { TOOLS_LIST } from './data/toolsData';

export default function App() {
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  return (
    <ThemeProvider>
      <HistoryProvider>
        <Router>
          <Header onOpenSearch={() => window.scrollTo({ top: 400, behavior: 'smooth' })} />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<AboutPage />} />
              <Route path="/terms" element={<AboutPage />} />
              <Route path="/security" element={<AboutPage />} />
              <Route path="/:toolRoute" element={<ToolViewPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </HistoryProvider>
    </ThemeProvider>
  );
}
