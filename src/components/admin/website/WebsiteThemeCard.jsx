import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';

const WebsiteThemeCard = ({ 
  title, 
  subtitle, 
  selected, 
  onPreview, 
  onSelect, 
  colorPalette, 
  onColorChange, 
  children 
}) => {
  const paletteOptions = [
    { value: 'light', label: 'Sunlit Cream', color: '#fdfbf7' },
    { value: 'dark', label: 'Midnight Luxe', color: '#1a1a1a' },
    { value: 'rustic', label: 'Classic Roast', color: '#4a3728' },
    { value: 'green', label: 'Fresh Garden', color: '#2d4c3e' }
  ];

  return (
    <div className={`web-theme-card ${selected ? 'selected' : ''}`}>
      {/* Visual Preview Area */}
      <div className="web-theme-preview-shell">
        {children}
        <div className="web-theme-overlay">
           <button type="button" className="web-overlay-preview" onClick={onPreview}>
             <ExternalLink size={18} /> Preview Live
           </button>
        </div>
      </div>

      <div className="web-theme-card-body">
        <div className="web-theme-info">
          <div className="web-theme-card-title">{title}</div>
          <div className="web-theme-card-subtitle">{subtitle}</div>
        </div>

        {/* Color Palette Selector */}
        <div className="web-theme-palette-wrapper">
          <span>Theme Tint:</span>
          <div className="web-theme-palette-row">
            {paletteOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`web-palette-chip ${colorPalette === option.value ? 'active' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onColorChange(option.value);
                }}
                title={option.label}
                style={{ backgroundColor: option.color }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="web-theme-actions">
          <button 
            type="button" 
            className={`web-theme-select-button ${selected ? 'is-selected' : ''}`} 
            onClick={onSelect}
          >
            {selected ? (
              <><CheckCircle size={16} /> Selected</>
            ) : (
              'Apply Template'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteThemeCard;