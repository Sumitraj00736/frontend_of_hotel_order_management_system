import React, { useState } from 'react';
import { createPurchase } from './salesPurchaseApi.js';

const emptyItem = () => ({
  name: '',
  qty: 0,
  rate: 0,
  amount: 0,
  uom: '',
  accountHead: '',
  description: ''
});

export default function PurchaseBillFormModal({ open, onClose, onSaved }) {
  const [supplierName, setSupplierName] = useState('');
  const [billDate, setBillDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [billReferenceNumber, setBillReferenceNumber] = useState('');
  const [items, setItems] = useState([emptyItem()]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  if (!open) return null;

  const recalcAmount = (row) => {
    const q = Number(row.qty || 0);
    const r = Number(row.rate || 0);
    return Math.round(q * r * 100) / 100;
  };

  const updateItem = (idx, patch) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      if ('qty' in patch || 'rate' in patch) {
        next[idx].amount = recalcAmount(next[idx]);
      }
      return next;
    });
  };

  const totalAmount = items.reduce((s, r) => s + Number(r.amount || 0), 0);

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await createPurchase({
        supplierName,
        billDate,
        billReferenceNumber,
        referenceNo: billReferenceNumber,
        title: 'Purchase',
        amount: totalAmount,
        paymentMethod,
        paymentStatus,
        paidAt: billDate,
        note,
        items: items.map((r) => ({
          name: r.name || 'Item',
          qty: Number(r.qty || 0),
          rate: Number(r.rate || 0),
          amount: Number(r.amount || 0),
          uom: r.uom,
          accountHead: r.accountHead,
          description: r.description
        }))
      });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="finance-modal-overlay">
      <div className="finance-modal" style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Add Purchase Bill</h3>
          <button type="button" className="finance-btn ghost" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="finance-form-grid" style={{ marginTop: 12 }}>
          <label>
            Supplier
            <input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="Supplier name" />
          </label>
          <label>
            Bill Date *
            <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
          </label>
          <label>
            Bill Reference Number
            <input value={billReferenceNumber} onChange={(e) => setBillReferenceNumber(e.target.value)} />
          </label>
        </div>

        <table className="finance-data-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>SN</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>UOM</th>
              <th>Account Head</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <input value={row.name} onChange={(e) => updateItem(idx, { name: e.target.value })} />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.qty}
                    onChange={(e) => updateItem(idx, { qty: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) => updateItem(idx, { rate: e.target.value })}
                  />
                </td>
                <td>{row.amount}</td>
                <td>
                  <input value={row.uom} onChange={(e) => updateItem(idx, { uom: e.target.value })} placeholder="UOM" />
                </td>
                <td>
                  <input
                    value={row.accountHead}
                    onChange={(e) => updateItem(idx, { accountHead: e.target.value })}
                    placeholder="Account"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="finance-btn ghost"
          style={{ marginTop: 8 }}
          onClick={() => setItems((prev) => [...prev, emptyItem()])}
        >
          + Add Row
        </button>

        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
          <label>
            Payment mode
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank">Bank</option>
              <option value="fonepay">Fonepay</option>
              <option value="owner">Owner</option>
            </select>
          </label>
          <label>
            Status
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="paid">Paid</option>
              <option value="unpaid_credit">Unpaid / Credit</option>
            </select>
          </label>
        </div>
        <label style={{ display: 'block', marginTop: 8 }}>
          Remarks
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} style={{ width: '100%' }} />
        </label>
        <p style={{ fontWeight: 700 }}>Total: Rs {totalAmount.toFixed(2)}</p>
        {err && <p style={{ color: '#b91c1c' }}>{err}</p>}
        <div className="finance-form-actions">
          <button type="button" className="finance-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="finance-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Purchase Bill'}
          </button>
        </div>
      </div>
    </div>
  );
}
