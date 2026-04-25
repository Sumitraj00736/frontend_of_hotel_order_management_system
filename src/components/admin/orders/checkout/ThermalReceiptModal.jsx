import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Download, Printer, X } from 'lucide-react';

// ─── Currency to Words ────────────────────────────────────────────────────────
const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convert = (n) => {
    if (n === 0) return '';
    if (n < 10)  return ones[n];
    if (n < 20)  return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return 'Amount too large';
  };

  if (!num || num === 0) return 'Zero Nepalese Rupee Only';
  return `${convert(Math.floor(num))} Nepalese Rupee Only`;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ThermalReceiptModal = ({
  order,
  isOpen,
  onClose,
  storeName,
  storePhone,
}) => {
  const receiptRef = useRef();

  if (!isOpen || !order) return null;

  // ── Safe data extraction ──────────────────────────────────────────────────
  const items        = order.items || [];
  const total        = order.totalAmount ?? order.total ?? order.grandTotal ?? 0;
  const invoiceNo    = order.invoiceNo  || order.invoiceId || order._id?.slice(-6) || '-';
  const customerName = order.customerName || 'Cash Customer';
  const orderType    = order.orderType   || 'dine_in';
  const tableNo      = order.table?.tableNumber;

  const totalItems   = items.length;
  const totalQty     = items.reduce((s, i) => s + (i.quantity || 0), 0);

  const deliveryLabel =
    orderType === 'delivery'  ? 'Delivery'  :
    orderType === 'takeaway'  ? 'Takeaway'  :
    orderType === 'pickup'    ? 'Pickup'    :
    tableNo                   ? `Table ${tableNo}` :
    customerName;

  // ── Print (no dependency needed) ─────────────────────────────────────────
  const handlePrint = () => {
    const content = receiptRef.current?.innerHTML || '';
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to print.'); return; }
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${invoiceNo}</title>
  <style>
    @page { size: 80mm auto; margin: 0; }
    body { font-family: 'Courier New', monospace; width: 80mm; padding: 6mm; margin: 0; font-size: 11px; color: #000; }
    h2,h3,h4,h5 { margin: 0 0 4px; }
    .center { text-align: center; }
    .bold   { font-weight: bold; }
    .muted  { color: #555; }
    .row    { display: flex; justify-content: space-between; margin: 3px 0; }
    table   { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 11px; }
    th      { border-bottom: 1px dashed #000; padding: 3px 0; text-align: left; }
    td      { padding: 3px 0; vertical-align: top; }
    .dash   { border-top: 1px dashed #000; margin: 6px 0; }
    .no-print { display: none !important; }
  </style>
</head>
<body onload="window.print();window.close()">
  ${content}
</body>
</html>`);
    win.document.close();
  };

  // ── Download as image (no external lib) ──────────────────────────────────
  const handleDownload = () => {
    // Fallback: open print dialog targeted at saving
    handlePrint();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return createPortal(
    <div className="trm-overlay" onClick={onClose}>
      <div className="trm-modal" onClick={e => e.stopPropagation()}>

        {/* ── Close ── */}
        <button className="trm-close" onClick={onClose}><X size={18} /></button>

        {/* ── Header ── */}
        <div className="trm-success-header">
          <div className="trm-check-circle">
            <CheckCircle2 size={44} color="#22c55e" />
          </div>
          <h3 className="trm-success-title">Successful Checkout</h3>
        </div>

        {/* ── Paper ── */}
        <div className="trm-scroll-area">
          <div className="trm-paper" ref={receiptRef}>

            {/* Store branding */}
            <div className="center" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{storeName}</div>
              <div style={{ color: '#64748b', fontSize: 13 }}>{storePhone}</div>
            </div>

            <div className="center" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, letterSpacing: '0.12em', fontSize: 14 }}>
                ESTIMATE INVOICE
              </div>
            </div>

            {/* Meta Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
              <span><span style={{ color: '#94a3b8' }}>Invoice No: </span><strong>{invoiceNo}</strong></span>
              <span style={{ color: '#f5a524', fontWeight: 600 }}>
                Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              </span>
            </div>
            <div style={{ marginBottom: 12, fontSize: 13 }}>
              <span style={{ color: '#94a3b8' }}>Delivery: </span>
              <strong>{deliveryLabel}</strong>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', marginBottom: 8 }}>
              <thead>
                <tr>
                  <th style={{ paddingBottom: 8, borderBottom: '1px dashed #e2e8f0', color: '#64748b', fontWeight: 600 }}>Particular</th>
                  <th style={{ paddingBottom: 8, borderBottom: '1px dashed #e2e8f0', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Rate</th>
                  <th style={{ paddingBottom: 8, borderBottom: '1px dashed #e2e8f0', color: '#64748b', fontWeight: 600, textAlign: 'center' }}>QTY</th>
                  <th style={{ paddingBottom: 8, borderBottom: '1px dashed #e2e8f0', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((item, idx) => {
                  const price = item.variantPrice || item.priceAtOrderTime || 0;
                  const qty   = item.quantity || 1;
                  const name  = item.menuItem?.name || item.name || 'Item';
                  const variant = item.variantName ? ` - ${item.variantName}` : '';
                  return (
                    <tr key={idx}>
                      <td style={{ padding: '10px 0', borderBottom: '1px dashed #f1f5f9' }}>{name}{variant}</td>
                      <td style={{ padding: '10px 0', borderBottom: '1px dashed #f1f5f9', textAlign: 'right' }}>{price}</td>
                      <td style={{ padding: '10px 0', borderBottom: '1px dashed #f1f5f9', textAlign: 'center' }}>{qty}</td>
                      <td style={{ padding: '10px 0', borderBottom: '1px dashed #f1f5f9', textAlign: 'right' }}>{price * qty}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 12, color: '#94a3b8' }}>No items</td></tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <strong>Total (Particular/QTY)</strong>
                <span><strong>{totalItems}/{totalQty}</strong></span>
                <strong>Rs {total}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginTop: 8, paddingTop: 6, borderTop: '1px dashed #cbd5e1' }}>
                <span>Total Amount</span>
                <span>Rs {total}</span>
              </div>
            </div>

            {/* Amount in words */}
            <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: 10, paddingTop: 8, color: '#64748b', fontSize: 12, fontStyle: 'italic' }}>
              {numberToWords(total)}
            </div>

          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="trm-actions">
          <button className="trm-btn" onClick={handleDownload}>
            <Download size={16} /> Download
          </button>
          <button className="trm-btn trm-btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Bill
          </button>
        </div>

      </div>

      {/* ── Scoped Styles ── */}
      <style>{`
        .trm-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(6px);
          padding: 16px;
        }
        .trm-modal {
          background: #fff;
          width: 100%; max-width: 480px;
          border-radius: 16px;
          padding: 32px 28px 24px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          animation: trmIn 0.35s cubic-bezier(0.16,1,0.3,1);
          max-height: 90vh;
          display: flex; flex-direction: column;
        }
        @keyframes trmIn {
          from { transform: scale(0.9) translateY(24px); opacity: 0; }
          to   { transform: scale(1)   translateY(0);    opacity: 1; }
        }
        .trm-close {
          position: absolute; top: 14px; right: 14px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: 5px 7px;
          cursor: pointer; line-height: 1;
        }
        .trm-success-header { text-align: center; margin-bottom: 20px; }
        .trm-check-circle {
          width: 72px; height: 72px; border-radius: 50%;
          background: #f0fdf4;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
        }
        .trm-success-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; }
        .trm-scroll-area {
          background: #f8fafc; border-radius: 10px;
          padding: 16px; overflow-y: auto;
          flex: 1; margin-bottom: 16px;
        }
        .trm-paper {
          background: #fff;
          padding: 24px 20px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          color: #1a1a1a;
        }
        .trm-actions {
          display: flex; gap: 10px;
        }
        .trm-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px; border-radius: 10px;
          border: 1px solid #e2e8f0; background: #f8fafc;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.15s;
        }
        .trm-btn:hover { background: #f1f5f9; }
        .trm-btn-primary {
          background: #f5a524; border-color: #f5a524; color: #fff;
        }
        .trm-btn-primary:hover { background: #e09415; border-color: #e09415; }
        .center { text-align: center; }
      `}</style>
    </div>,
    document.body
  );
};

export default ThermalReceiptModal;
