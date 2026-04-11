import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Award } from 'lucide-react';

const WaiterAnalytics = ({ analytics }) => {
  const totalOrders = analytics?.summary?.totalOrders || 0;
  const totalSales = analytics?.summary?.totalSales || 0;
  const averageValue = totalOrders > 0 ? (totalSales / totalOrders) : 0;

  return (
    <div className="analytics-card-container w-100 h-100">
      <h4 className="fw-bold mb-4" style={{ color: '#0f172a' }}>My Performance Stats</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px', borderRadius: '24px', color: '#fff', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '15px', fontWeight: '700', opacity: 0.9, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Total Sales</span>
            <DollarSign size={24} opacity={0.8} />
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '28px' }}>NPR {totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#64748b', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Tables Served</span>
            <ShoppingBag size={24} color="#3b82f6" />
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '28px', color: '#0f172a' }}>{totalOrders}</h2>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#64748b', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Avg. Order</span>
            <TrendingUp size={24} color="#f59e0b" />
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '28px', color: '#0f172a' }}>NPR {averageValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px', borderRadius: '24px', color: '#fff', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.25)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '15px', fontWeight: '700', opacity: 0.9, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Current Rank</span>
            <Award size={24} opacity={0.8} />
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '28px' }}>
            {totalOrders > 50 ? 'Elite' : totalOrders > 20 ? 'Expert' : totalOrders > 5 ? 'Active' : 'Rookie'}
          </h2>
        </div>

      </div>
    </div>
  );
};

export default WaiterAnalytics;
