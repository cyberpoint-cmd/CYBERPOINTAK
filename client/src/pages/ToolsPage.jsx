import React, { useState } from 'react';
import { ToolSearch } from '../components/ToolSearch';
import { CategoriesNav } from '../components/CategoriesNav';
import { ToolCard } from '../components/ToolCard';
import { ComingSoonModal } from '../components/ComingSoonModal';
import { EmptyState } from '../components/EmptyState';
import { TOOLS_LIST } from '../data/toolsData';
import { Grid, Sparkles } from 'lucide-react';

export const ToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedComingSoon, setSelectedComingSoon] = useState(null);

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesCategory =
      activeCategory === 'all' || tool.categoryId === activeCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
          <Grid size={14} style={{ marginRight: 6 }} />
          ALL PDF TOOLS
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Complete PDF Utility Suite
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Select any tool below to process your PDF files safely with fast local execution.
        </p>
      </div>

      <ToolSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CategoriesNav
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Showing <strong>{filteredTools.length}</strong> of {TOOLS_LIST.length} PDF tools
      </div>

      {filteredTools.length > 0 ? (
        <div className="tool-grid">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelectComingSoon={setSelectedComingSoon}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="search"
          title="No matching tools"
          message={`No PDF tools match "${searchQuery}". Please search for a different tool.`}
          onAction={() => {
            setSearchQuery('');
            setActiveCategory('all');
          }}
          actionLabel="Reset Search"
        />
      )}

      {selectedComingSoon && (
        <ComingSoonModal
          tool={selectedComingSoon}
          onClose={() => setSelectedComingSoon(null)}
        />
      )}
    </div>
  );
};
