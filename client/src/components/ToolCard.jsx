import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export const ToolCard = ({ tool, onSelectComingSoon }) => {
  // Dynamically resolve icon from lucide-react
  const IconComponent = Icons[tool.icon] || Icons.FileText;

  const handleClick = (e) => {
    if (tool.status === 'coming-soon') {
      e.preventDefault();
      onSelectComingSoon(tool);
    }
  };

  return (
    <Link to={tool.route} onClick={handleClick} className="tool-card">
      <div>
        <div className="tool-card-header">
          <div className="tool-card-icon">
            <IconComponent size={26} strokeWidth={2} />
          </div>

          {tool.badge && (
            <span className={`badge ${tool.badge === 'POPULAR' ? 'badge-primary' : tool.badge === 'SECURE' ? 'badge-success' : 'badge-warning'}`}>
              {tool.badge}
            </span>
          )}

          {tool.status === 'coming-soon' && (
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
              COMING SOON
            </span>
          )}
        </div>

        <h3 className="tool-card-title">{tool.name}</h3>
        <p className="tool-card-desc">{tool.description}</p>
      </div>

      <div className="tool-card-footer">
        <span>{tool.status === 'coming-soon' ? 'Learn More' : 'Open Tool'}</span>
        <Icons.ArrowRight size={18} className="tool-card-arrow" />
      </div>
    </Link>
  );
};
