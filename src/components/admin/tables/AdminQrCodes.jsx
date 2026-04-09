import React, { useMemo } from 'react';
import '../../../common/css/admin/tables/tables.css';

const AdminQrCodes = ({ qrData, search, setSearch }) => {
  const items = qrData?.items || [];
  const filtered = useMemo(() => {
    return items.filter((t) =>
      `${t.name || ''} ${t.tableNumber || ''} ${t.type || ''}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name || 'qr.png';
    link.click();
  };

  return (
    <div className="card glass-card full-width-card tables-panel">
      <div className="tables-header">
        <div>
          <h4 className="mb-1">QR Codes</h4>
          <div className="text-muted small">Download QR codes for tables</div>
        </div>
        <div className="tables-actions">
          <input className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={() => filtered.forEach((t) => handleDownload(getQrUrl(t), `${t.name || t.tableNumber}.png`))}>
            Download All QR
          </button>
        </div>
      </div>

      <div className="qr-grid">
        {filtered.map((t) => (
          <div key={t.tableId} className="qr-card">
            <div className="qr-title">{t.name || `Table ${t.tableNumber}`}</div>
            <div className="qr-image">
              <img src={getQrUrl(t)} alt="QR" />
            </div>
            <div className="qr-actions">
              <button className="btn btn-sm btn-outline-light" onClick={() => navigator.clipboard.writeText(t.url)}>Copy Link</button>
              <button className="btn btn-sm btn-primary" onClick={() => handleDownload(getQrUrl(t), `${t.name || t.tableNumber}.png`)}>Download</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="tables-empty">No QR codes found</div>}
      </div>
    </div>
  );
};

const getQrUrl = (t) => {
  const data = encodeURIComponent(t.url);
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data}`;
};

export default AdminQrCodes;
