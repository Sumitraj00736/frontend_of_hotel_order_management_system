import React, { useEffect, useMemo, useState, useCallback } from 'react';
import '../../../common/css/admin/website/website.css';
import { getBranches, getBranchId } from '../../../api/session.js';
import { Copy, ExternalLink, UploadCloud, QrCode, Save, CheckCircle } from 'lucide-react';
import api from '../../../api/client.js';

const tabs = [
  { id: 'link', label: 'MeroLink' },
  { id: 'images', label: 'Menu Images' },
  { id: 'appearance', label: 'Appearance' }
];

const DEFAULT_SETTINGS = {
  delivery: true,
  shareMenu: true,
  showPhone: true,
  address: '',
  bio: '',
  footer: '',
  logoUrl: '',
  colorPalette: 'light',
  layout: 'grid',
  socialLinks: []
};

const AdminWebsite = () => {
  const [tab, setTab] = useState('link');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const branches = getBranches();
  const activeBranchId = getBranchId() || branches[0]?.branchId;
  const branch = useMemo(() => branches.find((b) => (b.branchId || b._id) === activeBranchId), [branches, activeBranchId]);
  const slugSource = branch?.orgName || branch?.branchName || branch?.name || 'mycafe';
  const slug = branch?.orgSlug || (typeof slugSource === 'string'
    ? slugSource.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'mycafe');
  const baseUrl = import.meta.env.VITE_PUBLIC_RESTROLINK || window.location.origin;
  const shareLink = `${baseUrl}/${slug}`;
  const menuLink  = `${baseUrl}/${slug}/table/preview`;

  // Load settings from backend
  useEffect(() => {
    setLoading(true);
    api.get('/api/public/website-settings')
      .then((res) => setSettings({ ...DEFAULT_SETTINGS, ...res.data }))
      .catch(() => {/* use defaults */})
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await api.put('/api/public/website-settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const renderToggle = (label, key, desc) => (
    <div className="web-row">
      <div>
        <div className="web-row-title">{label}</div>
        {desc && <div className="web-row-sub">{desc}</div>}
      </div>
      <label className="switch">
        <input type="checkbox" checked={!!settings[key]} onChange={(e) => set(key, e.target.checked)} />
        <span className="slider" />
      </label>
    </div>
  );

  const LinkCard = ({ title, url }) => (
    <div className="web-link-card">
      <div className="web-link-title">{title}</div>
      <div className="web-link-box">
        <span className="web-link-text">{url}</span>
        <div className="web-link-actions">
          <button onClick={() => navigator.clipboard.writeText(url)}><Copy size={16} /></button>
          <a href={url} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>
        </div>
      </div>
      <div className="web-link-secondary">
        <button className="btn-secondary">Get Your Own Custom Domain</button>
        <button className="btn-secondary icon"><QrCode size={16} /> Share QR</button>
      </div>
    </div>
  );

  return (
    <div className="website-screen">
      <div className="web-header">
        <h3>Website</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="web-tabs">
            {tabs.map((t) => (
              <button key={t.id} className={`web-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <button
            className="btn-save-website"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> {saving ? 'Saving…' : 'Save'}</>}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="web-loading">Loading settings…</div>
      ) : (
        <div className="web-content">
          <div className="web-left">
            {tab === 'link' && (
              <>
                <LinkCard title="Share Mero Link" url={shareLink} />
                <div className="web-section-title">Services</div>
                {renderToggle('Delivery Service', 'delivery', 'Offer delivery to your customers?')}
                {renderToggle('Share My Menu', 'shareMenu', 'Would you like to share your menu?')}
                <div className="web-section-title">Restaurant Details</div>
                {renderToggle('Phone Number', 'showPhone', 'Enable phone number for customers?')}
                <div className="web-input">
                  <label>Address</label>
                  <input
                    placeholder="Enter restaurant address"
                    value={settings.address}
                    onChange={(e) => set('address', e.target.value)}
                  />
                </div>
              </>
            )}

            {tab === 'images' && (
              <>
                <LinkCard title="Share Menu Link" url={menuLink} />
                <div className="web-section-title">Upload Menu</div>
                <div className="upload-box">
                  <UploadCloud size={28} />
                  <div>Upload Menu</div>
                </div>
              </>
            )}

            {tab === 'appearance' && (
              <div className="appearance-grid">
                <div className="web-input">
                  <label>Restaurant Logo URL</label>
                  <input
                    placeholder="https://..."
                    value={settings.logoUrl}
                    onChange={(e) => set('logoUrl', e.target.value)}
                  />
                </div>
                <div className="web-input">
                  <label>Heading</label>
                  <input value={branch?.branchName || branch?.name || 'Restaurant'} readOnly />
                </div>
                <div className="web-input">
                  <label>Bio</label>
                  <textarea
                    placeholder="Enter bio"
                    maxLength={200}
                    value={settings.bio}
                    onChange={(e) => set('bio', e.target.value)}
                  />
                </div>
                <div className="web-input">
                  <label>Footer</label>
                  <input
                    placeholder="Custom footer message"
                    value={settings.footer}
                    onChange={(e) => set('footer', e.target.value)}
                  />
                </div>
                <div className="web-subsection">
                  <div className="web-section-title">Layouts</div>
                  <div className="layout-options">
                    {['grid', 'list'].map((l) => (
                      <div
                        key={l}
                        className={`layout-tile ${settings.layout === l ? 'active' : ''}`}
                        onClick={() => set('layout', l)}
                      >
                        {l === 'grid' ? 'Grid Layout' : 'List Layout'}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="web-subsection">
                  <div className="web-section-title">Color Palettes</div>
                  <div className="palette-row">
                    {['light', 'dark', 'rustic', 'green'].map((p) => (
                      <div
                        key={p}
                        className={`palette ${settings.colorPalette === p ? 'active' : ''}`}
                        onClick={() => set('colorPalette', p)}
                      >
                        {p === 'light' ? 'Light' : p === 'dark' ? 'Dark Vibes' : p === 'rustic' ? 'Rustic Charm' : 'Green Gourmet'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live phone preview */}
          <div className="web-right">
            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="phone-body">
                {settings.logoUrl
                  ? <img src={settings.logoUrl} alt="logo" className="phone-logo-img" />
                  : <div className="phone-logo" />}
                <div className="phone-title">{branch?.branchName || branch?.name || 'Restaurant'}</div>
                {settings.bio && <div className="phone-bio">{settings.bio}</div>}
                <div className="phone-section-label">OUR SERVICES</div>
                <div className="phone-grid">
                  {settings.shareMenu && <div className="phone-card">Menu</div>}
                  {settings.delivery && <div className="phone-card">Delivery</div>}
                </div>
                <div className="phone-section-label">STAY CONNECTED</div>
                <div className="phone-grid single">
                  <div className="phone-card">Contact Us</div>
                </div>
                {settings.footer && <div className="phone-footer">{settings.footer}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebsite;
