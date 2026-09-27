import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info Column */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo" style={{ marginBottom: '1rem' }}>
              <div className="logo-icon-box">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <span className="brand-cyber">
                CYBER<span className="brand-pointak">POINTAK</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', maxWidth: '300px' }}>
              {SITE_CONFIG.TAGLINE}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} className="text-success" />
              <span>Safe local processing & privacy prioritized</span>
            </div>
          </div>

          {/* Column 1: PDF Tools */}
          <div>
            <h4 className="footer-col-title">PDF Tools</h4>
            <ul className="footer-links">
              <li><Link to="/tools" className="footer-link">All PDF Tools</Link></li>
              <li><Link to="/merge-pdf" className="footer-link">Merge PDF</Link></li>
              <li><Link to="/split-pdf" className="footer-link">Split PDF</Link></li>
              <li><Link to="/compress-pdf" className="footer-link">Compress PDF</Link></li>
              <li><Link to="/rotate-pdf" className="footer-link">Rotate PDF</Link></li>
              <li><Link to="/jpg-to-pdf" className="footer-link">JPG to PDF</Link></li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/tools" className="footer-link">Explore Ecosystem</Link></li>
              <li><a href={`mailto:${SITE_CONFIG.SUPPORT_EMAIL}`} className="footer-link">Contact Support</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Security */}
          <div>
            <h4 className="footer-col-title">Legal & Help</h4>
            <ul className="footer-links">
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/security" className="footer-link">Security Overview</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © 2026 CYBERPOINTAK. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built with precision for fast PDF workflows</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
