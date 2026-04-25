import React from 'react';

const sampleItems = [
  ['Sample Hero', '$1.50'],
  ['Chicken Menu', '$1.50'],
  ['Chichili Menu', '$1.50'],
  ['Momo Platter', '$3.00']
];

const ModernBistroTemplate = ({ mode = 'card', restaurantName = 'JanakiCafe', settings = {} }) => {
  
  // LIVE SITE / MOBILE PREVIEW MODE
  if (mode === 'mobile' || mode === 'live') {
    return (
      <div className={`template-modern-container palette-${settings.colorPalette || 'light'}`}>
        
        {/* RESPONSIVE NAVBAR */}
        <nav className="template-nav">
          <div className="nav-logo">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="logo" />
            ) : (
              <span className="logo-text">{restaurantName.charAt(0)}</span>
            )}
          </div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#menu">Menu</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-menu-toggle">≡</div>
        </nav>

        {/* HERO SECTION */}
        <header className="template-hero">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>{restaurantName}</h1>
              <p>{settings.bio || 'Experience the art of modern dining with locally sourced ingredients.'}</p>
              <div className="hero-btns">
                <button className="btn-primary">View Menu</button>
                <button className="btn-outline">Book Table</button>
              </div>
            </div>
          </div>
        </header>

        {/* ABOUT SECTION */}
        <section id="about" className="template-section section-about">
          <div className="section-container">
            <div className="text-block">
              <span className="kicker">Our Story</span>
              <h2>A Culinary Journey</h2>
              <p>
                Founded on a passion for flavor, we bring together traditional recipes 
                and modern bistro techniques to create an unforgettable experience.
              </p>
            </div>
            <div className="image-placeholder-square" />
          </div>
        </section>

        {/* MENU SECTION */}
        <section id="menu" className="template-section section-menu">
          <div className="section-container">
            <div className="section-header">
              <h2>Signature Dishes</h2>
              <div className="divider" />
            </div>
            <div className="menu-grid">
              {sampleItems.map(([label, price]) => (
                <div key={label} className="menu-item">
                  <div className="menu-item-info">
                    <strong>{label}</strong>
                    <p>Chef's special preparation</p>
                  </div>
                  <div className="menu-item-price">{price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="template-section section-contact">
          <div className="section-container">
            <div className="contact-grid">
              <div className="contact-info">
                <h2>Visit Us</h2>
                <div className="info-row">
                  <strong>Location</strong>
                  <p>{settings.address || '123 Bistro Lane, Kathmandu'}</p>
                </div>
                <div className="info-row">
                  <strong>Contact</strong>
                  <p>{settings.phone || '+977 2356 7789'}</p>
                </div>
              </div>
              <div className="template-map-card" />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="template-footer">
          <p>{settings.footer || `© ${new Date().getFullYear()} ${restaurantName}`}</p>
        </footer>
      </div>
    );
  }

  // DASHBOARD CARD PREVIEW MODE
  return (
    <div className="template-card-preview modern">
      <div className="template-card-hero">
        <div className="template-preview-badge">Featured</div>
        <div className="template-card-copy">
          <strong>Modern Bistro</strong>
          <span>Moody hero with spotlight dishes</span>
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
  subtitle: 'Full responsive page with navigation',
  palette: 'light'
};

export default ModernBistroTemplate;