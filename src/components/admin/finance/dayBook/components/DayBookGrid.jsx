import React from 'react';
import { formatMoney } from '../../shared/formatMoney.js';

const Cell = ({ b, isBold = false }) => {
  const x = b || { bank: 0, counter: 0, owner: 0, total: 0, creditDue: 0 };
  const style = isBold ? { fontWeight: 700, color: '#0f172a' } : {};
  
  return (
    <>
      <td style={style}>{formatMoney(x.bank)}</td>
      <td style={style}>{formatMoney(x.counter)}</td>
      <td style={style}>{formatMoney(x.owner)}</td>
      <td style={{ ...style, color: '#f5a524' }}>{formatMoney(x.total)}</td>
      <td style={{ ...style, color: (x.creditDue || 0) !== 0 ? '#dc2626' : '#94a3b8' }}>
        {(x.creditDue || 0) !== 0 ? formatMoney(x.creditDue) : '—'}
      </td>
    </>
  );
};

const DayBookGrid = ({ summary, totals }) => {
  if (!summary || !totals) return <div className="fd-empty">No daybook data available for this date.</div>;

  const { 
    totalReceiptsBuckets, 
    totalPaymentsBuckets, 
    netReceiptBuckets, 
    openingBalanceBuckets, 
    closingBalanceBuckets 
  } = totals;

  const rowsReceipt = [
    { key: 'netSales', label: 'Net Sales' },
    { key: 'purchaseReturn', label: 'Purchase Return' },
    { key: 'paymentIn', label: 'Payment In' },
    { key: 'income', label: 'Income' },
    { key: 'balanceTransferIn', label: 'Balance T/F (IN)' }
  ];

  const rowsPay = [
    { key: 'purchase', label: 'Purchase' },
    { key: 'salesReturn', label: 'Sales Return' },
    { key: 'paymentOut', label: 'Payment Out' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'balanceTransferOut', label: 'Balance T/F (OUT)' }
  ];

  return (
    <div className="fd-table-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="fd-table">
          <thead>
            <tr>
              <th style={{ width: '220px' }}>PMT Accounts</th>
              <th>Bank Account</th>
              <th>Counter</th>
              <th>Owner's Account</th>
              <th>Total</th>
              <th>Credit (Due)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#f8fafc' }}>
              <td colSpan={6} style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 16px' }}>
                Receipts
              </td>
            </tr>
            {rowsReceipt.map(({ key, label }) => (
              <tr key={key}>
                <td style={{ fontWeight: 600, color: '#334155' }}>{label}</td>
                <Cell b={summary[key]} />
              </tr>
            ))}
            <tr style={{ background: '#f0fdf4' }}>
              <td style={{ fontWeight: 800, color: '#16a34a' }}>Total Receipts [A]</td>
              <Cell b={totalReceiptsBuckets} isBold />
            </tr>

            <tr style={{ background: '#f8fafc' }}>
              <td colSpan={6} style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 16px' }}>
                Payments
              </td>
            </tr>
            {rowsPay.map(({ key, label }) => (
              <tr key={key}>
                <td style={{ fontWeight: 600, color: '#334155' }}>{label}</td>
                <Cell b={summary[key]} />
              </tr>
            ))}
            <tr style={{ background: '#fef2f2' }}>
              <td style={{ fontWeight: 800, color: '#dc2626' }}>Total Payments [B]</td>
              <Cell b={totalPaymentsBuckets} isBold />
            </tr>

            <tr style={{ background: '#fffbeb' }}>
              <td style={{ fontWeight: 800, color: '#d97706' }}>Net Receipt [C = A − B]</td>
              <Cell b={netReceiptBuckets} isBold />
            </tr>

            <tr style={{ borderTop: '2px solid #f1f5f9' }}>
              <td style={{ fontWeight: 600, color: '#64748b' }}>Opening balance (D)</td>
              <Cell b={openingBalanceBuckets} />
            </tr>
            <tr style={{ background: '#f5a52410', borderTop: '1px solid #f5a52420' }}>
              <td style={{ fontWeight: 800, color: '#f5a524' }}>Closing Balance [E = C + D]</td>
              <Cell b={closingBalanceBuckets} isBold />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DayBookGrid;
