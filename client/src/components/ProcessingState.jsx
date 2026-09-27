import React, { useEffect, useState } from 'react';
import { Loader2, FileCheck, Cpu, Download } from 'lucide-react';

const STAGES = [
  "Uploading your files safely...",
  "Reading PDF structure...",
  "Processing document transformations...",
  "Creating output document...",
  "Preparing instant download..."
];

export const ProcessingState = ({ stageIndex = 0 }) => {
  const [currentStage, setCurrentStage] = useState(stageIndex);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(prev => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="state-container animate-fade-in">
      <Loader2 size={56} className="spinner-icon animate-spin" style={{ margin: '0 auto 1.5rem auto' }} />

      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Processing Your PDF...
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
        {STAGES[currentStage]}
      </p>

      <div style={{ width: '100%', height: 8, background: 'var(--bg-subtle)', borderRadius: 4, overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${((currentStage + 1) / STAGES.length) * 100}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
            transition: 'width 400ms ease'
          }} 
        />
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        Please keep this window open while processing completing locally.
      </div>
    </div>
  );
};
