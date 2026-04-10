import React from 'react';

const formatMoney = (value) => `Rs ${Number(value || 0).toFixed(0)}`;

const CustomerKpiGrid = ({ totals }) => {
  const items = [
    { label: 'To Receive', value: totals.toReceive, color: '#16a34a' },
    { label: 'To Pay', value: totals.toPay, color: '#dc2626' },
    { label: 'Net To Receive', value: totals.netToReceive, color: '#059669' }
  ];

  return (
    <div className="customers-kpis">
      {items.map((item) => (
        <div className="customers-kpi" key={item.label}>
          <div className="kpi-icon" style={{ background: item.color }}>{item.label[0]}</div>
          <div>
            <div className="kpi-label">{item.label}</div>
            <div className="kpi-value">{formatMoney(item.value)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerKpiGrid;
