import React, { useState } from 'react';
import { createSalesReturn } from './salesPurchaseApi.js';

export default function SalesReturnFormModal({ open, onClose, onSaved }) {
  const [customerName, setCustomerName] = useState('');
  const [txnDate, setTxnDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [billReferenceNumber, setBillReferenceNumber] = useState('');
  const [items, setItems] = useState([{ itemName: '', returnQty: 0, rate: 0, amount: 0 }]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  if (!open) return null;

  const updateItem = (idx, patch) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      const q = Number(next[idx].returnQty || 0);
      const rt = Number(next[idx].rate || 0);
      next[idx].amount = Math.round(q * rt * 100) / 100;
      return next;
    });
  };

  const netAmount = items.reduce((s, r) => s + Number(r.amount || 0), 0);

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await createSalesReturn({
        customerName,
        txnDate,
        billReferenceNumber,
        totalAmount: netAmount,
        netAmount,
        taxableAmount: netAmount,
        subTotal: netAmount,
        paymentMethod,
        paymentStatus,
        remarks,
        items: items.map((r) => ({
          itemName: r.itemName,
          returnQty: Number(r.returnQty || 0),
          rate: Number(r.rate || 0),
          amount: Number(r.amount || 0)
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
      <div className="finance-modal" style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Sales Return (Credit Note)</h3>
          <button type="button" className="finance-btn ghost" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="finance-form-grid" style={{ marginTop: 12 }}>
          <label>
            Customer
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer" />
          </label>
          <label>
            TXN Date *
            <input type="date" value={txnDate} onChange={(e) => setTxnDate(e.target.value)} />
          </label>
          <label>
            Bill Reference Number *
            <input value={billReferenceNumber} onChange={(e) => setBillReferenceNumber(e.target.value)} />
          </label>
        </div>
        <table className="finance-data-table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Return Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <input value={row.itemName} onChange={(e) => updateItem(idx, { itemName: e.target.value })} />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.returnQty}
                    onChange={(e) => updateItem(idx, { returnQty: e.target.value })}
                  />
                </td>
                <td>
                  <input type="number" value={row.rate} onChange={(e) => updateItem(idx, { rate: e.target.value })} />
                </td>
                <td>{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="finance-btn ghost"
          style={{ marginTop: 8 }}
          onClick={() => setItems((p) => [...p, { itemName: '', returnQty: 0, rate: 0, amount: 0 }])}
        >
          + Add Row
        </button>
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
        <p style={{ fontWeight: 700 }}>Net Amount: Rs {netAmount.toFixed(2)}</p>
        {err && <p style={{ color: '#b91c1c' }}>{err}</p>}
        <div className="finance-form-actions">
          <button type="button" className="finance-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="finance-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Sales Return'}
          </button>
        </div>
      </div>
    </div>
  );
}
