import React, { useEffect, useState } from 'react';

const InvoiceSetting = ({ value, onSave }) => {
  const [form, setForm] = useState(value || {});

  useEffect(() => {
    setForm(value || {});
  }, [value]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <div className="settings-page">
      <div className="settings-title">Invoice Setting</div>
      <div className="settings-card split">
        <div className="settings-column">
          <div className="settings-card-title">Restaurant Information</div>
          <div className="settings-grid">
            <input className="field-input" placeholder="Invoice Type" value={form.invoiceType || ''} onChange={(e) => update({ invoiceType: e.target.value })} />
            <input className="field-input" placeholder="Restaurant Legal Name" value={form.legalName || ''} onChange={(e) => update({ legalName: e.target.value })} />
            <input className="field-input" placeholder="Contact Number" value={form.contactNumber || ''} onChange={(e) => update({ contactNumber: e.target.value })} />
            <input className="field-input" placeholder="Tax Number" value={form.taxNumber || ''} onChange={(e) => update({ taxNumber: e.target.value })} />
            <input className="field-input" placeholder="Address" value={form.address || ''} onChange={(e) => update({ address: e.target.value })} />
          </div>

          <div className="settings-card-title mt-3">Invoice Heading Details</div>
          <div className="toggle-grid">
            {['showEstimateNumber','showInvoiceNo','showDate','showOrderType','showTime'].map((key) => (
              <label key={key} className="toggle-row">
                <span>{key.replace('show', '').replace(/([A-Z])/g, ' $1')}</span>
                <input type="checkbox" checked={form[key] ?? true} onChange={(e) => update({ [key]: e.target.checked })} />
              </label>
            ))}
          </div>

          <div className="settings-card-title mt-3">Line Item Details</div>
          <div className="toggle-grid">
            {['showItemSN','showHSCode','showParticular','showRate','showQty','showAmount'].map((key) => (
              <label key={key} className="toggle-row">
                <span>{key.replace('show', '').replace(/([A-Z])/g, ' $1')}</span>
                <input type="checkbox" checked={form[key] ?? true} onChange={(e) => update({ [key]: e.target.checked })} />
              </label>
            ))}
          </div>

          <div className="settings-card-title mt-3">Footer</div>
          <div className="settings-grid">
            <input className="field-input" placeholder="Header" value={form.footer?.header || ''} onChange={(e) => update({ footer: { ...(form.footer || {}), header: e.target.value } })} />
            <input className="field-input" placeholder="Remarks" value={form.footer?.remarks || ''} onChange={(e) => update({ footer: { ...(form.footer || {}), remarks: e.target.value } })} />
          </div>
          <div className="settings-actions">
            <button className="btn btn-primary" onClick={() => onSave?.(form)}>Save Changes</button>
          </div>
        </div>
        <div className="settings-preview">
          <div className="preview-title">Estimate Invoice</div>
          <div className="preview-card">Preview will render here.</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSetting;
