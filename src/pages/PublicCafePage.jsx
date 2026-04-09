import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import '../common/css/public/cafePublic.css';

const PALETTES = {
  light:  { bg: '#fff6f1', accent: '#e53a2d', card: '#ffffff', text: '#1f2933', muted: '#667085' },
  dark:   { bg: '#0f172a', accent: '#f97316', card: '#1e293b', text: '#f1f5f9', muted: '#94a3b8' },
  rustic: { bg: '#fdf6ec', accent: '#92400e', card: '#fffbf5', text: '#292524', muted: '#78716c' },
  green:  { bg: '#f0fdf4', accent: '#15803d', card: '#ffffff', text: '#14532d', muted: '#4b7a5a' }
};

const PublicCafePage = () => {
  const { cafeSlug, tableId } = useParams();
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get('branchId');
  const navigate = useNavigate();

  const [state, setState] = useState({ loading: true, error: '', cafe: null });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/public/cafes/${cafeSlug}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Cafe not found');
        }
        const data = await res.json();
        if (active) setState({ loading: false, error: '', cafe: data });
      } catch (error) {
        if (active) setState({ loading: false, error: error.message || 'Cafe not found', cafe: null });
      }
    };
    load();
    return () => { active = false; };
  }, [cafeSlug]);

  if (state.loading) {
    return (
      <div className="pub-shell pub-loading">
        <div className="pub-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="pub-shell">
        <div className="pub-error-card">
          <div className="pub-error-icon">🍽️</div>
          <h2>Not Found</h2>
          <p>{state.error}</p>
        </div>
      </div>
    );
  }

  const cafe = state.cafe;
  const ws   = cafe.websiteSettings || {};
  const pal  = PALETTES[ws.colorPalette] || PALETTES.light;
  const name = cafe.branch?.name || cafe.name || cafeSlug;
  const initials = name.slice(0, 2).toUpperCase();

  // Build menu / order URL
  const menuParams = new URLSearchParams();
  if (branchId) menuParams.set('branchId', branchId);
  const menuUrl = tableId ? `/guest/${tableId}?${menuParams}` : null;

  const cssVars = {
    '--pub-bg':     pal.bg,
    '--pub-accent': pal.accent,
    '--pub-card':   pal.card,
    '--pub-text':   pal.text,
    '--pub-muted':  pal.muted
  };

  return (
    <div className="pub-shell" style={cssVars}>
      {/* Header */}
      <header className="pub-header">
        <div className="pub-brand">merorestro</div>
        {tableId && (
          <div className="pub-table-pill">
            🪑 Table {searchParams.get('table') || '—'}
          </div>
        )}
      </header>

      <main className="pub-main">
        {/* Hero Card */}
        <div className="pub-hero">
          {ws.logoUrl
            ? <img src={ws.logoUrl} alt={name} className="pub-logo-img" />
            : <div className="pub-avatar">{initials}</div>
          }
          <h1 className="pub-name">{name}</h1>
          {ws.bio && <p className="pub-bio">{ws.bio}</p>}
        </div>

        {/* Services */}
        <div className="pub-section">
          <div className="pub-section-label">OUR SERVICES</div>
          <div className="pub-service-grid">
            {ws.shareMenu !== false && (
              <button
                className="pub-service-card"
                onClick={() => menuUrl ? navigate(menuUrl) : null}
                disabled={!menuUrl}
                title={!menuUrl ? 'Scan a table QR to order' : ''}
              >
                <span className="pub-service-icon">🍽️</span>
                <span>Menu {tableId ? '& Order' : ''}</span>
                {!tableId && <span className="pub-service-hint">Scan table QR to order</span>}
              </button>
            )}
            {ws.delivery && (
              <button className="pub-service-card">
                <span className="pub-service-icon">🛵</span>
                <span>Delivery</span>
              </button>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="pub-section">
          <div className="pub-section-label">STAY CONNECTED</div>
          <div className="pub-contact-grid">
            {ws.showPhone && (
              <div className="pub-contact-card">
                <span>📞</span> Call Us
              </div>
            )}
            {ws.address && (
              <div className="pub-contact-card">
                <span>📍</span>
                <span className="pub-address">{ws.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        {ws.socialLinks?.length > 0 && (
          <div className="pub-section">
            <div className="pub-section-label">FOLLOW US</div>
            <div className="pub-social-row">
              {ws.socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="pub-social-chip">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="pub-footer">
        {ws.footer || `© ${new Date().getFullYear()} ${name} · Powered by merorestro`}
      </footer>
    </div>
  );
};

export default PublicCafePage;
