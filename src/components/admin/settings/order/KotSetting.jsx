import React, { useEffect, useState } from 'react';

const KotSetting = ({ value, onSave }) => {
  const [form, setForm] = useState(value || {});

  useEffect(() => {
    setForm(value || {});
  }, [value]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <div className="settings-page">
      <div className="settings-title">KOT Setting</div>
      <div className="settings-card split">
        <div className="settings-column">
          <div className="settings-card-title">KOT Heading Details</div>
          <div className="toggle-grid">
            {['showKotNo','showOrderType','showTable','showOrderBy','showTime'].map((key) => (
              <label key={key} className="toggle-row">
                <span>{key.replace('show', '').replace(/([A-Z])/g, ' $1')}</span>
                <input type="checkbox" checked={form[key] ?? true} onChange={(e) => update({ [key]: e.target.checked })} />
              </label>
            ))}
          </div>

          <div className="settings-card-title mt-3">Line Items</div>
          <div className="toggle-grid">
            {['showItemSN','showDishes','showQty','showTotal'].map((key) => (
              <label key={key} className="toggle-row">
                <span>{key.replace('show', '').replace(/([A-Z])/g, ' $1')}</span>
                <input type="checkbox" checked={form[key] ?? true} onChange={(e) => update({ [key]: e.target.checked })} />
              </label>
            ))}
          </div>

          <div className="settings-card-title mt-3">Print Settings</div>
          <div className="settings-grid two">
            <input className="field-input" placeholder="Print Count" value={form.printCount || 1} onChange={(e) => update({ printCount: Number(e.target.value) })} />
            <input className="field-input" placeholder="Font Size" value={form.fontSize || 9} onChange={(e) => update({ fontSize: Number(e.target.value) })} />
          </div>

          <div className="settings-card-title mt-3">Footer</div>
          <div className="toggle-grid">
            {['showKotRemarks','showDishRemarks','showPrintedBy','showPrintedAt'].map((key) => (
              <label key={key} className="toggle-row">
                <span>{key.replace('show', '').replace(/([A-Z])/g, ' $1')}</span>
                <input type="checkbox" checked={form[key] ?? true} onChange={(e) => update({ [key]: e.target.checked })} />
              </label>
            ))}
          </div>

          <div className="settings-actions">
            <button className="btn btn-primary" onClick={() => onSave?.(form)}>Save Changes</button>
          </div>
        </div>
        <div className="settings-preview">
          <div className="preview-title">KOT Preview</div>
          <div className="preview-card">Preview will render here.</div>
        </div>
      </div>
    </div>
  );
};

export default KotSetting;
