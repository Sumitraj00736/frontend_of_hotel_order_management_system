import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchGuestMenu, fetchGuestStatus, createGuestOrder } from '../api/guest.js';

const GuestTablePage = () => {
  const { tableId } = useParams();
  const [params] = useSearchParams();
  const branchId = params.get('branchId');
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState(null);
  const [cart, setCart] = useState({});
  const [guestName, setGuestName] = useState('');
  const [note, setNote] = useState('');
  const [spice, setSpice] = useState('medium');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [m, s] = await Promise.all([fetchGuestMenu(branchId), fetchGuestStatus(tableId, branchId)]);
    setMenu(m.data);
    setStatus(s.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [tableId]);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };
  const removeFromCart = (id) => {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return next;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const placeOrder = async () => {
    const items = Object.entries(cart).map(([menuItem, quantity]) => ({ menuItem, quantity }));
    if (items.length === 0) return alert('Add at least one item.');
    try {
      await createGuestOrder({ table: tableId, items, guestName, specialInstructions: note, spiceLevel: spice }, branchId);
      setCart({});
      setNote('');
      await loadData();
      alert('Order placed! A staff member will confirm it shortly.');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="guest-page">
      <div className="guest-hero">
        <div>
          <div className="eyebrow">Self-order</div>
          <h2 className="mb-1">Table {status?.table?.tableNumber || '...'}</h2>
          <div className="text-muted small">Add items and submit. We’ll keep you updated.</div>
        </div>
        <div className="guest-meta">
          <div className="pill-blue">Status: {status?.table?.status || '...'}</div>
          <div className="pill">Active orders: {status?.activeOrders?.length || 0}</div>
        </div>
      </div>

      <div className="guest-body">
        <div className="menu-list">
          {loading && <div>Loading menu...</div>}
          {!loading &&
            menu.map((item) => (
              <div key={item._id} className="menu-card">
                <div className="fw-semibold">{item.name}</div>
                <div className="text-muted tiny-text">{item.category}</div>
                <div className="fw-bold">NPR {item.price}</div>
                <div className="d-flex gap-2 align-items-center mt-2">
                  <button className="btn btn-sm btn-outline-light" onClick={() => removeFromCart(item._id)}>-</button>
                  <span>{cart[item._id] || 0}</span>
                  <button className="btn btn-sm btn-primary" onClick={() => addToCart(item._id)}>+</button>
                </div>
              </div>
            ))}
        </div>

        <div className="soft-card guest-form">
          <h5>Review & Submit</h5>
          <div className="mb-2">
            <label className="form-label">Your name (optional)</label>
            <input className="form-control" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="form-label">Spice level</label>
            <select className="form-select" value={spice} onChange={(e) => setSpice(e.target.value)}>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="spicy">Spicy</option>
              <option value="extra_spicy">Extra Spicy</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Special instructions</label>
            <textarea className="form-control" rows="3" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="fw-semibold">Items: {Object.keys(cart).length}</div>
            <button className="btn btn-primary" onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestTablePage;
