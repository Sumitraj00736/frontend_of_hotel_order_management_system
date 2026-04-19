import React, { useMemo } from 'react';

// Lightweight placeholder QR until we add a QR library.
export default function QrCodeCard({ url, labelTop, labelBottom }) {
  const payload = useMemo(() => ({ url, labelTop, labelBottom }), [url, labelTop, labelBottom]);

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, background: '#fff' }}>
      <div style={{ textAlign: 'center', fontWeight: 700, marginBottom: 8 }}>{labelTop || 'RestroX'}</div>
      <div
        style={{
          width: 240,
          height: 240,
          margin: '0 auto',
          borderRadius: 12,
          background: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          textAlign: 'center',
          fontSize: 12,
          color: '#334155'
        }}
        title={url}
      >
        QR placeholder
        <br />
        {url}
      </div>
      <div style={{ textAlign: 'center', marginTop: 10, fontWeight: 700 }}>{labelBottom || ''}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10 }}>
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => {
            if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url);
          }}
        >
          Copy link
        </button>
        <button type="button" className="btn btn-primary" onClick={() => window.open(url, '_blank')}>
          Open Link
        </button>
      </div>
      <pre style={{ marginTop: 10, fontSize: 11, color: '#64748b', overflow: 'auto' }}>
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}

