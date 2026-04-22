import React from 'react';

const ClassicEateryTemplate = ({ mode = 'card', restaurantName = 'JanakiCafe', settings = {} }) => {
  if (mode === 'mobile') {
    return (
      <div className="template-mobile template-classic-mobile">
        <div className="template-mobile-header">
          <strong>{restaurantName}</strong>
          <span>☷</span>
        </div>
        <div className="template-mobile-hero classic">
          <div>
            <h4>Welcome In</h4>
            <p>{settings.bio || 'Balanced neutral palette, familiar menu blocks, and reliable readability.'}</p>
          </div>
        </div>
        <div className="template-classic-list">
          <div className="template-classic-row"><span>House Specials</span><strong>4</strong></div>
          <div className="template-classic-row"><span>Family Combos</span><strong>2</strong></div>
          <div className="template-classic-row"><span>Opening Hours</span><strong>9AM</strong></div>
        </div>
      </div>
    );
  }

  return (
    <div className="template-card-preview classic">
      <div className="template-card-hero">
        <div className="template-preview-badge">Timeless</div>
        <div className="template-card-copy">
          <strong>Classic Eatery</strong>
          <span>Traditional menu-first landing page</span>
          <button type="button">Browse</button>
        </div>
      </div>
      <div className="template-card-footer stacked">
        <div className="template-line long" />
        <div className="template-line medium" />
        <div className="template-line short" />
      </div>
    </div>
  );
};

ClassicEateryTemplate.template = {
  id: 'classic-eatery',
  name: 'Classic Eatery',
  subtitle: 'Comfortable layout with menu-first flow',
  palette: 'rustic'
};

export default ClassicEateryTemplate;
