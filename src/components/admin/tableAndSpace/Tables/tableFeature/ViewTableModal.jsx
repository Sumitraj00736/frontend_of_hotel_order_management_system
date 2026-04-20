import React, { useMemo, useState } from 'react';
import { X, Copy, ExternalLink, Pencil } from 'lucide-react';
import QrCodeCard from './qr/QrCodeCard.jsx';

export default function ViewTableModal({ open, onClose, table, qrMeta, onEdit }) {
  const [tab, setTab] = useState('qr');
  if (!open || !table) return null;

  const typeName =
    table.tableTypeId?.name || (typeof table.type === 'string' ? table.type : '') || 'Table';
  const title = `${typeName} - ${table.name || `Table ${table.tableNumber}`}`;

  const url = useMemo(() => {
    const item = qrMeta?.items?.find((i) => String(i.tableId) === String(table._id));
    return item?.url || '';
  }, [qrMeta, table._id]);

  const copy = async () => {
    if (!url) return;
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
  };

  return (
    <div className="tables-modal-backdrop" onClick={onClose}>
      <div className="tables-modal" style={{ width: 'min(820px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <div>
            <h5 style={{ marginBottom: 6 }}>{title}</h5>
            <div className="text-muted small">Table Capacity&nbsp; {table.capacity ?? '-'} &nbsp;•&nbsp; Status&nbsp; {table.status}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-outline-light" onClick={onEdit}>
              <Pencil size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Edit
            </button>
            <button type="button" className="btn btn-outline-light" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, background: '#fff' }}>
          <div className="row g-2">
            <div className="col-6">
              <div className="text-muted small">Table Capacity</div>
              <div style={{ fontWeight: 700 }}>{table.capacity ?? '-'}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Table Type</div>
              <div style={{ fontWeight: 700 }}>{typeName}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Space</div>
              <div style={{ fontWeight: 700 }}>{table.spaceId?.name || '-'}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Table Status</div>
              <div style={{ fontWeight: 700, color: table.status === 'occupied' ? '#f59e0b' : '#16a34a' }}>
                {table.status === 'occupied' ? 'Occupied' : 'Open'}
              </div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Charge</div>
              <div style={{ fontWeight: 700 }}>{table.charge ?? '-'}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Available</div>
              <div style={{ fontWeight: 700 }}>{table.active === false ? 'No' : 'Yes'}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="text-muted small" style={{ marginBottom: 8 }}>
            Share table link
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input className="form-control" value={url} readOnly style={{ minWidth: 320, flex: 1 }} />
            <button type="button" className="btn btn-outline-light" onClick={copy} disabled={!url}>
              <Copy size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Copy
            </button>
            <button type="button" className="btn btn-primary" onClick={() => window.open(url, '_blank')} disabled={!url}>
              <ExternalLink size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Open Link
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            type="button"
            className={`btn ${tab === 'qr' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setTab('qr')}
          >
            QR Code
          </button>
          <button
            type="button"
            className={`btn ${tab === 'activity' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setTab('activity')}
          >
            Activity
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {tab === 'qr' ? (
            <QrCodeCard url={url} labelTop="RestroX" labelBottom={table.name || `Table ${table.tableNumber}`} />
          ) : (
            <div style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 14, background: '#fff' }}>
              <div className="text-muted">No activity yet.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

