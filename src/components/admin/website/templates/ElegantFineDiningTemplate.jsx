import React from 'react';

const ElegantFineDiningTemplate = ({ mode = 'card', restaurantName = 'JanakiCafe', settings = {} }) => {
  if (mode === 'mobile') {
    return (
      <div className="template-mobile template-fine-mobile">
        <div className="template-mobile-header">
          <strong>{restaurantName}</strong>
          <span>⋮</span>
        </div>
        <div className="template-mobile-hero fine">
          <div>
            <h4>Private Dining</h4>
            <p>{settings.bio || 'Elegant storytelling with wine pairings and reservation-first sections.'}</p>
          </div>
        </div>
        <div className="template-article-card">
          <span>Chef Tasting Menu</span>
          <strong>8 Courses</strong>
        </div>
        <div className="template-article-grid">
          <div className="template-article-mini" />
          <div className="template-article-mini muted" />
        </div>
        <div className="template-reservation-strip">Reserve a table for tonight</div>
      </div>
    );
  }

  return (
    <div className="template-card-preview fine">
      <div className="template-card-hero">
        <div className="template-preview-badge">Signature</div>
        <div className="template-card-copy">
          <strong>Elegant Fine Dining</strong>
          <span>Refined editorial layout and reservations</span>
          <button type="button">Reserve</button>
        </div>
      </div>
      <div className="template-card-footer split">
        <div className="template-line medium" />
        <div className="template-line short" />
      </div>
    </div>
  );
};

ElegantFineDiningTemplate.template = {
  id: 'elegant-fine-dining',
  name: 'Elegant Fine Dining',
  subtitle: 'Editorial sections for premium dining',
  palette: 'dark'
};

export default ElegantFineDiningTemplate;
