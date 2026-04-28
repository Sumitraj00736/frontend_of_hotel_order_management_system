import React from 'react';
import { formatMoney, mergeInvoiceSettings } from './invoicePreviewUtils.js';

const InvoicePreviewCard = ({ preview, settings }) => {
  const config = mergeInvoiceSettings(settings);
  const columnCount =
    (config.showItemSN ? 1 : 0) +
    (config.showHSCode ? 1 : 0) +
    (config.showParticular ? 1 : 0) +
    (config.showRate ? 1 : 0) +
    (config.showQty ? 1 : 0) +
    (config.showAmount ? 1 : 0);

  const summaryRows = [
    config.showItemTotal && { label: 'Item Total', value: formatMoney(preview.itemTotal) },
    config.showSubTotal && { label: 'Sub Total', value: formatMoney(preview.subtotal) },
    config.showDiscount && preview.discountAmount > 0 && {
      label: `Discount${preview.discountType === 'percent' ? ` (${preview.discountValue}%)` : ''}`,
      value: formatMoney(preview.discountAmount)
    },
    config.showTaxableAmount && { label: 'Taxable Amount', value: formatMoney(preview.taxableAmount) },
    config.showTax && preview.taxRate > 0 && {
      label: `Tax (${preview.taxRate}%)`,
      value: formatMoney(preview.taxAmount)
    },
    config.showRoundOff && preview.roundOff !== 0 && { label: 'Round Off', value: formatMoney(preview.roundOff) },
    config.showTip && preview.tipsAmount > 0 && { label: 'Tip', value: formatMoney(preview.tipsAmount) },
    config.showGrandTotal && { label: 'Net Amount', value: formatMoney(preview.grandTotal), strong: true }
  ].filter(Boolean);

  return (
    <div className="invoice-preview-card" style={{ fontSize: `${config.fontSize || 9}px` }}>
      <div className="invoice-preview-head">
        {preview.logoUrl ? <img className="invoice-preview-logo" src={preview.logoUrl} alt={preview.legalName || 'logo'} /> : null}
        <div className="invoice-preview-title">{preview.title}</div>
        {preview.legalName ? <div className="invoice-preview-legal">{preview.legalName}</div> : null}
        {preview.address ? <div className="invoice-preview-muted">{preview.address}</div> : null}
        {preview.contactNumber || preview.taxNumber ? (
          <div className="invoice-preview-muted">
            {[preview.contactNumber, preview.taxNumber && `PAN/VAT: ${preview.taxNumber}`].filter(Boolean).join(' • ')}
          </div>
        ) : null}
      </div>

      <div className="invoice-preview-topline">
        <div>
          {config.showEstimateNumber ? <div><strong>Estimate No:</strong> {preview.estimateNo}</div> : null}
          {config.showInvoiceNo ? <div><strong>Invoice No:</strong> {preview.invoiceNo}</div> : null}
        </div>
        <div className="invoice-preview-right">
          {config.showDate ? <div><strong>Date:</strong> {preview.dateLabel}</div> : null}
          {config.showTime ? <div><strong>Time:</strong> {preview.timeLabel}</div> : null}
        </div>
      </div>

      <div className="invoice-preview-meta">
        {preview.orderType === 'delivery' || preview.orderType === 'takeaway' ? (
          <>
            {config.showOrderType ? <div><strong>Type:</strong> {preview.orderType.replace('_', ' ')}</div> : null}
            <div><strong>Customer:</strong> {preview.customerLabel}</div>
            {config.showEstimateDetails && preview.customerPhone ? <div><strong>Number:</strong> {preview.customerPhone}</div> : null}
            {config.showEstimateDetails && preview.deliveryAddress ? <div><strong>Address:</strong> {preview.deliveryAddress}</div> : null}
            {config.showEstimateDetails && preview.deliveryPlatform ? <div><strong>Platform:</strong> {preview.deliveryPlatform}</div> : null}
          </>
        ) : (
          <>
            <div><strong>Dine In:</strong> {preview.dineInLabel}</div>
            <div><strong>Customer:</strong> {preview.customerLabel}</div>
            {config.showOrderType ? <div><strong>Order Type:</strong> {preview.orderType.replace('_', ' ')}</div> : null}
          </>
        )}
        <div><strong>Waiter:</strong> {preview.waiterLabel}</div>
        <div><strong>Kitchen:</strong> {preview.kitchenLabel}</div>
      </div>

      <div className="invoice-preview-items">
        <div className="invoice-preview-row invoice-preview-head-row" style={{ gridTemplateColumns: `repeat(${columnCount || 1}, minmax(0, 1fr))` }}>
          {config.showItemSN ? <span>S.N</span> : null}
          {config.showHSCode ? <span>HS Code</span> : null}
          {config.showParticular ? <span>Particular</span> : null}
          {config.showRate ? <span>Rate</span> : null}
          {config.showQty ? <span>QTY</span> : null}
          {config.showAmount ? <span>Amount</span> : null}
        </div>

        {preview.items.map((item) => (
          <div key={item.id} className="invoice-preview-row" style={{ gridTemplateColumns: `repeat(${columnCount || 1}, minmax(0, 1fr))` }}>
            {config.showItemSN ? <span>{item.sn}</span> : null}
            {config.showHSCode ? <span>{item.hsCode}</span> : null}
            {config.showParticular ? <span>{item.particular}</span> : null}
            {config.showRate ? <span>{item.rate}</span> : null}
            {config.showQty ? <span>{item.qty}</span> : null}
            {config.showAmount ? <span>{item.amount}</span> : null}
          </div>
        ))}
      </div>

      <div className="invoice-preview-summary">
        {summaryRows.map((row) => (
          <div key={row.label} className={`invoice-preview-summary-row ${row.strong ? 'strong' : ''}`}>
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>

      <div className="invoice-preview-footer-meta">
        {config.showInWords ? <div className="invoice-preview-words">{preview.inWords}</div> : null}
        {config.showPaymentMode ? <div><strong>Payment Mode:</strong> {preview.paymentModeLabel}</div> : null}
        {config.showKotNumber ? <div><strong>KOT No:</strong> {preview.kotNumber}</div> : null}
        {config.showAssign ? <div><strong>Assign:</strong> {preview.assignLabel}</div> : null}
        {config.showBilledBy ? <div><strong>Billed By:</strong> {preview.billedBy}</div> : null}
        {config.showServiceDuration ? <div><strong>Service Duration:</strong> {preview.serviceDuration}</div> : null}
        {config.showTenderAmount ? <div><strong>Tender Amount:</strong> {formatMoney(preview.tenderAmount)}</div> : null}
      </div>

      {preview.qrEnabled && preview.qrImageUrl ? (
        <div className="invoice-preview-qr">
          <img src={preview.qrImageUrl} alt={preview.qrFileName || 'QR'} />
          {preview.qrFileName ? <div>{preview.qrFileName}</div> : null}
        </div>
      ) : null}

      <div className="invoice-preview-note">This is not a Tax Invoice!</div>
      {preview.footerRemarks ? <div className="invoice-preview-remarks">{preview.footerRemarks}</div> : null}
      <div className="invoice-preview-thanks">{preview.footerHeader}</div>
    </div>
  );
};

export default InvoicePreviewCard;
