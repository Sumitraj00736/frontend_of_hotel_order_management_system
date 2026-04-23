import React, { useEffect, useMemo, useState, useCallback } from 'react';
import '../../../common/css/admin/website/website.css';
import '../../../common/css/admin/website/templates.css';
import { getBranches, getBranchId } from '../../../api/session.js';
import {
  CheckCircle,
  Copy,
  ExternalLink,
  ImagePlus,
  MapPin,
  Palette,
  Phone,
  QrCode,
  Save,
  UploadCloud
} from 'lucide-react';
import api from '../../../api/client.js';
import WebsiteThemeCard from './WebsiteThemeCard.jsx';
import WebsitePhonePreview from './WebsitePhonePreview.jsx';
import ModernBistroTemplate from './templates/ModernBistroTemplate.jsx';
import ElegantFineDiningTemplate from './templates/ElegantFineDiningTemplate.jsx';
import VibrantCafeTemplate from './templates/VibrantCafeTemplate.jsx';
import ClassicEateryTemplate from './templates/ClassicEateryTemplate.jsx';

const WEBSITE_TEMPLATES = [
  ModernBistroTemplate,
  ElegantFineDiningTemplate,
  VibrantCafeTemplate,
  ClassicEateryTemplate
];

const tabs = [
  { id: 'builder', label: 'View QR Code', icon: QrCode },
  { id: 'images', label: 'Menu Images', icon: ImagePlus },
  { id: 'appearance', label: 'Appearance', icon: Palette }
];

const DEFAULT_SETTINGS = {
  delivery: true,
  shareMenu: true,
  takeaway: true,
  reservations: true,
  contactUs: true,
  aboutUs: true,
  gallery: true,
  reviews: true,
  showPhone: true,
  address: '',
  phone: '',
  bio: '',
  footer: '',
  logoUrl: '',
  colorPalette: 'light',
  layout: 'grid',
  socialLinks: [],
  template: 'modern-bistro',
  contactMode: 'map',
  deliveryMode: 'none'
};

const paletteLabels = {
  light: 'Sunlit Cream',
  dark: 'Midnight Luxe',
  rustic: 'Classic Roast',
  green: 'Fresh Garden'
};

const layoutLabels = {
  grid: 'Grid Layout',
  list: 'Editorial List'
};

const featureCards = [
  { key: 'shareMenu', title: 'Main Menu', description: 'Expandable card with section management' },
  { key: 'delivery', title: 'Delivery Service', description: 'Expandable cards' },
  { key: 'takeaway', title: 'Takeaway Service', description: 'Pickup-ready order flow' },
  { key: 'reservations', title: 'Table Reservation', description: 'Reservation request module' },
  { key: 'contactUs', title: 'Contact Us', description: 'Integrated map settings' },
  { key: 'aboutUs', title: 'About Us', description: 'Brand story and highlights' },
  { key: 'gallery', title: 'Photo Gallery', description: 'Visual gallery section' },
  { key: 'reviews', title: 'Customer Reviews', description: 'Social proof and testimonials' }
];

const InfoField = ({ label, icon: Icon, placeholder, value, onChange, readOnly = false }) => (
  <label className="web-info-card">
    <span className="web-info-label">
      {Icon && <Icon size={15} />}
      {label}
    </span>
    <input placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly} />
  </label>
);

const TextAreaField = ({ label, placeholder, value, onChange, rows = 4 }) => (
  <label className="web-textarea-card">
    <span className="web-info-label">{label}</span>
    <textarea rows={rows} placeholder={placeholder} value={value} onChange={onChange} />
  </label>
);

const OptionChipRow = ({ value, options, onChange }) => (
  <div className="web-option-row">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={`web-option-chip ${value === option.value ? 'active' : ''}`}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const ToggleCard = ({ title, description, checked, onChange, children }) => (
  <div className="web-feature-card">
    <div className="web-feature-head">
      <div>
        <div className="web-feature-title">{title}</div>
        <div className="web-feature-description">{description}</div>
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className="slider" />
      </label>
    </div>
    {children ? <div className="web-feature-body">{children}</div> : null}
  </div>
);

const AdminWebsite = () => {
  const [tab, setTab] = useState('builder');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewTemplateId, setPreviewTemplateId] = useState(null);

  const branches = getBranches();
  const activeBranchId = getBranchId() || branches[0]?.branchId;
  const branch = useMemo(() => branches.find((b) => (b.branchId || b._id) === activeBranchId), [branches, activeBranchId]);
  const restaurantName = branch?.branchName || branch?.name || branch?.orgName || 'JanakiCafe';
  const slugSource = branch?.orgName || branch?.branchName || branch?.name || 'mycafe';
  const slug = branch?.orgSlug || (typeof slugSource === 'string'
    ? slugSource.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'mycafe');
  const baseUrl = import.meta.env.VITE_PUBLIC_RESTROLINK || window.location.origin;
  const shareLink = `${baseUrl}/${slug}`;
  const menuLink = `${baseUrl}/${slug}/table/preview`;
  const activeTemplate = WEBSITE_TEMPLATES.find((TemplateComponent) => TemplateComponent.template.id === settings.template) || WEBSITE_TEMPLATES[0];

  useEffect(() => {
    setLoading(true);
    api.get('/api/public/website-settings')
      .then((res) => setSettings({ ...DEFAULT_SETTINGS, ...res.data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const copyLink = useCallback(async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {}
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await api.put('/api/public/website-settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const selectTemplate = (templateId) => {
    set('template', templateId);
  };

  const handlePreviewTemplate = useCallback((templateId) => {
    setPreviewTemplateId(templateId);
  }, []);

  const renderBuilderDashboard = () => (
    <>
      <section className="web-glass-card">
        <div className="web-section-header">
          <div>
            <h4>Live Site Control</h4>
            <p>Manage your public website link, preview flow, and instant share tools.</p>
          </div>
        </div>
        <div className="web-live-control">
          <div className="web-live-url">{shareLink}</div>
          <div className="web-live-actions">
            <button type="button" className="web-pill-button orange" onClick={() => copyLink(shareLink)}>
              <Copy size={16} />
              Copy Link
            </button>
            <a className="web-pill-button orange ghostless" href={shareLink} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              Preview Live Site
            </a>
          </div>
        </div>
      </section>

      <section className="web-block">
        <div className="web-section-header">
          <div>
            <h4>Choose Your Website Theme</h4>
            <p>Each template is now a separate component, making it easier to expand the builder later.</p>
          </div>
        </div>
        <div className="web-theme-grid">
          {WEBSITE_TEMPLATES.map((TemplateComponent) => (
            <WebsiteThemeCard
  key={TemplateComponent.template.id}
  title={TemplateComponent.template.name}
  subtitle={TemplateComponent.template.subtitle}
  selected={settings.template === TemplateComponent.template.id}
  colorPalette={settings.template === TemplateComponent.template.id ? settings.colorPalette : TemplateComponent.template.palette}
  
  // Handlers
  onPreview={() => window.open(shareLink, '_blank')}
  onSelect={() => selectTemplate(TemplateComponent.template.id, settings.colorPalette)}
  onColorChange={(newPalette) => {
    // Only allow color change if it's the active template or select it simultaneously
    setSettings(prev => ({ ...prev, colorPalette: newPalette, template: TemplateComponent.template.id }));
  }}
>
  <TemplateComponent mode="card" restaurantName={restaurantName} />
</WebsiteThemeCard>
          ))}
        </div>
      </section>

      <section className="web-block">
        <div className="web-section-header">
          <div>
            <h4>Core Pages & Features</h4>
            <p>Toggle the sections you want visible in the live website preview.</p>
          </div>
        </div>
        <div className="web-feature-grid">
          {featureCards.map((item) => {
            if (item.key === 'delivery') {
              return (
                <ToggleCard
                  key={item.key}
                  title={item.title}
                  description={item.description}
                  checked={!!settings.delivery}
                  onChange={(value) => set('delivery', value)}
                >
                  <OptionChipRow
                    value={settings.deliveryMode}
                    options={[
                      { value: 'none', label: 'Neno' },
                      { value: 'location', label: 'Location' }
                    ]}
                    onChange={(value) => set('deliveryMode', value)}
                  />
                </ToggleCard>
              );
            }

            if (item.key === 'contactUs') {
              return (
                <ToggleCard
                  key={item.key}
                  title={item.title}
                  description={item.description}
                  checked={!!settings.contactUs}
                  onChange={(value) => set('contactUs', value)}
                >
                  <OptionChipRow
                    value={settings.contactMode}
                    options={[
                      { value: 'map', label: 'Map' },
                      { value: 'custom', label: 'Customer' }
                    ]}
                    onChange={(value) => set('contactMode', value)}
                  />
                </ToggleCard>
              );
            }

            return (
              <ToggleCard
                key={item.key}
                title={item.title}
                description={item.description}
                checked={!!settings[item.key]}
                onChange={(value) => set(item.key, value)}
              />
            );
          })}
        </div>
      </section>

      <section className="web-block">
        <div className="web-section-header">
          <div>
            <h4>Restaurant Details</h4>
            <p>These fields appear inside the live mobile preview and feed your public profile page.</p>
          </div>
        </div>
        <div className="web-info-grid">
          <InfoField
            label="Address"
            icon={MapPin}
            placeholder="Enter restaurant address"
            value={settings.address}
            onChange={(event) => set('address', event.target.value)}
          />
          <InfoField
            label="Phone"
            icon={Phone}
            placeholder="Enter phone number"
            value={settings.phone}
            onChange={(event) => set('phone', event.target.value)}
          />
        </div>
        <div className="web-text-grid">
          <TextAreaField
            label="Bio"
            placeholder="Tell visitors what makes your place special"
            value={settings.bio}
            onChange={(event) => set('bio', event.target.value)}
          />
          <TextAreaField
            label="Footer"
            placeholder="Add a footer note or message"
            value={settings.footer}
            onChange={(event) => set('footer', event.target.value)}
          />
        </div>
      </section>
    </>
  );

  const renderImagesPanel = () => (
    <section className="web-glass-card">
      <div className="web-section-header">
        <div>
          <h4>Menu Images</h4>
          <p>Prepare photography and PDF assets for the live site before wiring the upload workflow.</p>
        </div>
      </div>
      <div className="web-images-layout">
        <div className="web-image-uploader">
          <UploadCloud size={28} />
          <strong>Upload Menu Covers</strong>
          <span>Add hero banners, category photos, or full menu artwork.</span>
          <button type="button" className="web-pill-button orange muted">Choose Files</button>
        </div>
        <div className="web-image-link-card">
          <div className="web-mini-label">Share Menu Link</div>
          <div className="web-mini-link">{menuLink}</div>
          <div className="web-live-actions">
            <button type="button" className="web-pill-button orange" onClick={() => copyLink(menuLink)}>
              <Copy size={16} />
              Copy Menu Link
            </button>
            <a className="web-pill-button soft" href={menuLink} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              Open Preview
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  const renderAppearancePanel = () => (
    <section className="web-glass-card">
      <div className="web-section-header">
        <div>
          <h4>Appearance</h4>
          <p>Fine tune layout, colors, and branding on top of the selected template.</p>
        </div>
      </div>
      <div className="web-appearance-grid">
        <InfoField
          label="Restaurant Logo URL"
          placeholder="https://..."
          value={settings.logoUrl}
          onChange={(event) => set('logoUrl', event.target.value)}
        />
        <InfoField
          label="Restaurant Name"
          placeholder={restaurantName}
          value={restaurantName}
          onChange={() => {}}
          readOnly
        />
        <div className="web-selection-card">
          <div className="web-selection-title">Layout</div>
          <div className="layout-options">
            {Object.entries(layoutLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`layout-tile ${settings.layout === value ? 'active' : ''}`}
                onClick={() => set('layout', value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="web-selection-card">
          <div className="web-selection-title">Color Palette</div>
          <div className="palette-row">
            {Object.entries(paletteLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`palette ${settings.colorPalette === value ? 'active' : ''}`}
                onClick={() => set('colorPalette', value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="website-screen">
      <div className="web-dashboard-shell">
        <div className="web-dashboard-topbar">
          <div>
            <div className="web-page-kicker">Website Builder</div>
            <h2>Website Builder Dashboard</h2>
          </div>
          <div className="web-toolbar">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`web-toolbar-button ${tab === item.id ? 'active' : ''}`}
                  onClick={() => setTab(item.id)}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
            <button className="btn-save-website" onClick={handleSave} disabled={saving || loading}>
              {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> {saving ? 'Saving...' : 'Save'}</>}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="web-loading">Loading settings...</div>
        ) : (
          <div className="web-dashboard-grid">
            <div className="web-builder-column">
              {previewTemplateId && (
                <div className="template-full-preview">
                  <div className="preview-header">
                    <h3>Template Preview</h3>
                    <button onClick={() => setPreviewTemplateId(null)} className="close-preview-btn">×</button>
                  </div>
                  <div className="preview-container">
                    {(() => {
                      const PreviewComponent = WEBSITE_TEMPLATES.find((t) => t.template.id === previewTemplateId);
                      return PreviewComponent ? (
                        <PreviewComponent 
                          mode="mobile" 
                          restaurantName={restaurantName} 
                          settings={settings} 
                          colorPalette={settings.colorPalette}
                        />
                      ) : null;
                    })()}
                  </div>
                </div>
              )}
              {!previewTemplateId && (
                <>
                  {tab === 'builder' && renderBuilderDashboard()}
                  {tab === 'images' && renderImagesPanel()}
                  {tab === 'appearance' && renderAppearancePanel()}
                </>
              )}
            </div>

            <aside className="web-preview-column">
              <WebsitePhonePreview
                TemplateComponent={activeTemplate}
                restaurantName={restaurantName}
                settings={settings}
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWebsite;
