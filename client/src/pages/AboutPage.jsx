import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Heart, FileText, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';

export const AboutPage = () => {
  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', maxWidth: '840px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>ABOUT CYBERPOINTAK</span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Powerful PDF Tools. Simple & Free.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          We believe document tools should be instant, secure, accessible, and free of tedious signups or paywalls.
        </p>
      </div>

      <div className="card-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Our Mission</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          <strong>CYBERPOINTAK</strong> was architected to empower individuals, professionals, and teams to handle document operations quickly and privately directly on their PCs without sacrificing quality or security.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          By prioritizing local client-side processing alongside optimized server engines, your files remain confidential and protected.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card-panel" style={{ padding: '1.5rem' }}>
          <ShieldCheck size={32} className="text-success" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Privacy Prioritized</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Files are held in temporary memory during processing and automatically purged immediately afterwards.
          </p>
        </div>

        <div className="card-panel" style={{ padding: '1.5rem' }}>
          <Zap size={32} className="text-primary" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lightning Performance</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Built using modern WebAssembly and stream-optimized PDF engines for instantaneous results.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/tools" className="btn btn-primary btn-lg">
          Explore All PDF Tools
        </Link>
      </div>
    </div>
  );
};
