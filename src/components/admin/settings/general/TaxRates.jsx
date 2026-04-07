import React, { useMemo, useState } from 'react';

const TaxRates = ({ settings, taxes, onSaveSettings, onCreateTax, onUpdateTax, onDeleteTax }) => {
  const [relation, setRelation] = useState(settings?.priceRelation || 'inclusive');
  const [taxInfo, setTaxInfo] = useState({
    legalName: settings?.legalName || '',
    taxNumber: settings?.taxNumber || '',
    invoiceType: settings?.invoiceType || 'Estimate Invoice',
    contactNumber: settings?.contactNumber || '',
    address: settings?.address || ''
  });
  const [showModal, setShowModal] = useState(false);
  const [taxForm, setTaxForm] = useState({ name: '', rate: '', notes: '' });

  React.useEffect(() => {
    if (!settings) return;
    setRelation(settings.priceRelation || 'inclusive');
    setTaxInfo({
      legalName: settings.legalName || '',
      taxNumber: settings.taxNumber || '',
      invoiceType: settings.invoiceType || 'Estimate Invoice',
      contactNumber: settings.contactNumber || '',
      address: settings.address || ''
    });
  }, [settings]);

  const taxRows = useMemo(() => taxes || [], [taxes]);

  const saveSettings = () => {
    onSaveSettings?.({
      priceRelation: relation,
      ...taxInfo
    });
  };

  const submitTax = async () => {
    if (!taxForm.name || taxForm.rate === '') return;
    await onCreateTax?.({
      name: taxForm.name,
      rate: Number(taxForm.rate),
      notes: taxForm.notes
    });
    setTaxForm({ name: '', rate: '', notes: '' });
    setShowModal(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-title">Tax & Rates</div>
      <div className="settings-row">
        <div className="settings-card">
          <div className="settings-card-title">Price and Tax Relation</div>
          <p className="settings-hint">All listed price of menu or dishes will be inclusive of taxes.</p>
          <p className="settings-hint">In menu, note about prices are inclusive of tax will be displayed.</p>
          <select
            className="field-input"
            value={relation}
            onChange={(e) => {
              setRelation(e.target.value);
              onSaveSettings?.({ priceRelation: e.target.value, ...taxInfo });
            }}
          >
            <option value="inclusive">Inclusive</option>
            <option value="exclusive">Exclusive</option>
          </select>
        </div>
        <div className="settings-card">
          <div className="settings-card-title">Restaurant Tax Details</div>
          <div className="tax-details">
            <div>
              <div className="tax-label">Legal Name</div>
              <input className="field-input" value={taxInfo.legalName} onChange={(e) => setTaxInfo({ ...taxInfo, legalName: e.target.value })} />
            </div>
            <div>
              <div className="tax-label">Tax Number</div>
              <input className="field-input" value={taxInfo.taxNumber} onChange={(e) => setTaxInfo({ ...taxInfo, taxNumber: e.target.value })} />
            </div>
            <div>
              <div className="tax-label">Invoice Type</div>
              <input className="field-input" value={taxInfo.invoiceType} onChange={(e) => setTaxInfo({ ...taxInfo, invoiceType: e.target.value })} />
            </div>
            <div>
              <div className="tax-label">Contact</div>
              <input className="field-input" value={taxInfo.contactNumber} onChange={(e) => setTaxInfo({ ...taxInfo, contactNumber: e.target.value })} />
            </div>
            <div>
              <div className="tax-label">Address</div>
              <input className="field-input" value={taxInfo.address} onChange={(e) => setTaxInfo({ ...taxInfo, address: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={saveSettings}>Save</button>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Taxes</div>
        {taxRows.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">No Tax found</div>
            <div className="empty-sub">Create a new tax or import a new data.</div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add New Tax</button>
          </div>
        ) : (
          <table className="settings-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Tax Name</th>
                <th>Rate(%)</th>
                <th>Status</th>
                <th>Notes</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {taxRows.map((tax, idx) => (
                <tr key={tax._id}>
                  <td>{idx + 1}</td>
                  <td>{tax.name}</td>
                  <td>{tax.rate}</td>
                  <td>{tax.status}</td>
                  <td>{tax.notes || '-'}</td>
                  <td>
                    <button className="link" onClick={() => onUpdateTax?.(tax._id, { status: tax.status === 'active' ? 'inactive' : 'active' })}>
                      Toggle
                    </button>
                    <button className="link danger" onClick={() => onDeleteTax?.(tax._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Create Tax</div>
            <label className="field-label">Tax Name *</label>
            <input className="field-input" value={taxForm.name} onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })} />
            <label className="field-label">Tax Rate (in %) *</label>
            <input className="field-input" value={taxForm.rate} onChange={(e) => setTaxForm({ ...taxForm, rate: e.target.value })} />
            <label className="field-label">Notes</label>
            <input className="field-input" value={taxForm.notes} onChange={(e) => setTaxForm({ ...taxForm, notes: e.target.value })} />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setTaxForm({ name: '', rate: '', notes: '' })}>Reset</button>
              <button className="btn btn-primary" onClick={submitTax}>Save Tax</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxRates;
