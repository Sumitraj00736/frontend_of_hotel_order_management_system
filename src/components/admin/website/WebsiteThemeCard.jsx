import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';

const WebsiteThemeCard = ({ 
  selectedTemplateId, 
  onSelectTemplate, 
  colorPalette, 
  onColorPaletteChange 
}) => {
  // Templates Data
  const templatesData = [
    {
      id: 'modern-bistro',
      name: 'Modern Bistro',
      subtitle: 'Moody hero with spotlight dishes.',
      previewImg:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
      liveUrl:
        'http://localhost:5173/admin/website/templates/modernbistro'
    },
    {
      id: 'elegant-fine-dining',
      name: 'Elegant Fine Dining',
      subtitle: 'Sophisticated layout for upscale restaurants.',
      previewImg:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80',
      liveUrl:
        'http://localhost:5173/admin/website/templates/ElegantFineDiningTemplate'
    },
    {
      id: 'vibrant-cafe',
      name: 'Vibrant Cafe',
      subtitle: 'Bright and colorful for casual eateries.',
      previewImg:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80',
      liveUrl:
        'http://localhost:5173/admin/website/templates/VibrantCafeTemplate'
    },
    {
      id: 'classic-eatery',
      name: 'Classic Eatery',
      subtitle: 'Timeless design with a warm feel.',
      previewImg:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
      liveUrl:
        'http://localhost:5173/admin/website/templates/ClassicEateryTemplate'
    }
  ];

  // Palette Options
  const paletteOptions = [
    { value: 'red', label: 'Red', color: '#fc8019' },
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'green', label: 'Green', color: '#22c55e' },
    { value: 'purple', label: 'Purple', color: '#a855f7' }
  ];

  // Handlers
  const handlePreview = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="web-theme-grid">
      {templatesData.map((template) => {
        const selected = selectedTemplateId === template.id;

        return (
          <div
            key={template.id}
            className={`web-theme-card ${selected ? 'selected' : ''}`}
          >
            {/* Preview */}
            <div className="web-theme-preview-shell">
              <img
                src={template.previewImg}
                alt={template.name}
                className="web-theme-preview-img"
              />

              <div className="web-theme-overlay">
                <button
                  type="button"
                  className="web-overlay-preview"
                  onClick={() => handlePreview(template.liveUrl)}
                >
                  <ExternalLink size={18} /> Preview Live
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="web-theme-card-body">
              {/* Title */}
              <div className="web-theme-info">
                <div className="web-theme-card-title">
                  {template.name}
                </div>
                <div className="web-theme-card-subtitle">
                  {template.subtitle}
                </div>
              </div>

              {/* Palette */}
              <div className="web-theme-palette-wrapper">
                <span>Theme Tint:</span>
                <div className="web-theme-palette-row">
                  {paletteOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`web-palette-chip ${
                        colorPalette === option.value ? 'active' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onColorPaletteChange?.(option.value);
                      }}
                      title={option.label}
                      style={{ backgroundColor: option.color }}
                    />
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="web-theme-actions">
                <button
                  type="button"
                  className={`web-theme-select-button ${
                    selected ? 'is-selected' : ''
                  }`}
                  onClick={() => onSelectTemplate?.(template.id)}
                >
                  {selected ? (
                    <>
                      <CheckCircle size={16} /> Selected
                    </>
                  ) : (
                    'Apply Template'
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WebsiteThemeCard;