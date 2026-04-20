import React from 'react';
import { formatMoney } from '../shared/formatMoney.js';

function Cell({ b }) {
  const x = b || { bank: 0, counter: 0, owner: 0, total: 0, creditDue: 0 };
  return (
    <>
      <td>{formatMoney(x.bank)}</td>
      <td>{formatMoney(x.counter)}</td>
      <td>{formatMoney(x.owner)}</td>
      <td>{formatMoney(x.total)}</td>
      <td>{(x.creditDue || 0) !== 0 ? formatMoney(x.creditDue) : '—'}</td>
    </>
  );
}

export default function DayBookGrid({ summary, totals }) {
  if (!summary || !totals) return <div className="finance-empty">No daybook data.</div>;

  const { totalReceiptsBuckets, totalPaymentsBuckets, netReceiptBuckets, openingBalanceBuckets, closingBalanceBuckets } =
    totals;

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
    <table className="finance-daybook-table">
      <thead>
        <tr>
          <th>PMT Accounts</th>
          <th>Bank Account</th>
          <th>Counter</th>
          <th>Owner&apos;s Account</th>
          <th>Total</th>
          <th>Credit (Due)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="section-label">
          <td colSpan={6}>Receipts</td>
        </tr>
        {rowsReceipt.map(({ key, label }) => (
          <tr key={key}>
            <td>{label}</td>
            <Cell b={summary[key]} />
          </tr>
        ))}
        <tr className="subtotal">
          <td>Total Receipts [A]</td>
          <Cell b={totalReceiptsBuckets} />
        </tr>

        <tr className="section-label">
          <td colSpan={6}>Payments</td>
        </tr>
        {rowsPay.map(({ key, label }) => (
          <tr key={key}>
            <td>{label}</td>
            <Cell b={summary[key]} />
          </tr>
        ))}
        <tr className="subtotal">
          <td>Total Payments [B]</td>
          <Cell b={totalPaymentsBuckets} />
        </tr>

        <tr className="net">
          <td>Net Receipt [C = A − B]</td>
          <Cell b={netReceiptBuckets} />
        </tr>

        <tr className="balance-row">
          <td>Opening balance (D)</td>
          <Cell b={openingBalanceBuckets} />
        </tr>
        <tr className="balance-row">
          <td>Closing Balance [E = C + D]</td>
          <Cell b={closingBalanceBuckets} />
        </tr>
      </tbody>
    </table>
  );
}
