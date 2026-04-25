import React, { useEffect, useState } from 'react';
import api from '../../../../api/client.js';
import { Landmark, CreditCard, Smartphone, Building2, ArrowRightLeft } from 'lucide-react';

const METHOD_ICONS = {
  cash:     { icon: Landmark,    label: 'Cash',          color: '#16a34a', bg: '#f0fdf4' },
  card:     { icon: CreditCard,  label: 'Card',          color: '#2563eb', bg: '#eff6ff' },
  fonepay:  { icon: Smartphone,  label: 'Fonepay',       color: '#7c3aed', bg: '#f5f3ff' },
  bank:     { icon: Building2,   label: 'Bank Transfer', color: '#0891b2', bg: '#ecfeff' },
};

export default function CashBanksPage() {
  const [balances, setBalances] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [totalIn,  setTotalIn]  = useState(0);
  const [totalOut, setTotalOut] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      // Fetch from finance-dashboard which usually breaks down by payment method
      const [dashRes, paymentsInRes, paymentsOutRes] = await Promise.all([
        api.get('/api/reports/finance-dashboard').catch(() => ({ data: {} })),
        api.get('/api/payments', { params: { type: 'in' } }).catch(() => ({ data: [] })),
        api.get('/api/payments', { params: { type: 'out' } }).catch(() => ({ data: [] })),
      ]);

      const dash = dashRes.data || {};
      const inData  = Array.isArray(paymentsInRes.data)  ? paymentsInRes.data  : (paymentsInRes.data?.data  || []);
      const outData = Array.isArray(paymentsOutRes.data) ? paymentsOutRes.data : (paymentsOutRes.data?.data || []);

      const tIn  = inData.reduce((s,r)  => s + Number(r.amount || 0), 0);
      const tOut = outData.reduce((s,r) => s + Number(r.amount || 0), 0);
      setTotalIn(tIn);
      setTotalOut(tOut);

      // Build balances from breakdown or fallback
      const breakdown = dash.paymentBreakdown || [];
      if (breakdown.length) {
        setBalances(breakdown.map(b => ({
          method: b.method,
          amount: b.amount || 0,
        })));
      } else {
        // Aggregate from bills
        const billsRes = await api.get('/api/reports/summary').catch(() => ({ data: {} }));
        const methods = ['cash','card','fonepay','bank'];
        setBalances(methods.map(m => ({ method: m, amount: 0 })));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="fd-root">
      <div className="fd-header">
        <h1 className="fd-title">Cash & Banks</h1>
      </div>

      {/* Summary KPIs */}
      <div className="fd-kpi-grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {[
          { label:'Total Payment In',  val:`Rs ${totalIn.toLocaleString()}`,  icon:'⬇️', bg:'#f0fdf4', col:'#16a34a' },
          { label:'Total Payment Out', val:`Rs ${totalOut.toLocaleString()}`, icon:'⬆️', bg:'#fef2f2', col:'#dc2626' },
          { label:'Net Balance',       val:`Rs ${(totalIn - totalOut).toLocaleString()}`,
            icon:'⚖️', bg:(totalIn-totalOut)>=0?'#f0fdf4':'#fef2f2', col:(totalIn-totalOut)>=0?'#16a34a':'#dc2626' },
        ].map((k,i) => (
          <div key={i} className="fd-kpi-card">
            <div className="fd-kpi-icon" style={{ background:k.bg, color:k.col, fontSize:20 }}>{k.icon}</div>
            <div className="fd-kpi-body">
              <div className="fd-kpi-label">{k.label}</div>
              <div className="fd-kpi-value">{loading ? '—' : k.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Cards */}
      <div className="fd-accounts-grid">
        {(balances.length ? balances : Object.keys(METHOD_ICONS).map(m => ({ method: m, amount: 0 }))).map((b, i) => {
          const cfg = METHOD_ICONS[b.method?.toLowerCase()] || METHOD_ICONS.cash;
          const Icon = cfg.icon;
          return (
            <div key={i} className="fd-account-card">
              <div className="fd-account-icon" style={{ background: cfg.bg, color: cfg.color }}>
                <Icon size={24} />
              </div>
              <div className="fd-account-body">
                <div className="fd-account-label">{cfg.label}</div>
                <div className="fd-account-balance" style={{ color: cfg.color }}>
                  Rs {Number(b.amount || 0).toLocaleString()}
                </div>
                <div className="fd-account-tag">Account Balance</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="fd-info-banner">
        <ArrowRightLeft size={18} color="#f5a524" />
        <span>Use <strong>Balance Transfer</strong> to move funds between accounts. All transactions are recorded automatically.</span>
      </div>
    </div>
  );
}
