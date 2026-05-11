import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return `Rs ${amount.toLocaleString('en-IN')}`;
};

const CustomerKpiGrid = ({ totals }) => {
  const items = [
    { 
      label: 'To Receive', 
      value: totals.toReceive, 
      color: '#16a34a', 
      icon: <ArrowUpRight size={20} />,
      class: 'receive'
    },
    { 
      label: 'To Pay', 
      value: totals.toPay, 
      color: '#dc2626', 
      icon: <ArrowDownLeft size={20} />,
      class: 'pay'
    },
    { 
      label: 'Net Amount', 
      value: totals.netToReceive, 
      color: '#fc8019', 
      icon: <Wallet size={20} />,
      class: 'net'
    }
  ];

  return (
    <div className="kpi-container-grid">
      {items.map((item) => (
        <div className={`kpi-card ${item.class}`} key={item.label}>
          <div className="kpi-icon-box" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
            {item.icon}
          </div>
          <div className="kpi-info">
            <span className="kpi-label">{item.label}</span>
            <h3 className="kpi-value" style={{ color: item.class === 'net' ? '#2d3436' : item.color }}>
              {formatMoney(item.value)}
            </h3>
          </div>
          <div className="kpi-decoration-blob"></div>
        </div>
      ))}
    </div>
  );
};

export default CustomerKpiGrid;