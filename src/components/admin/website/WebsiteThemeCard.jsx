import React from 'react';

const WebsiteThemeCard = ({ title, subtitle, selected, onSelect, children }) => (
  <div className={`web-theme-card ${selected ? 'selected' : ''}`}>
    <div className="web-theme-preview-shell">{children}</div>
    <div className="web-theme-card-body">
      <div>
        <div className="web-theme-card-title">{title}</div>
        <div className="web-theme-card-subtitle">{subtitle}</div>
      </div>
      <button type="button" className="web-theme-select-button" onClick={onSelect}>
        {selected ? 'Selected Theme' : 'Use Theme'}
      </button>
    </div>
  </div>
);

export default WebsiteThemeCard;
