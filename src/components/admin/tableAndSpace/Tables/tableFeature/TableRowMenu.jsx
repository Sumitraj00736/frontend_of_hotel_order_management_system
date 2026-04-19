import React, { useEffect, useRef, useState } from 'react';
import { Eye, Pencil, Trash2, MoreVertical } from 'lucide-react';

export default function TableRowMenu({ onView, onEdit, onTrash }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', justifyContent: 'flex-end' }}>
      <button
        type="button"
        className="btn btn-sm btn-outline-light"
        onClick={() => setOpen((v) => !v)}
        aria-label="Row actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 18px 40px rgba(15,23,42,0.10)',
            overflow: 'hidden',
            minWidth: 180,
            zIndex: 50
          }}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onView?.();
            }}
            style={{ width: '100%', textAlign: 'left', padding: '12px 12px', border: 'none', background: 'transparent' }}
          >
            <Eye size={16} style={{ marginRight: 10, verticalAlign: 'middle' }} /> View Table
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
            style={{ width: '100%', textAlign: 'left', padding: '12px 12px', border: 'none', background: 'transparent' }}
          >
            <Pencil size={16} style={{ marginRight: 10, verticalAlign: 'middle' }} /> Edit Table
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onTrash?.();
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 12px',
              border: 'none',
              background: 'transparent',
              color: '#dc2626'
            }}
          >
            <Trash2 size={16} style={{ marginRight: 10, verticalAlign: 'middle' }} /> Move to trash
          </button>
        </div>
      )}
    </div>
  );
}

