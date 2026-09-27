import React from 'react';
import { Zap, ShieldCheck, Smile, Sparkles } from 'lucide-react';

export const TrustSection = () => {
  const cards = [
    {
      icon: <Zap size={28} className="text-primary" />,
      title: "Lightning Fast",
      desc: "Optimized processing algorithms convert and edit your PDF files in seconds with zero delay."
    },
    {
      icon: <ShieldCheck size={28} style={{ color: '#10B981' }} />,
      title: "Privacy First & Secure",
      desc: "Your files are processed safely in your browser or temp memory, and never stored permanently."
    },
    {
      icon: <Smile size={28} style={{ color: '#F59E0B' }} />,
      title: "Simple & Intuitive",
      desc: "Clean user interface without clutter. Drag, drop, process, and download in 2 clicks."
    },
    {
      icon: <Sparkles size={28} style={{ color: '#8B5CF6' }} />,
      title: "100% Free to Use",
      desc: "No hidden subscriptions, no credit cards required, and no limits on essential everyday PDF tools."
    }
  ];

  return (
    <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>WHY CHOOSE CYBERPOINTAK</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
            Simple PDF tools for everyday work.
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Built for professionals, students, and businesses who need fast and reliable document processing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {cards.map((item, idx) => (
            <div key={idx} className="card-panel" style={{ padding: '1.75rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
