import React, { useEffect, useMemo, useState } from 'react';
import { ImageUp, Minus, Plus } from 'lucide-react';
import { uploadToCloudinary } from '../../../../api/upload.js';
import InvoicePreviewCard from './InvoicePreviewCard.jsx';
import {
  buildInvoicePreviewData,
  DEFAULT_INVOICE_SETTINGS,
  mergeInvoiceSettings
} from './invoicePreviewUtils.js';

const headingFields = [
  { key: 'showEstimateDetails', label: 'Detail For Estimate' },
  { key: 'showEstimateNumber', label: 'Estimate Number' },
  { key: 'showInvoiceNo', label: 'Invoice No' },
  { key: 'showDate', label: 'Date' },
  { key: 'showOrderType', label: 'Order Type' },
  { key: 'showTime', label: 'Time' }
];

const lineFields = [
  { key: 'showItemSN', label: 'S.N' },
  { key: 'showHSCode', label: 'HS Code' },
  { key: 'showParticular', label: 'Particular' },
  { key: 'showRate', label: 'Rate' },
  { key: 'showQty', label: 'QTY' },
  { key: 'showAmount', label: 'Amount' }
];

const subtotalFields = [
  { key: 'showItemTotal', label: 'Item Total' },
  { key: 'showSubTotal', label: 'Sub Total' },
  { key: 'showDiscount', label: 'Discount' },
  { key: 'showTaxableAmount', label: 'Taxable Amount' },
  { key: 'showTax', label: 'Tax' },
  { key: 'showRoundOff', label: 'Round Off' },
  { key: 'showTip', label: 'Tip' },
  { key: 'showGrandTotal', label: 'Grand Total' }
];

const footerFields = [
  { key: 'showPaymentMode', label: 'Payment Mode' },
  { key: 'showBilledBy', label: 'Billed By' },
  { key: 'showKotNumber', label: 'KOT Number' },
  { key: 'showAssign', label: 'Assign' },
  { key: 'showTenderAmount', label: 'Tender Amount' },
  { key: 'showInWords', label: 'In Words' },
  { key: 'showServiceDuration', label: 'Service Duration' }
];

const sampleOrder = {
  invoiceNo: '##',
  kotNo: '48',
  createdAt: '2025-11-24T11:10:00.000Z',
  orderType: 'dine_in',
  table: { tableNumber: 1 },
  customerName: 'Nischal',
  customerPhone: '9779844736540',
  createdBy: { name: 'Aakash Acharya' },
  kitchenAssigned: { name: 'Kitchen A' },
  assignedStaff: { name: 'Laxmi' },
  paymentMethod: 'Bank Transfer',
  tenderAmount: 2100,
  items: [
    { _id: '1', menuItem: { name: 'Chicken Cheese Pizza' }, quantity: 1, priceAtOrderTime: 680, hsCode: '1001' },
    { _id: '2', menuItem: { name: 'Dry Mix' }, quantity: 1, priceAtOrderTime: 350, hsCode: '1002' },
    { _id: '3', menuItem: { name: 'Veg Organic Thali' }, quantity: 1, priceAtOrderTime: 490, hsCode: '1003' },
    { _id: '4', menuItem: { name: 'Burger - Veg' }, quantity: 1, priceAtOrderTime: 180, hsCode: '1004' }
  ]
};

const sampleSummary = {
  subtotal: 1700,
  discountType: 'percent',
  discountValue: 10.21,
  taxableAmount: 1474.07,
  taxRate: 0,
  taxAmount: 0,
  roundOff: 30,
  tipsAmount: 500,
  total: 1793.63,
  tenderAmount: 2100,
  paymentStatus: 'paid',
  payments: [
    { method: 'Bank Transfer', amount: 1000 },
    { method: 'Bank Transfer', amount: 1000 }
  ],
  customerName: 'Nischal',
  assignedStaffId: 'staff-preview'
};

const ToggleChip = ({ label, checked, onChange }) => (
  <button
    type="button"
    className={`invoice-toggle-chip ${checked ? 'active' : ''}`}
    onClick={() => onChange(!checked)}
  >
    <span className="invoice-toggle-box">{checked ? '✓' : ''}</span>
    <span>{label}</span>
  </button>
);

const UploadField = ({ label, value, onUpload }) => (
  <label className="invoice-upload-field">
    <span className="field-label">{label}</span>
    <span className="invoice-upload-box">
      <ImageUp size={18} />
      <span>{value ? 'Replace uploaded image' : 'Click here to upload your image'}</span>
    </span>
    <input type="file" accept="image/*" hidden onChange={(e) => onUpload?.(e.target.files?.[0])} />
  </label>
);

const InvoiceSetting = ({ value, onSave }) => {
  const [form, setForm] = useState(mergeInvoiceSettings(value || DEFAULT_INVOICE_SETTINGS));
  const [uploading, setUploading] = useState({ logo: false, qr: false });

  useEffect(() => {
    setForm(mergeInvoiceSettings(value || DEFAULT_INVOICE_SETTINGS));
  }, [value]);

  const update = (patch) => setForm((prev) => mergeInvoiceSettings({ ...prev, ...patch }));

  const handleUpload = async (file, key) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const url = await uploadToCloudinary(file);
      if (key === 'logo') {
        update({ logoUrl: url });
      } else {
        update({ qrImageUrl: url });
      }
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const preview = useMemo(
    () =>
      buildInvoicePreviewData({
        order: sampleOrder,
        summary: sampleSummary,
        invoiceSettings: form,
        assignedStaffName: 'Laxmi'
      }),
    [form]
  );

  return (
    <div className="settings-page invoice-settings-page">
      <div className="settings-title">Invoice Setting</div>
      <div className="invoice-settings-layout">
        <div className="invoice-settings-form">
          <div className="settings-card">
            <div className="settings-card-title">Restaurant Information</div>
            <div className="settings-grid">
              <div>
                <label className="field-label">Invoice Type</label>
                <input className="field-input" value={form.invoiceType || ''} onChange={(e) => update({ invoiceType: e.target.value })} />
              </div>
              <UploadField
                label="Restaurant Logo"
                value={form.logoUrl}
                onUpload={(file) => handleUpload(file, 'logo')}
              />
              <div>
                <label className="field-label">Restaurant Legal Name</label>
                <input className="field-input" value={form.legalName || ''} onChange={(e) => update({ legalName: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Address</label>
                <input className="field-input" value={form.address || ''} onChange={(e) => update({ address: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Contact Number</label>
                <input className="field-input" value={form.contactNumber || ''} onChange={(e) => update({ contactNumber: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Tax Number</label>
                <input className="field-input" value={form.taxNumber || ''} onChange={(e) => update({ taxNumber: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="settings-card invoice-font-card">
            <div className="settings-card-title">Font Setting</div>
            <div className="invoice-font-stepper">
              <button type="button" onClick={() => update({ fontSize: Math.max(8, Number(form.fontSize || 9) - 1) })}>
                <Minus size={16} />
              </button>
              <span>{form.fontSize || 9}</span>
              <button type="button" onClick={() => update({ fontSize: Math.min(18, Number(form.fontSize || 9) + 1) })}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title">Invoice Heading Details</div>
            <div className="invoice-chip-grid">
              {headingFields.map((field) => (
                <ToggleChip
                  key={field.key}
                  label={field.label}
                  checked={Boolean(form[field.key])}
                  onChange={(next) => update({ [field.key]: next })}
                />
              ))}
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title">Line Item Details</div>
            <div className="invoice-chip-grid">
              {lineFields.map((field) => (
                <ToggleChip
                  key={field.key}
                  label={field.label}
                  checked={Boolean(form[field.key])}
                  onChange={(next) => update({ [field.key]: next })}
                />
              ))}
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title">Sub Total Calculation</div>
            <div className="invoice-chip-grid invoice-chip-grid-wide">
              {subtotalFields.map((field) => (
                <ToggleChip
                  key={field.key}
                  label={field.label}
                  checked={Boolean(form[field.key])}
                  onChange={(next) => update({ [field.key]: next })}
                />
              ))}
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title">Invoice Footer Details</div>
            <div className="invoice-chip-grid invoice-chip-grid-wide">
              {footerFields.map((field) => (
                <ToggleChip
                  key={field.key}
                  label={field.label}
                  checked={Boolean(form[field.key])}
                  onChange={(next) => update({ [field.key]: next })}
                />
              ))}
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title">QR Attachments</div>
            <div className="invoice-inline-toggle">
              <span>Enable QR in invoice</span>
              <label className="switch-lite">
                <input type="checkbox" checked={Boolean(form.qrEnabled)} onChange={(e) => update({ qrEnabled: e.target.checked })} />
                <span />
              </label>
            </div>
            <div className="settings-grid">
              <div>
                <label className="field-label">File Name</label>
                <input className="field-input" value={form.qrFileName || ''} onChange={(e) => update({ qrFileName: e.target.value })} />
              </div>
              <UploadField
                label="Upload QR Image"
                value={form.qrImageUrl}
                onUpload={(file) => handleUpload(file, 'qr')}
              />
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title">Footer</div>
            <div className="settings-grid">
              <div className="field-span-2">
                <label className="field-label">Header</label>
                <input
                  className="field-input"
                  value={form.footer?.header || ''}
                  onChange={(e) => update({ footer: { ...(form.footer || {}), header: e.target.value } })}
                />
              </div>
              <div className="field-span-2">
                <label className="field-label">Remarks</label>
                <textarea
                  className="field-input"
                  rows="3"
                  value={form.footer?.remarks || ''}
                  onChange={(e) => update({ footer: { ...(form.footer || {}), remarks: e.target.value } })}
                />
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button
              className="btn btn-primary"
              onClick={() => onSave?.(form)}
              disabled={uploading.logo || uploading.qr}
            >
              {uploading.logo || uploading.qr ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="invoice-settings-preview">
          <div className="preview-title">Print Preview</div>
          <InvoicePreviewCard preview={preview} settings={form} />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSetting;
