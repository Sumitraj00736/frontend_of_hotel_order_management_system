import React from 'react';

const sampleItems = [
  ['Sample Hero', '$1.50'],
  ['Chicken Menu', '$1.50'],
  ['Chichili Menu', '$1.50'],
  ['Momo Platter', '$3.00']
];

const ModernBistroTemplate = ({ mode = 'card', restaurantName = 'JanakiCafe', settings = {} }) => {
  if (mode === 'mobile') {
    return (
      <div className="template-mobile template-modern-mobile">
        <div className="template-mobile-header">
          <strong>{restaurantName}</strong>
          <span>≡</span>
        </div>
        <div className="template-mobile-hero modern">
          <div>
            <h4>Sample Hero</h4>
            <p>{settings.bio || 'Create moody, food-forward landing pages with strong hero imagery.'}</p>
            <button type="button">Use Menu</button>
          </div>
        </div>
        <div className="template-mobile-section">
          <div className="template-mobile-section-title">Menu</div>
          <div className="template-mobile-menu">
            {sampleItems.map(([label, price]) => (
              <div key={label} className="template-mobile-menu-row">
                <span>{label}</span>
                <strong>{price}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="template-mobile-contact">
          <div>
            <strong>Contact Us</strong>
            <span>{settings.phone || '+977 2356 7789'}</span>
            <span>{settings.address || 'JanakiCafe'}</span>
          </div>
          <div className="template-map-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="template-card-preview modern">
      <div className="template-card-hero">
        <div className="template-preview-badge">Featured</div>
        <div className="template-card-copy">
          <strong>Modern Bistro</strong>
          <span>Moody hero with spotlight dishes</span>
          <button type="button">Explore</button>
        </div>
      </div>
      <div className="template-card-footer">
        <div className="template-line long" />
        <div className="template-line short" />
      </div>
    </div>
  );
};

ModernBistroTemplate.template = {
  id: 'modern-bistro',
  name: 'Modern Bistro',
  subtitle: 'Moody hero with featured dishes',
  palette: 'light'
};

export default ModernBistroTemplate;
