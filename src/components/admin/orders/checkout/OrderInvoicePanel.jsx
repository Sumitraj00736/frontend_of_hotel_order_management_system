import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../../api/client.js';
import InvoicePreviewCard from '../../settings/order/InvoicePreviewCard.jsx';
import { buildInvoicePreviewData, mergeInvoiceSettings } from '../../settings/order/invoicePreviewUtils.js';
import '../../../../common/css/admin/settings/settings.css';

const OrderInvoicePanel = ({ order, total, previewState = {}, staff = [] }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/api/settings/invoice')
      .then((res) => {
        if (active) {
          setSettings(mergeInvoiceSettings(res.data || {}));
        }
      })
      .catch(() => {
        if (active) {
          setSettings(mergeInvoiceSettings({}));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const assignedStaffName = useMemo(() => {
    if (!previewState.assignedStaffId) return '';
    return staff.find((member) => member._id === previewState.assignedStaffId)?.name || '';
  }, [previewState.assignedStaffId, staff]);

  const preview = useMemo(
    () =>
      buildInvoicePreviewData({
        order,
        summary: { ...previewState, total },
        invoiceSettings: settings || {},
        assignedStaffName
      }),
    [order, previewState, settings, total, assignedStaffName]
  );

  return (
    <div className="invoice-card invoice-card-shell">
      <InvoicePreviewCard preview={preview} settings={settings || {}} />
    </div>
  );
};

export default OrderInvoicePanel;
