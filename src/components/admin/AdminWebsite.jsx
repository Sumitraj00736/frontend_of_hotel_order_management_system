import React, { useMemo, useState } from 'react';
import '../../common/css/admin/website.css';
import { getBranches, getBranchId } from '../../api/session.js';
import { Copy, ExternalLink, UploadCloud, QrCode } from 'lucide-react';

const tabs = [
  { id: 'link', label: 'MeroLink' },
  { id: 'images', label: 'Menu Images' },
  { id: 'appearance', label: 'Appearance' }
];

const AdminWebsite = () => {
  const [tab, setTab] = useState('link');
  const [delivery, setDelivery] = useState(true);
  const [shareMenu, setShareMenu] = useState(true);
  const [phone, setPhone] = useState(true);
  const branches = getBranches();
  const activeBranchId = getBranchId() || branches[0]?.branchId;
  const branch = useMemo(() => branches.find((b) => (b.branchId || b._id) === activeBranchId), [branches, activeBranchId]);
  const slugSource = branch?.orgName || branch?.branchName || branch?.name || 'mycafe';
  const slug =
    branch?.orgSlug ||
    (typeof slugSource === 'string'
      ? slugSource
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : 'mycafe');
  const baseUrl = import.meta.env.VITE_PUBLIC_RESTROLINK || 'https://hoteloms.netlify.app';
  const shareLink = `${baseUrl}/${slug}`;
  const menuLink = `${shareLink}/en/menu`;

  const renderToggle = (label, checked, onChange, desc) => (
    <div className="web-row">
      <div>
        <div className="web-row-title">{label}</div>
        {desc && <div className="web-row-sub">{desc}</div>}
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
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
        <div className="web-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`web-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="web-content">
        <div className="web-left">
          {tab === 'link' && (
            <>
              <LinkCard title="Share Mero Link" url={shareLink} />
              <div className="web-section-title">Services</div>
              {renderToggle('Delivery Service', delivery, setDelivery, 'Offer delivery to your customers?')}
              {renderToggle('Share My Menu', shareMenu, setShareMenu, 'Would you like to share your menu?')}
              <div className="web-section-title">Restaurant Details</div>
              {renderToggle('Phone Number', phone, setPhone, 'Enable phone number for customers?')}
              <div className="web-input">
                <label>Address</label>
                <input placeholder="Search Location" />
              </div>
              <div className="web-section-title">Social Links</div>
              <button className="btn-secondary">+ Add Links</button>
              <div className="web-section-title">Useful Links</div>
              <button className="btn-secondary">+ Add Links</button>
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
                <label>Restaurant Logo</label>
                <div className="logo-row">
                  <div className="logo-placeholder">RI</div>
                  <div className="logo-actions">
                    <button className="btn-secondary">Upload</button>
                    <button className="btn-secondary">Reset</button>
                  </div>
                </div>
              </div>
              <div className="web-input">
                <label>Heading</label>
                <input value={branch?.branchName || branch?.name || 'Restaurant'} readOnly />
              </div>
              <div className="web-input">
                <label>Bio</label>
                <textarea placeholder="Enter bio" maxLength={200} />
              </div>
              <div className="web-input">
                <label>Footer</label>
                <input placeholder="Custom footer message" />
              </div>
              <div className="web-subsection">
                <div className="web-section-title">Layouts</div>
                <div className="layout-options">
                  <div className="layout-tile active">Grid Layout</div>
                  <div className="layout-tile">List Layout</div>
                </div>
              </div>
              <div className="web-subsection">
                <div className="web-section-title">Color Palettes</div>
                <div className="palette-row">
                  <div className="palette active">Light</div>
                  <div className="palette">Dark Vibes</div>
                  <div className="palette">Rustic Charm</div>
                  <div className="palette">Green Gourmet</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="web-right">
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-body">
              <div className="phone-logo" />
              <div className="phone-title">{branch?.branchName || branch?.name || 'Restaurant'}</div>
              <div className="phone-section-label">OUR SERVICES</div>
              <div className="phone-grid">
                <div className="phone-card">Menu</div>
                {delivery && <div className="phone-card">Delivery</div>}
              </div>
              <div className="phone-section-label">STAY CONNECTED</div>
              <div className="phone-grid single">
                <div className="phone-card">Contact Us</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWebsite;
