import React, { useEffect, useState } from 'react';

const PrinterSetting = ({ value, onSave }) => {
  const [form, setForm] = useState(value || {});

  useEffect(() => {
    setForm(value || {});
  }, [value]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <div className="settings-page">
      <div className="settings-title">Printer</div>
      <div className="settings-card">
        <div className="settings-card-title">Printing Mode</div>
        <div className="toggle-grid">
          <label className="toggle-row">
            <span>Local</span>
            <input type="checkbox" checked={(form.mode || 'local') === 'local'} onChange={() => update({ mode: 'local' })} />
          </label>
          <label className="toggle-row">
            <span>Cloud</span>
            <input type="checkbox" checked={(form.mode || 'local') === 'cloud'} onChange={() => update({ mode: 'cloud' })} />
          </label>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Auto Print</div>
        <div className="toggle-grid">
          <label className="toggle-row">
            <span>Auto Print Bill</span>
            <input type="checkbox" checked={form.autoPrintBill || false} onChange={(e) => update({ autoPrintBill: e.target.checked })} />
          </label>
          <label className="toggle-row">
            <span>Auto Print Full KOT</span>
            <input type="checkbox" checked={form.autoPrintFullKot || false} onChange={(e) => update({ autoPrintFullKot: e.target.checked })} />
          </label>
          <label className="toggle-row">
            <span>Direct Printing</span>
            <input type="checkbox" checked={form.directPrinting || false} onChange={(e) => update({ directPrinting: e.target.checked })} />
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary" onClick={() => onSave?.(form)}>Save Changes</button>
      </div>
    </div>
  );
};

export default PrinterSetting;
