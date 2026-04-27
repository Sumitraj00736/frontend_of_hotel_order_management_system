import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, IdCard, LogOut, MapPin, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { uploadToCloudinary } from '../../api/upload.js';
import './userSelfProfile.css';

const formatCurrency = (amount) =>
  amount ? `NPR ${Number(amount).toLocaleString()}` : 'N/A';

const UserSelfProfile = ({ profile, onSave, onLogout, saving = false }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    profileImageUrl: '',
    citizenshipNumber: '',
    citizenshipImageUrl: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });
  const [uploading, setUploading] = useState({ avatar: false, citizenship: false });
  const editableFields = profile?.editPolicy?.editableFields || {};
  const fieldNotes = profile?.editPolicy?.notes || {};

  const isEditable = (field) => editableFields[field] !== false;

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name || '',
      phone: profile.phone || '',
      profileImageUrl: profile.profileImageUrl || '',
      citizenshipNumber: profile.citizenshipNumber || '',
      citizenshipImageUrl: profile.citizenshipImageUrl || '',
      address: profile.address || '',
      emergencyContactName: profile.emergencyContactName || '',
      emergencyContactPhone: profile.emergencyContactPhone || ''
    });
  }, [profile]);

  const avatarText = useMemo(() => {
    const source = `${form.name || profile?.name || 'U'}`.trim();
    return source ? source.slice(0, 2).toUpperCase() : 'U';
  }, [form.name, profile?.name]);

  const handleUpload = async (file, target) => {
    if (!file) return;
    const field = target === 'avatar' ? 'profileImageUrl' : 'citizenshipImageUrl';
    if (!isEditable(field)) return;
    setUploading((prev) => ({ ...prev, [target]: true }));
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({
        ...prev,
        [target === 'avatar' ? 'profileImageUrl' : 'citizenshipImageUrl']: url
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [target]: false }));
    }
  };

  return (
    <div className="self-profile-page">
      <div className="self-profile-hero">
        <div className="self-profile-avatar">
          {form.profileImageUrl ? (
            <img src={form.profileImageUrl} alt={form.name || 'Profile'} />
          ) : (
            <span>{avatarText}</span>
          )}
        </div>
        <div className="self-profile-hero-copy">
          <h2>{profile?.name || 'Profile'}</h2>
          <p>{profile?.branch?.name || 'Branch not selected'} · {profile?.branchRole || profile?.role || 'Staff'}</p>
          <div className="self-profile-hero-meta">
            <span><ShieldCheck size={14} /> {profile?.email || 'No email'}</span>
            <span><MapPin size={14} /> {profile?.branch?.address || 'Address not set'}</span>
          </div>
        </div>
      </div>

      <div className="self-profile-grid">
        <div className="settings-card">
          <div className="settings-card-title">Editable Personal Details</div>
          <div className="settings-grid">
            <div className="profile-card">
              <div className="profile-image">
                {form.profileImageUrl ? <img src={form.profileImageUrl} alt="profile" /> : <span>{avatarText}</span>}
              </div>
              <div>
                <div className="profile-label">Profile Image</div>
                <div className="profile-sub">You can update your own display photo.</div>
                <div className="profile-actions">
                  <label className="btn btn-primary">
                    {uploading.avatar ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" hidden disabled={!isEditable('profileImageUrl')} onChange={(e) => handleUpload(e.target.files?.[0], 'avatar')} />
                  </label>
                  <button className="btn btn-ghost" type="button" disabled={!isEditable('profileImageUrl')} onClick={() => setForm((prev) => ({ ...prev, profileImageUrl: '' }))}>
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Full Name</label>
              <input className="field-input" disabled={!isEditable('name')} value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Phone Number</label>
              <input className="field-input" disabled={!isEditable('phone')} value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Citizenship / Nagrikta Number</label>
              <input className="field-input" disabled={!isEditable('citizenshipNumber')} value={form.citizenshipNumber} onChange={(e) => setForm((prev) => ({ ...prev, citizenshipNumber: e.target.value }))} />
              {fieldNotes.citizenshipNumber && (
                <div className={`field-hint ${isEditable('citizenshipNumber') ? '' : 'locked'}`}>
                  {!isEditable('citizenshipNumber') && <AlertCircle size={14} />}
                  <span>{fieldNotes.citizenshipNumber}</span>
                </div>
              )}
            </div>
            <div>
              <label className="field-label">Emergency Contact Name</label>
              <input className="field-input" disabled={!isEditable('emergencyContactName')} value={form.emergencyContactName} onChange={(e) => setForm((prev) => ({ ...prev, emergencyContactName: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Emergency Contact Phone</label>
              <input className="field-input" disabled={!isEditable('emergencyContactPhone')} value={form.emergencyContactPhone} onChange={(e) => setForm((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))} />
            </div>
            <div className="field-span-2">
              <label className="field-label">Address</label>
              <textarea className="field-input" disabled={!isEditable('address')} rows="3" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
            </div>
          </div>

          <div className="self-profile-upload-card">
            <div className="self-profile-upload-meta">
              <div className="self-profile-upload-icon"><IdCard size={20} /></div>
              <div>
                <div className="profile-label">Citizenship Image</div>
                <div className="profile-sub">Upload front photo of citizenship / Nagrikta for verification.</div>
                {fieldNotes.citizenshipImageUrl && (
                  <div className={`field-hint ${isEditable('citizenshipImageUrl') ? '' : 'locked'}`}>
                    {!isEditable('citizenshipImageUrl') && <AlertCircle size={14} />}
                    <span>{fieldNotes.citizenshipImageUrl}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="profile-actions">
              <label className="btn btn-primary">
                {uploading.citizenship ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" hidden disabled={!isEditable('citizenshipImageUrl')} onChange={(e) => handleUpload(e.target.files?.[0], 'citizenship')} />
              </label>
              {form.citizenshipImageUrl && (
                <a className="btn btn-ghost" href={form.citizenshipImageUrl} target="_blank" rel="noreferrer">
                  View
                </a>
              )}
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn btn-primary" type="button" disabled={saving || uploading.avatar || uploading.citizenship} onClick={() => onSave?.(form)}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-title">Restricted Employment Details</div>
          <div className="self-profile-summary-list">
            <div className="self-profile-summary-item">
              <span><UserRound size={16} /> Role</span>
              <strong>{profile?.branchRole || profile?.role || 'Staff'}</strong>
            </div>
            <div className="self-profile-summary-item">
              <span><Phone size={16} /> Branch</span>
              <strong>{profile?.branch?.name || 'Not assigned'}</strong>
            </div>
            <div className="self-profile-summary-item">
              <span><ShieldCheck size={16} /> Date of Joining</span>
              <strong>{profile?.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString() : 'N/A'}</strong>
            </div>
            <div className="self-profile-summary-item">
              <span><ShieldCheck size={16} /> Salary</span>
              <strong>{formatCurrency(profile?.salary)}</strong>
            </div>
            <div className="self-profile-summary-item">
              <span><ShieldCheck size={16} /> Shift Timing</span>
              <strong>{profile?.shiftStart || '--'} to {profile?.shiftEnd || '--'}</strong>
            </div>
          </div>
          <div className="profile-sub" style={{ marginTop: 12 }}>
            These employment and access fields are controlled by admin / superadmin and cannot be changed from self-profile.
          </div>

          {onLogout && (
            <button className="sidebar-button sub danger profile-panel-logout self-profile-logout" type="button" onClick={onLogout}>
              <LogOut size={14} />
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSelfProfile;
