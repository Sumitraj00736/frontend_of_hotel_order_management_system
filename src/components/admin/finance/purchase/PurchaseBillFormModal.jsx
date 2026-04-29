import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Calendar, Hash, User, 
  CreditCard, FileText, Calculator, ChevronDown,
  ShoppingCart
} from 'lucide-react';
import { createPurchase } from './purchaseApi.js';
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
    <div className="fd-modal-overlay">
      <div className="fd-modal" style={{ maxWidth: 1000, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div className="fd-modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#f5a52415', color: '#f5a524', padding: '8px', borderRadius: '10px' }}>
              <ShoppingCart size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Add Purchase Bill</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Create a new inventory purchase record</p>
            </div>
          </div>
          <button className="fd-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="fd-form-row">
              <label><User size={12} style={{ marginRight: 6 }} />Supplier Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="fd-date-input"
                  style={{ width: '100%', height: '40px' }}
                  value={supplierId ? (suppliers.find(s => s._id === supplierId)?.name || supplierName) : supplierSearch}
                  placeholder="Search or type supplier name..."
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
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
                    maxHeight: 200, overflowY: 'auto', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    marginTop: '4px'
                  }}>
                    {filteredSuppliers.map(s => (
                      <div
                        key={s._id}
                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}
                        className="hover-bg-slate-50"
                        onMouseDown={() => {
                          setSupplierId(s._id);
                          setSupplierName(s.name);
                          setSupplierSearch('');
                          setShowSupplierDrop(false);
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{s.name}</div>
                        {s.phone && <div style={{ fontSize: '11px', color: '#64748b' }}>{s.phone}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="fd-form-row">
              <label><Calendar size={12} style={{ marginRight: 6 }} />Bill Date</label>
              <input 
                type="date" 
                className="fd-date-input" 
                style={{ width: '100%', height: '40px' }}
                value={billDate} 
                onChange={(e) => setBillDate(e.target.value)} 
              />
            </div>

            <div className="fd-form-row">
              <label><Hash size={12} style={{ marginRight: 6 }} />Bill Reference</label>
              <input 
                className="fd-date-input" 
                style={{ width: '100%', height: '40px' }}
                placeholder="INV-001"
                value={billReferenceNumber} 
                onChange={(e) => setBillReferenceNumber(e.target.value)} 
              />
            </div>
          </div>

          <div className="fd-table-card" style={{ padding: 0, marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <table className="fd-table">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                  <th style={{ minWidth: '240px' }}>Item / Ingredient</th>
                  <th style={{ width: '100px' }}>Qty</th>
                  <th style={{ width: '100px' }}>UOM</th>
                  <th style={{ width: '120px' }}>Rate</th>
                  <th style={{ width: '120px' }}>Amount</th>
                  <th>Account</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>{idx + 1}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ position: 'relative' }}>
                          <select
                            style={{ width: '100%', height: '36px', padding: '0 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', appearance: 'none', background: '#fff' }}
                            value={row.ingredientId}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '__manual__') updateItem(idx, { ingredientId: '', name: '' });
                              else updateItem(idx, { ingredientId: val });
                            }}
                          >
                            <option value="">— Select ingredient —</option>
                            {ingredients.map(ing => (
                              <option key={ing._id} value={ing._id}>{ing.name} ({ing.unit})</option>
                            ))}
                            <option value="__manual__">✏ Type manually</option>
                          </select>
                          <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '11px', color: '#94a3b8', pointerEvents: 'none' }} />
                        </div>
                        {!row.ingredientId && (
                          <input
                            style={{ height: '32px', fontSize: '12px', padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                            value={row.name}
                            placeholder="Type item name..."
                            onChange={(e) => updateItem(idx, { name: e.target.value })}
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        style={{ width: '100%', height: '36px', textAlign: 'right', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 10px' }}
                        value={row.qty} 
                        onChange={(e) => updateItem(idx, { qty: e.target.value })} 
                      />
                    </td>
                    <td>
                      <input 
                        style={{ width: '100%', height: '36px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 6px', fontSize: '12px' }}
                        value={row.uom} 
                        onChange={(e) => updateItem(idx, { uom: e.target.value })} 
                        placeholder="kg/ltr" 
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        style={{ width: '100%', height: '36px', textAlign: 'right', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 10px' }}
                        value={row.rate} 
                        onChange={(e) => updateItem(idx, { rate: e.target.value })} 
                      />
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>
                      {row.amount.toFixed(2)}
                    </td>
                    <td>
                      <input 
                        style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 10px', fontSize: '12px' }}
                        value={row.accountHead} 
                        onChange={(e) => updateItem(idx, { accountHead: e.target.value })} 
                        placeholder="Account..." 
                      />
                    </td>
                    <td>
                      <button 
                        className="fd-modal-close" 
                        style={{ width: '28px', height: '28px', background: '#fef2f2', color: '#dc2626' }}
                        onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px', background: '#f8fafc' }}>
              <button 
                className="fd-action-btn ghost" 
                style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', background: '#fff' }}
                onClick={() => setItems((prev) => [...prev, emptyItem()])}
              >
                <Plus size={16} />
                <span>Add Another Item</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="fd-form-row">
                  <label><CreditCard size={12} style={{ marginRight: 6 }} />Payment Mode</label>
                  <select 
                    style={{ height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank</option>
                    <option value="fonepay">Fonepay</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div className="fd-form-row">
                  <label><FileText size={12} style={{ marginRight: 6 }} />Status</label>
                  <select 
                    style={{ height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                    value={paymentStatus} 
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid_credit">Unpaid / Credit</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="fd-form-row">
                  <label>Discount Type</label>
                  <select 
                    style={{ height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 10px' }}
                    value={discountType} 
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="amount">Fixed</option>
                    <option value="percent">Percent (%)</option>
                  </select>
                </div>
                <div className="fd-form-row">
                  <label>Discount Value</label>
                  <input 
                    type="number" 
                    className="fd-date-input" 
                    style={{ height: '40px' }}
                    value={discountValue} 
                    onChange={(e) => setDiscountValue(e.target.value)} 
                  />
                </div>
                <div className="fd-form-row">
                  <label>Tax (%)</label>
                  <input 
                    type="number" 
                    className="fd-date-input" 
                    style={{ height: '40px' }}
                    value={taxRate} 
                    onChange={(e) => setTaxRate(e.target.value)} 
                  />
                </div>
              </div>

              <div className="fd-form-row">
                <label>Remarks / Notes</label>
                <textarea 
                  className="fd-date-input"
                  style={{ height: '80px', padding: '12px' }}
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="Additional information about this purchase..."
                />
              </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '16px', padding: '24px', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                <Calculator size={18} color="#f5a524" />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Payment Summary</h4>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#94a3b8' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#fff' }}>Rs {totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#94a3b8' }}>
                  <span>Discount {discountType === 'percent' ? `(${discountValue}%)` : ''}</span>
                  <span style={{ color: '#ef4444' }}>- Rs {discountAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#94a3b8' }}>
                  <span>Tax ({taxRate}%)</span>
                  <span style={{ color: '#fff' }}>+ Rs {taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#94a3b8' }}>
                  <span>Round Off</span>
                  <input 
                    type="number" 
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px dashed #334155', color: '#fff', width: '60px', textAlign: 'right', outline: 'none' }}
                    value={roundOff} 
                    onChange={(e) => setRoundOff(e.target.value)} 
                  />
                </div>
                
                <div style={{ marginTop: '12px', paddingTop: '16px', borderTop: '2px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>Grand Total</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#f5a524' }}>Rs {estimatedGrandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {err && <div style={{ padding: '12px 24px', background: '#fef2f2', color: '#dc2626', fontSize: '13px', borderTop: '1px solid #fee2e2' }}>{err}</div>}

        <div className="fd-modal-form" style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', flexDirection: 'row', justifyContent: 'flex-end', gap: '12px', marginTop: 0 }}>
          <button className="fd-action-btn ghost" onClick={onClose} style={{ minWidth: '100px' }}>Cancel</button>
          <button 
            className="fd-action-btn primary" 
            onClick={handleSave} 
            disabled={saving}
            style={{ minWidth: '160px', height: '40px' }}
          >
            {saving ? 'Processing...' : 'Complete Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}
