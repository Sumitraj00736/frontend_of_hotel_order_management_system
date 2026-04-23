import React from 'react';

const VibrantCafeTemplate = ({ mode = 'card', restaurantName = 'JanakiCafe', settings = {} }) => {
  if (mode === 'mobile') {
    return (
      <div className="template-mobile template-vibrant-mobile">
        <div className="template-mobile-header">
          <strong>{restaurantName}</strong>
          <span>☰</span>
        </div>
        <div className="template-mobile-hero vibrant">
          <div>
            <h4>Daily Brew & Brunch</h4>
            <p>{settings.bio || 'Bright palette, layered cards, and upbeat cafe storytelling.'}</p>
          </div>
        </div>
        <div className="template-color-grid">
          <div className="template-color-tile yellow" />
          <div className="template-color-tile teal" />
          <div className="template-color-tile orange" />
        </div>
        <div className="template-menu-pill-row">
          <span>Breakfast</span>
          <span>Coffee</span>
          <span>Dessert</span>
        </div>
      </div>
    );
  }

  return (
    <div className="template-card-preview vibrant">
      <div className="template-card-hero">
        <div className="template-preview-badge">Popular</div>
        <div className="template-card-copy">
          <strong>Vibrant Cafe</strong>
          <span>Fresh colors and playful category blocks</span>
          <button type="button">Launch</button>
        </div>
      </div>
      <div className="template-card-footer color-blocks">
        <div className="template-swatch yellow" />
        <div className="template-swatch green" />
        <div className="template-swatch orange" />
      </div>
    </div>
  );
};

VibrantCafeTemplate.template = {
  id: 'vibrant-cafe',
  name: 'Vibrant Cafe',
  subtitle: 'Playful cards with bold color blocking',
  palette: 'green'
};

export default VibrantCafeTemplate;
