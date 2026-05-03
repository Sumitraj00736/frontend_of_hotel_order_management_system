import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Award } from 'lucide-react';
import WaiterPromotionTimeline from '../PromotionTimeline/WaiterPromotionTimeline';

const WaiterAnalytics = ({ analytics }) => {
  const totalOrders = analytics?.summary?.totalOrders || 0;
  const totalSales = analytics?.summary?.totalSales || 0;
  const averageValue = totalOrders > 0 ? (totalSales / totalOrders) : 0;

  // Custom Styles
  const primaryColor = '#fc8019';
  const cardStyle = {
    background: '#fff',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const highlightCardStyle = {
    ...cardStyle,
    background: `linear-gradient(135deg, ${primaryColor} 0%, #ff9a44 100%)`,
    border: 'none',
    color: '#fff',
    boxShadow: `0 10px 25px -5px rgba(252, 128, 25, 0.4)`
  };

  return (
    <div className="waiter-analytics-page container-fluid p-0" style={{ fontFamily: 'Inter, sans-serif', color: '#1e293b' }}>
      <style>{`
        .waiter-analytics-page {
          padding: 8px !important;
        }
        .waiter-analytics-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .waiter-promo-panel {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          padding: 20px;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
        }
        @media (max-width: 768px) {
          .waiter-analytics-page {
            padding: 0 !important;
          }
          .waiter-analytics-head {
            align-items: flex-start;
            margin-bottom: 12px;
          }
          .analytics-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 16px;
          }
          .waiter-promo-panel {
            padding: 12px;
            border-radius: 12px;
          }
        }
      `}</style>
      <div className="waiter-analytics-head">
        <h4 className="fw-bold m-0" style={{ color: '#1e293b', letterSpacing: '-0.02em', marginTop: '10px' }}>
          My Performance Stats
        </h4>
        <div className="badge" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor, padding: '8px 12px', borderRadius: '10px' }}>
          Real-time Updates
        </div>
      </div>

      {/* Responsive Grid System */}
      <div className="analytics-grid">
        {/* Total Sales Card */}
        <div style={highlightCardStyle} className="stat-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '14px', fontWeight: '700', opacity: 0.9, textTransform: 'uppercase', color:'white' }}>Total Sales</span>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>
            NPR {totalSales.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </h2>
        </div>

        {/* Tables Served Card */}
        <div style={cardStyle} className="stat-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Tables Served</span>
            <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px' }}>
              <ShoppingBag size={20} color={primaryColor} />
            </div>
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem', color: '#0f172a' }}>{totalOrders}</h2>
        </div>

        {/* Avg Order Card */}
        <div style={cardStyle} className="stat-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Avg. Order</span>
            <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px' }}>
              <TrendingUp size={20} color="#10b981" />
            </div>
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem', color: '#0f172a' }}>
            NPR {averageValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h2>
        </div>

        {/* Current Rank Card */}
        <div 
          style={{...cardStyle, borderLeft: `6px solid ${primaryColor}`}} 
          className="stat-card"
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Current Rank</span>
            <Award size={20} color={primaryColor} />
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem', color: primaryColor }}>
            {totalOrders > 50 ? 'Elite' : totalOrders > 20 ? 'Expert' : totalOrders > 5 ? 'Active' : 'Rookie'}
          </h2>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="waiter-promo-panel">
        <WaiterPromotionTimeline />
      </div>
    </div>
  );
};

export default WaiterAnalytics;
