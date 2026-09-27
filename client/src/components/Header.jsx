import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Search, Moon, Sun, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SITE_CONFIG } from '../data/config';

export const Header = ({ onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-box">
            <FileText size={22} strokeWidth={2.5} />
          </div>
          <span className="brand-cyber">
            CYBER<span className="brand-pointak">POINTAK</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/tools" className={`nav-link ${isActive('/tools') ? 'active' : ''}`}>
            PDF Tools
          </Link>
          <Link to="/merge-pdf" className={`nav-link ${isActive('/merge-pdf') ? 'active' : ''}`}>
            Merge
          </Link>
          <Link to="/compress-pdf" className={`nav-link ${isActive('/compress-pdf') ? 'active' : ''}`}>
            Compress
          </Link>
          <Link to="/split-pdf" className={`nav-link ${isActive('/split-pdf') ? 'active' : ''}`}>
            Split
          </Link>
          <Link to="/jpg-to-pdf" className={`nav-link ${isActive('/jpg-to-pdf') ? 'active' : ''}`}>
            JPG to PDF
          </Link>
        </nav>

        {/* Right Header Actions */}
        <div className="header-actions">
          {/* Quick Search */}
          <button 
            className="icon-btn" 
            onClick={onOpenSearch} 
            title="Search PDF Tools"
            aria-label="Search PDF Tools"
          >
            <Search size={19} />
          </button>

          {/* Theme Toggle */}
          <button 
            className="icon-btn" 
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={19} className="text-warning" /> : <Moon size={19} />}
          </button>

          {/* Get Started Button */}
          <Link to="/tools" className="btn btn-primary btn-sm desktop-only-btn">
            <span>Explore Tools</span>
            <ArrowRight size={16} />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="icon-btn mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/tools" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            All PDF Tools
          </Link>
          <Link to="/merge-pdf" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Merge PDF
          </Link>
          <Link to="/split-pdf" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Split PDF
          </Link>
          <Link to="/compress-pdf" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Compress PDF
          </Link>
          <Link to="/jpg-to-pdf" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            JPG to PDF
          </Link>
          <Link to="/pdf-to-jpg" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            PDF to JPG
          </Link>
          
          <div style={{ paddingTop: '0.5rem' }}>
            <Link to="/tools" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
              Explore All 20+ Tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
