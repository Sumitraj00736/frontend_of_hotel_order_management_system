import React, { useState } from 'react';
import { createPurchaseReturn } from './purchaseApi.js';

const emptyItem = () => ({
  description: '',
  qty: 0,
  rate: 0,
  amount: 0,
  uom: '',
  accountHead: ''
});

export default function PurchaseReturnFormModal({ open, onClose, onSaved }) {
  const [supplierName, setSupplierName] = useState('');
  const [billDate, setBillDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [billReferenceNumber, setBillReferenceNumber] = useState('');
  const [items, setItems] = useState([emptyItem()]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  if (!open) return null;

  const updateItem = (idx, patch) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      const q = Number(next[idx].qty || 0);
      const rt = Number(next[idx].rate || 0);
      next[idx].amount = Math.round(q * rt * 100) / 100;
      return next;
    });
  };

  const totalAmount = items.reduce((s, r) => s + Number(r.amount || 0), 0);
  const taxableAmount = Math.max(0, totalAmount - Number(discount || 0));
  const taxAmount = (taxableAmount * Number(taxRate || 0)) / 100;
  const estimatedGrandTotal = Math.max(0, taxableAmount + taxAmount + Number(roundOff || 0));

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await createPurchaseReturn({
        supplierName,
        billDate,
        billReferenceNumber,
        paymentMethod,
        paymentStatus,
        discount: Number(discount || 0),
        taxRate: Number(taxRate || 0),
        roundOff: Number(roundOff || 0),
        remarks,
        items: items.map((r) => ({
          description: r.description,
          qty: Number(r.qty || 0),
          rate: Number(r.rate || 0),
          amount: Number(r.amount || 0),
          uom: r.uom,
          accountHead: r.accountHead
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
      <div className="finance-modal" style={{ maxWidth: 880 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Purchase Return (Debit Note)</h3>
          <button type="button" className="finance-btn ghost" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="finance-form-grid" style={{ marginTop: 12 }}>
          <label>
            Supplier
            <input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />
          </label>
          <label>
            Bill Date *
            <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
          </label>
          <label>
            Bill Reference Number *
            <input value={billReferenceNumber} onChange={(e) => setBillReferenceNumber(e.target.value)} />
          </label>
        </div>
        <table className="finance-data-table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>SN</th>
              <th>Description</th>
              <th>QTY</th>
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
                  <input value={row.description} onChange={(e) => updateItem(idx, { description: e.target.value })} />
                </td>
                <td>
                  <input type="number" value={row.qty} onChange={(e) => updateItem(idx, { qty: e.target.value })} />
                </td>
                <td>
                  <input type="number" value={row.rate} onChange={(e) => updateItem(idx, { rate: e.target.value })} />
                </td>
                <td>{row.amount}</td>
                <td>
                  <input value={row.uom} onChange={(e) => updateItem(idx, { uom: e.target.value })} />
                </td>
                <td>
                  <input value={row.accountHead} onChange={(e) => updateItem(idx, { accountHead: e.target.value })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="finance-btn ghost"
          style={{ marginTop: 8 }}
          onClick={() => setItems((p) => [...p, emptyItem()])}
        >
          + Add Row
        </button>
        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <label>
            Discount
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </label>
          <label>
            Tax Rate (%)
            <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
          </label>
          <label>
            Round Off
            <input type="number" value={roundOff} onChange={(e) => setRoundOff(e.target.value)} />
          </label>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <label>
            Payment
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
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} style={{ width: '100%' }} />
        </label>
        <div style={{ marginTop: 10, padding: 12, background: '#f8fafc', borderRadius: 10, color: '#334155' }}>
          <div>Estimated Subtotal: Rs {totalAmount.toFixed(2)}</div>
          <div>Estimated Discount: Rs {Number(discount || 0).toFixed(2)}</div>
          <div>Estimated Tax: Rs {taxAmount.toFixed(2)}</div>
          <div style={{ fontWeight: 700 }}>Estimated Total: Rs {estimatedGrandTotal.toFixed(2)}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Final totals are calculated and validated by the backend.</div>
        </div>
        {err && <p style={{ color: '#b91c1c' }}>{err}</p>}
        <div className="finance-form-actions">
          <button type="button" className="finance-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="finance-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Purchase Return'}
          </button>
        </div>
      </div>
    </div>
  );
}
