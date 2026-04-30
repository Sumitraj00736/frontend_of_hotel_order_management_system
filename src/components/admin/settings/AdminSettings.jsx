import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../api/client.js';
import RestaurantDetails from './general/RestaurantDetails.jsx';
import TaxRates from './general/TaxRates.jsx';
import NotificationSettings from './general/NotificationSettings.jsx';
import ActivityLog from './general/ActivityLog.jsx';
import BillingSubscription from './general/BillingSubscription.jsx';
import UsersRole from './general/UsersRole.jsx';
import { updateOrgName } from '../../../api/session.js';
import DepartmentSettings from './general/DepartmentSettings.jsx';
import TrashSettings from './general/TrashSettings.jsx';
import SupportFeedback from './general/SupportFeedback.jsx';
import ReleaseNotes from './general/ReleaseNotes.jsx';
import BranchManagement from './general/BranchManagement.jsx';
import InvoiceSetting from './order/InvoiceSetting.jsx';
import KotSetting from './order/KotSetting.jsx';
import PrinterSetting from './order/PrinterSetting.jsx';
import '../../../common/css/admin/settings/settings.css';

const AdminSettings = ({ activeView, onNotify }) => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [taxSettings, setTaxSettings] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const [activityLogs, setActivityLogs] = useState({ data: [], page: 1, limit: 50, total: 0 });
  const [activityFilters, setActivityFilters] = useState({ type: '', action: '', entityType: '', search: '', dateFrom: '', dateTo: '' });
  const [billingSummary, setBillingSummary] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [invoiceSettings, setInvoiceSettings] = useState(null);
  const [invoiceSaving, setInvoiceSaving] = useState(false);
  const [kotSettings, setKotSettings] = useState(null);
  const [printerSettings, setPrinterSettings] = useState(null);
  const [supportItems, setSupportItems] = useState([]);

  const view = useMemo(() => activeView || 'restaurant-details', [activeView]);

  const loadRestaurant = async () => {
    const res = await api.get('/api/settings/restaurant-details');
    setRestaurantDetails(res.data || {});
  };

  const loadTaxSettings = async () => {
    const [settingsRes, taxesRes] = await Promise.all([
      api.get('/api/settings/tax-rates'),
      api.get('/api/taxes')
    ]);
    setTaxSettings(settingsRes.data || {});
    setTaxes(Array.isArray(taxesRes.data) ? taxesRes.data : []);
  };

  const loadNotificationSettings = async () => {
    const res = await api.get('/api/settings/notifications');
    setNotificationSettings(res.data || {});
  };

  const loadActivityLogs = async (filters = activityFilters, page = activityLogs.page, limit = activityLogs.limit) => {
    const res = await api.get('/api/activity-logs', {
      params: {
        ...filters,
        page,
        limit
      }
    });
    const payload = res.data || {};
    setActivityLogs({
      data: payload.data || [],
      page: payload.page || page,
      limit: payload.limit || limit,
      total: payload.total || 0
    });
  };

  const loadBilling = async () => {
    const res = await api.get('/api/billing/summary');
    setBillingSummary(res.data || null);
  };

  const loadRoles = async () => {
    const res = await api.get('/api/roles');
    setRoleData(res.data || null);
  };

  const loadDepartments = async () => {
    const res = await api.get('/api/departments');
    setDepartments(Array.isArray(res.data) ? res.data : []);
  };

  const loadInvoiceSettings = async () => {
    const res = await api.get('/api/settings/invoice');
    setInvoiceSettings(res.data || {});
  };

  const loadKotSettings = async () => {
    const res = await api.get('/api/settings/kot');
    setKotSettings(res.data || {});
  };

  const loadPrinterSettings = async () => {
    const res = await api.get('/api/settings/printer');
    setPrinterSettings(res.data || {});
  };

  const loadSupportItems = async () => {
    const res = await api.get('/api/support');
    setSupportItems(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    if (view === 'restaurant-details') loadRestaurant();
    if (view === 'tax-rates') loadTaxSettings();
    if (view === 'notifications') loadNotificationSettings();
    if (view === 'activity-log') loadActivityLogs();
    if (view === 'billing') loadBilling();
    if (view === 'users-role') loadRoles();
    if (view === 'department') loadDepartments();
    if (view === 'invoice-setting') loadInvoiceSettings();
    if (view === 'kot-setting') loadKotSettings();
    if (view === 'printer') loadPrinterSettings();
    if (view === 'support') loadSupportItems();
  }, [view]);

  return (
    <div className={`settings-content ${view === 'invoice-setting' ? 'settings-content-invoice' : ''}`}>
      {view === 'restaurant-details' && (
        <RestaurantDetails
          value={restaurantDetails}
          onSave={async (payload) => {
            const res = await api.put('/api/settings/restaurant-details', payload);
            setRestaurantDetails(res.data || payload);
            if (payload.name) {
              updateOrgName(payload.name);
            }
          }}
        />
      )}
      {view === 'tax-rates' && (
        <TaxRates
          settings={taxSettings}
          taxes={taxes}
          onSaveSettings={async (payload) => {
            const res = await api.put('/api/settings/tax-rates', payload);
            setTaxSettings(res.data || payload);
          }}
          onCreateTax={async (payload) => {
            const res = await api.post('/api/taxes', payload);
            setTaxes((prev) => [res.data, ...prev]);
          }}
          onUpdateTax={async (id, payload) => {
            const res = await api.put(`/api/taxes/${id}`, payload);
            setTaxes((prev) => prev.map((t) => (t._id === id ? res.data : t)));
          }}
          onDeleteTax={async (id) => {
            await api.delete(`/api/taxes/${id}`);
            setTaxes((prev) => prev.filter((t) => t._id !== id));
          }}
        />
      )}
      {view === 'notifications' && (
        <NotificationSettings
          value={notificationSettings}
          onSave={async (payload) => {
            const res = await api.put('/api/settings/notifications', payload);
            setNotificationSettings(res.data || payload);
          }}
        />
      )}
      {view === 'activity-log' && (
        <ActivityLog
          logs={activityLogs}
          filters={activityFilters}
          onFilterChange={(next) => {
            const merged = { ...activityFilters, ...next };
            setActivityFilters(merged);
            loadActivityLogs(merged, 1, activityLogs.limit);
          }}
          onPageChange={(nextPage) => loadActivityLogs(activityFilters, nextPage, activityLogs.limit)}
          onLimitChange={(nextLimit) => loadActivityLogs(activityFilters, 1, nextLimit)}
        />
      )}
      {view === 'billing' && (
        <BillingSubscription data={billingSummary} />
      )}
      {view === 'users-role' && (
        <UsersRole
          data={roleData}
          onCreateRole={async (payload) => {
            const res = await api.post('/api/roles', payload);
            setRoleData((prev) => ({ ...prev, roles: [...(prev?.roles || []), res.data] }));
          }}
          onUpdateRole={async (id, payload) => {
            const res = await api.put(`/api/roles/${id}`, payload);
            setRoleData((prev) => ({
              ...prev,
              roles: (prev?.roles || []).map((r) => (r._id === id ? res.data : r))
            }));
            await loadRoles();
          }}
        />
      )}
      {view === 'department' && (
        <DepartmentSettings
          items={departments}
          onCreate={async (payload) => {
            const res = await api.post('/api/departments', payload);
            setDepartments((prev) => [...prev, res.data]);
          }}
          onUpdate={async (id, payload) => {
            const res = await api.put(`/api/departments/${id}`, payload);
            setDepartments((prev) => prev.map((d) => (d._id === id ? res.data : d)));
          }}
          onDelete={async (id) => {
            await api.delete(`/api/departments/${id}`);
            setDepartments((prev) => prev.filter((d) => d._id !== id));
          }}
        />
      )}
      {view === 'invoice-setting' && (
        <InvoiceSetting
          value={invoiceSettings}
          saving={invoiceSaving}
          onSave={async (payload) => {
            setInvoiceSaving(true);
            try {
              const res = await api.put('/api/settings/invoice', payload);
              setInvoiceSettings(res.data || payload);
              onNotify?.({
                title: 'Invoice Setting Saved',
                message: 'Your invoice preview and checkout invoice settings were updated successfully.'
              });
            } catch (error) {
              onNotify?.({
                title: 'Save Failed',
                message: error?.response?.data?.message || 'Unable to save invoice settings right now.',
                sound: true
              });
            } finally {
              setInvoiceSaving(false);
            }
          }}
        />
      )}
      {view === 'kot-setting' && (
        <KotSetting
          value={kotSettings}
          onSave={async (payload) => {
            const res = await api.put('/api/settings/kot', payload);
            setKotSettings(res.data || payload);
          }}
        />
      )}
      {view === 'printer' && (
        <PrinterSetting
          value={printerSettings}
          onSave={async (payload) => {
            const res = await api.put('/api/settings/printer', payload);
            setPrinterSettings(res.data || payload);
          }}
        />
      )}
      {view === 'support' && (
        <SupportFeedback
          items={supportItems}
          onSubmit={async (payload) => {
            const res = await api.post('/api/support', payload);
            setSupportItems((prev) => [res.data, ...prev]);
          }}
        />
      )}
      {view === 'release' && <ReleaseNotes />}
      {view === 'branches' && <BranchManagement />}
      {view === 'trash' && <TrashSettings />}
    </div>
  );
};

export default AdminSettings;
