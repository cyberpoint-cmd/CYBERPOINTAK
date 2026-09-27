import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, FileCheck, Layers } from 'lucide-react';

export const Hero = ({ onExploreClick }) => {
  return (
    <section className="hero-section container">
      {/* Left Content */}
      <div className="hero-content">
        <div className="hero-badge-wrapper">
          <span className="badge badge-primary">
            <Sparkles size={14} style={{ marginRight: '6px' }} />
            FREE PDF TOOLS
          </span>
        </div>

        <h1 className="hero-title">
          Everything You Need <br />
          <span className="hero-title-highlight">to Work With PDFs.</span>
        </h1>

        <p className="hero-subtitle">
          Edit, convert, compress, merge and manage your PDF files with simple, lightning-fast online tools.
        </p>

        <div className="hero-actions">
          <button onClick={onExploreClick} className="btn btn-primary btn-lg">
            <span>Explore PDF Tools</span>
            <ArrowRight size={18} />
          </button>

          <Link to="/tools" className="btn btn-secondary btn-lg">
            <span>All Tools</span>
          </Link>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} className="text-primary" />
            <span>Instant Processing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} className="text-success" />
            <span>No Account Required</span>
          </div>
        </div>
      </div>

      {/* Right Visual Animation */}
      <div className="hero-visual">
        <div className="hero-graphic-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', width: '100%', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CYBERPOINTAK ENGINE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                <FileCheck size={20} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ width: '60%', height: 10, background: 'var(--text-primary)', opacity: 0.8, borderRadius: 4, marginBottom: 4 }}></div>
                <div style={{ width: '40%', height: 8, background: 'var(--text-muted)', opacity: 0.5, borderRadius: 4 }}></div>
              </div>
            </div>

            <div style={{ width: '100%', height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #2563EB, #60A5FA)', animation: 'pulseGlow 2s infinite' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '0.5rem' }}>
            <span>Status: Ready</span>
            <span className="badge badge-success">Local & Free</span>
          </div>

          {/* Floating Chips */}
          <div className="floating-element float-top">
            <Layers size={18} className="text-primary" />
            <span>Merge & Split</span>
          </div>

          <div className="floating-element float-bottom">
            <Zap size={18} style={{ color: '#F59E0B' }} />
            <span>Fast Compression</span>
          </div>
        </div>
      </div>
    </section>
  );
};
