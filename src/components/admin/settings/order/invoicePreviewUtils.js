export const DEFAULT_INVOICE_SETTINGS = {
  invoiceType: 'Estimate Invoice',
  legalName: '',
  contactNumber: '',
  taxNumber: '',
  address: '',
  logoUrl: '',
  fontSize: 9,
  showEstimateDetails: false,
  showEstimateNumber: false,
  showInvoiceNo: true,
  showDate: true,
  showOrderType: true,
  showTime: true,
  showItemSN: false,
  showHSCode: false,
  showParticular: true,
  showRate: true,
  showQty: true,
  showAmount: true,
  showItemTotal: true,
  showSubTotal: true,
  showDiscount: true,
  showTaxableAmount: true,
  showTax: true,
  showRoundOff: true,
  showTip: true,
  showGrandTotal: true,
  showPaymentMode: true,
  showBilledBy: true,
  showKotNumber: true,
  showAssign: true,
  showTenderAmount: true,
  showInWords: true,
  showServiceDuration: true,
  qrEnabled: false,
  qrFileName: '',
  qrImageUrl: '',
  footer: {
    header: 'Thank You',
    remarks: 'Thank you for your visit! Visit again'
  }
};

export const mergeInvoiceSettings = (value = {}) => ({
  ...DEFAULT_INVOICE_SETTINGS,
  ...value,
  footer: {
    ...DEFAULT_INVOICE_SETTINGS.footer,
    ...(value?.footer || {})
  }
});

export const formatMoney = (amount = 0) => `Rs ${Number(amount || 0).toFixed(2)}`;

const smallNumberWords = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];
const tensWords = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const numberToWords = (value) => {
  const number = Math.floor(Number(value || 0));
  if (number < 20) return smallNumberWords[number];
  if (number < 100) {
    return `${tensWords[Math.floor(number / 10)]}${number % 10 ? `-${smallNumberWords[number % 10]}` : ''}`;
  }
  if (number < 1000) {
    return `${smallNumberWords[Math.floor(number / 100)]} Hundred${number % 100 ? ` ${numberToWords(number % 100)}` : ''}`;
  }
  if (number < 100000) {
    return `${numberToWords(Math.floor(number / 1000))} Thousand${number % 1000 ? ` ${numberToWords(number % 1000)}` : ''}`;
  }
  if (number < 10000000) {
    return `${numberToWords(Math.floor(number / 100000))} Lakh${number % 100000 ? ` ${numberToWords(number % 100000)}` : ''}`;
  }
  return `${numberToWords(Math.floor(number / 10000000))} Crore${number % 10000000 ? ` ${numberToWords(number % 10000000)}` : ''}`;
};

export const amountToWords = (value = 0) => {
  const numeric = Number(value || 0);
  const rupees = Math.floor(numeric);
  const paisa = Math.round((numeric - rupees) * 100);
  const rupeeWords = numberToWords(rupees);
  if (!paisa) {
    return `${rupeeWords} Nepalese Rupee Only`;
  }
  return `${rupeeWords} And ${numberToWords(paisa)}/100 Nepalese Rupee Only`;
};

const computeServiceDuration = (createdAt) => {
  if (!createdAt) return 'N/A';
  const start = new Date(createdAt).getTime();
  if (Number.isNaN(start)) return 'N/A';
  const diffMinutes = Math.max(1, Math.round((Date.now() - start) / 60000));
  return `${diffMinutes} min`;
};

const resolvePaymentModeLabel = (payments = [], fallbackMethod = '', paymentStatus = 'paid') => {
  if (paymentStatus === 'unpaid_credit') return 'Unpaid / Credit';
  if (Array.isArray(payments) && payments.length > 0) {
    return payments
      .map((entry) => `${entry.method}${entry.amount ? ` (${formatMoney(entry.amount)})` : ''}`)
      .join(', ');
  }
  return fallbackMethod || 'Cash';
};

export const buildInvoicePreviewData = ({
  order,
  summary = {},
  invoiceSettings = DEFAULT_INVOICE_SETTINGS,
  assignedStaffName = ''
}) => {
  const settings = mergeInvoiceSettings(invoiceSettings);
  const items = (order?.items || []).map((item, index) => ({
    id: item._id || `${item.menuItem?._id || item.menuItem || index}-${index}`,
    sn: index + 1,
    hsCode: item.hsCode || '-',
    particular: item.menuItem?.name || item.name || 'Item',
    rate: Number(item.priceAtOrderTime || 0),
    qty: Number(item.quantity || 0),
    amount: Number(item.priceAtOrderTime || 0) * Number(item.quantity || 0)
  }));

  const subtotal = Number(summary.subtotal ?? order?.subTotal ?? order?.totalAmount ?? 0);
  const discountType = summary.discountType || order?.discountType || 'amount';
  const discountSource = Number(summary.discountValue ?? order?.discountValue ?? 0);
  const discountAmount =
    discountType === 'percent'
      ? (subtotal * discountSource) / 100
      : discountSource;
  const taxableAmount = Number(summary.taxableAmount ?? Math.max(0, subtotal - discountAmount));
  const taxRate = Number(summary.taxRate ?? order?.taxRate ?? 0);
  const taxAmount = Number(summary.taxAmount ?? (taxableAmount * taxRate) / 100);
  const tipsAmount = Number(summary.tipsAmount ?? order?.tipsAmount ?? 0);
  const roundOff = Number(summary.roundOff ?? order?.roundOff ?? 0);
  const grandTotal = Number(summary.total ?? order?.finalAmount ?? order?.totalAmount ?? 0);
  const tenderAmount = Number(summary.tenderAmount ?? order?.tenderAmount ?? 0);

  return {
    title: (settings.invoiceType || 'Estimate Invoice').toUpperCase(),
    legalName: settings.legalName || '',
    contactNumber: settings.contactNumber || '',
    taxNumber: settings.taxNumber || '',
    address: settings.address || '',
    logoUrl: settings.logoUrl || '',
    fontSize: settings.fontSize || 9,
    invoiceNo: order?.invoiceNo || order?.kotNo || '##',
    estimateNo: order?.estimateNo || order?.kotNo || '##',
    dateLabel: new Date(order?.createdAt || Date.now()).toLocaleDateString(),
    timeLabel: new Date(order?.createdAt || Date.now()).toLocaleTimeString(),
    orderType: order?.orderType || 'dine_in',
    dineInLabel: order?.table?.tableNumber ? `Table ${order.table.tableNumber}` : '-',
    customerLabel: summary.customerName || order?.customerName || order?.customer?.name || 'Cash Customer',
    customerPhone: order?.customerPhone || '',
    deliveryAddress: order?.deliveryAddress || '',
    deliveryPlatform: order?.deliveryPlatform || '',
    waiterLabel: order?.source === 'guest' ? 'Order by QR code' : order?.createdBy?.name || 'N/A',
    kitchenLabel: order?.kitchenAssigned?.name || 'N/A',
    items,
    itemTotal: items.reduce((sum, item) => sum + item.amount, 0),
    subtotal,
    discountType,
    discountValue: discountSource,
    discountAmount,
    taxableAmount,
    taxRate,
    taxAmount,
    roundOff,
    tipsAmount,
    grandTotal,
    inWords: amountToWords(grandTotal),
    paymentModeLabel: resolvePaymentModeLabel(summary.payments, summary.paymentMethod || order?.paymentMethod, summary.paymentStatus),
    billedBy: order?.paidBy?.name || order?.createdBy?.name || 'N/A',
    kotNumber: order?.kotNo || 'N/A',
    assignLabel: assignedStaffName || order?.assignedStaff?.name || 'N/A',
    serviceDuration: computeServiceDuration(order?.createdAt),
    tenderAmount,
    footerHeader: settings.footer?.header || '',
    footerRemarks: settings.footer?.remarks || '',
    qrEnabled: settings.qrEnabled,
    qrFileName: settings.qrFileName || '',
    qrImageUrl: settings.qrImageUrl || ''
  };
};
