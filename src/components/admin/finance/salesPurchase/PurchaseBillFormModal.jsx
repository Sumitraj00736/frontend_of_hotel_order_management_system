import React, { useState, useEffect } from 'react';
import { createPurchase } from './salesPurchaseApi.js';
import api from '../../../../api/client.js';

const emptyItem = () => ({
  ingredientId: '',
  name: '',
  qty: 0,
  rate: 0,
  amount: 0,
  uom: '',
  accountHead: '',
  description: ''
});

export default function PurchaseBillFormModal({ open, onClose, onSaved }) {
  const [supplierId, setSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [billDate, setBillDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [billReferenceNumber, setBillReferenceNumber] = useState('');
  const [items, setItems] = useState([emptyItem()]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [taxRate, setTaxRate] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState('amount');
  const [roundOff, setRoundOff] = useState(0);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDrop, setShowSupplierDrop] = useState(false);

  useEffect(() => {
    if (!open) return;
    api.get('/api/suppliers').then(r => setSuppliers(r.data.suppliers || [])).catch(() => {});
    api.get('/api/inventory/ingredients').then(r => setIngredients(r.data || [])).catch(() => {});
  }, [open]);

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
      // Auto-fill UOM from ingredient
      if (patch.ingredientId) {
        const ing = ingredients.find(i => i._id === patch.ingredientId);
        if (ing) {
          next[idx].name = ing.name;
          next[idx].uom = ing.unit;
          next[idx].rate = ing.defaultPrice || next[idx].rate;
        }
      }
      if ('qty' in patch || 'rate' in patch) {
        next[idx].amount = recalcAmount(next[idx]);
      }
      return next;
    });
  };

  const totalAmount = items.reduce((s, r) => s + Number(r.amount || 0), 0);
  const discountAmount =
    discountType === 'percent'
      ? Math.min(totalAmount, (totalAmount * Number(discountValue || 0)) / 100)
      : Math.min(totalAmount, Number(discountValue || 0));
  const taxableAmount = Math.max(0, totalAmount - discountAmount);
  const taxAmount = (taxableAmount * Number(taxRate || 0)) / 100;
  const estimatedGrandTotal = Math.max(0, taxableAmount + taxAmount + Number(roundOff || 0));

  const filteredSuppliers = suppliers.filter(s =>
    !supplierSearch || s.name.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await createPurchase({
        supplierId: supplierId || undefined,
        supplierName: supplierName || suppliers.find(s => s._id === supplierId)?.name,
        billDate,
        billReferenceNumber,
        referenceNo: billReferenceNumber,
        title: 'Purchase',
        paymentMethod,
        paymentStatus,
        paidAt: billDate,
        taxRate: Number(taxRate || 0),
        discountType,
        discountValue: Number(discountValue || 0),
        roundOff: Number(roundOff || 0),
        note,
        items: items.map((r) => ({
          ingredientId: r.ingredientId || undefined,
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
      <div className="finance-modal" style={{ maxWidth: 950 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Add Purchase Bill</h3>
          <button type="button" className="finance-btn ghost" onClick={onClose}>✕</button>
        </div>

        <div className="finance-form-grid" style={{ marginTop: 12 }}>
          {/* Supplier selector */}
          <label style={{ position: 'relative' }}>
            Supplier
            <div style={{ position: 'relative' }}>
              <input
                value={supplierId ? (suppliers.find(s => s._id === supplierId)?.name || supplierName) : supplierSearch}
                placeholder="Search or type supplier name"
                onChange={(e) => {
                  setSupplierSearch(e.target.value);
                  setSupplierId('');
                  setSupplierName(e.target.value);
                  setShowSupplierDrop(true);
                }}
                onFocus={() => setShowSupplierDrop(true)}
              />
              {showSupplierDrop && filteredSuppliers.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                  maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  {filteredSuppliers.map(s => (
                    <div
                      key={s._id}
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                      onMouseDown={() => {
                        setSupplierId(s._id);
                        setSupplierName(s.name);
                        setSupplierSearch('');
                        setShowSupplierDrop(false);
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                      {s.phone && <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>{s.phone}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
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

        {/* Items Table */}
        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <table className="finance-data-table">
            <thead>
              <tr>
                <th>SN</th>
                <th style={{ minWidth: 160 }}>Ingredient / Item</th>
                <th>Qty</th>
                <th>UOM</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Account Head</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <select
                      style={{ minWidth: 160 }}
                      value={row.ingredientId}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__manual__') {
                          updateItem(idx, { ingredientId: '', name: '' });
                        } else {
                          updateItem(idx, { ingredientId: val });
                        }
                      }}
                    >
                      <option value="">— Select ingredient —</option>
                      {ingredients.map(ing => (
                        <option key={ing._id} value={ing._id}>{ing.name} ({ing.unit})</option>
                      ))}
                      <option value="__manual__">✏ Type manually</option>
                    </select>
                    {!row.ingredientId && (
                      <input
                        style={{ marginTop: 4 }}
                        value={row.name}
                        placeholder="Item name"
                        onChange={(e) => updateItem(idx, { name: e.target.value })}
                      />
                    )}
                  </td>
                  <td>
                    <input type="number" value={row.qty} onChange={(e) => updateItem(idx, { qty: e.target.value })} />
                  </td>
                  <td>
                    <input value={row.uom} onChange={(e) => updateItem(idx, { uom: e.target.value })} placeholder="UOM" />
                  </td>
                  <td>
                    <input type="number" value={row.rate} onChange={(e) => updateItem(idx, { rate: e.target.value })} />
                  </td>
                  <td style={{ fontWeight: 600 }}>Rs {row.amount}</td>
                  <td>
                    <input value={row.accountHead} onChange={(e) => updateItem(idx, { accountHead: e.target.value })} placeholder="Account" />
                  </td>
                  <td>
                    <button type="button" className="finance-btn ghost" style={{ padding: '2px 8px' }} onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          className="finance-btn ghost"
          style={{ marginTop: 8 }}
          onClick={() => setItems((prev) => [...prev, emptyItem()])}
        >
          + Add Row
        </button>

        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <label>
            Discount Type
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="amount">Amount</option>
              <option value="percent">Percent</option>
            </select>
          </label>
          <label>
            Discount {discountType === 'percent' ? '(%)' : '(Rs)'}
            <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
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

        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
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

        <div style={{ marginTop: 10, padding: 12, background: '#f8fafc', borderRadius: 10, color: '#334155' }}>
          <div>Estimated Subtotal: Rs {totalAmount.toFixed(2)}</div>
          <div>Estimated Discount: Rs {discountAmount.toFixed(2)}</div>
          <div>Estimated Tax: Rs {taxAmount.toFixed(2)}</div>
          <div style={{ fontWeight: 700 }}>Estimated Grand Total: Rs {estimatedGrandTotal.toFixed(2)}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Final finance totals are calculated and validated by the backend on save.</div>
        </div>
        {err && <p style={{ color: '#b91c1c' }}>{err}</p>}

        <div className="finance-form-actions">
          <button type="button" className="finance-btn ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="finance-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Purchase Bill'}
          </button>
        </div>
      </div>
    </div>
  );
}
