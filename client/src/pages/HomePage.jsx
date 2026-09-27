import React, { useState, useRef } from 'react';
import { Hero } from '../components/Hero';
import { ToolSearch } from '../components/ToolSearch';
import { CategoriesNav } from '../components/CategoriesNav';
import { ToolCard } from '../components/ToolCard';
import { TrustSection } from '../components/TrustSection';
import { RecentFilesSection } from '../components/RecentFilesSection';
import { ComingSoonModal } from '../components/ComingSoonModal';
import { EmptyState } from '../components/EmptyState';
import { TOOLS_LIST } from '../data/toolsData';

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedComingSoon, setSelectedComingSoon] = useState(null);
  const searchInputRef = useRef(null);
  const toolsSectionRef = useRef(null);

  const scrollToTools = () => {
    if (toolsSectionRef.current) {
      toolsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Filter tools based on search query and category
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
    <div>
      {/* Hero Section */}
      <Hero onExploreClick={scrollToTools} />

      {/* Main Tools Container */}
      <div ref={toolsSectionRef} className="container" style={{ paddingBottom: '4rem' }}>
        {/* Real-time Search Box */}
        <ToolSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inputRef={searchInputRef}
        />

        {/* Categories Bar */}
        <CategoriesNav
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Tools Counter & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div>
            Showing <strong>{filteredTools.length}</strong> PDF tools
            {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
          </div>
          {(searchQuery || activeCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Tools Grid */}
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
            title="No tools found"
            message={`We couldn't find any tool matching "${searchQuery}". Try searching for 'merge', 'split', 'compress', or 'rotate'.`}
            onAction={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            actionLabel="View All Tools"
          />
        )}
      </div>

      {/* Local History Section */}
      <RecentFilesSection />

      {/* Trust & Features Section */}
      <TrustSection />

      {/* Coming Soon Modal */}
      {selectedComingSoon && (
        <ComingSoonModal
          tool={selectedComingSoon}
          onClose={() => setSelectedComingSoon(null)}
        />
      )}
    </div>
  );
};
