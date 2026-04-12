import React from 'react';
import { Award, TrendingUp } from 'lucide-react';

const WaiterPromotionTimeline = ({ promotions = [] }) => (
  <div className="analytics-card-container w-100 h-100">
    <h4 className="fw-bold mb-4" style={{ color: '#0f172a' }}>Career timeline</h4>
    <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', padding: '24px', minHeight: '300px' }}>
      
      {promotions.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center h-100" style={{ color: '#94a3b8', padding: '40px 0' }}>
          <Award size={48} opacity={0.3} style={{ marginBottom: '16px' }} />
          <h5 style={{ fontWeight: '600' }}>No Promotions Yet</h5>
          <p style={{ fontSize: '14px', textAlign: 'center' }}>Keep up the great work and your career progress will appear here.</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '11px', top: '16px', bottom: '16px', width: '2px', background: '#e2e8f0' }} />
          
          {promotions.map((promo, index) => (
            <div key={index} style={{ position: 'relative', marginBottom: index === promotions.length - 1 ? '0' : '32px' }}>
              {/* Timeline Dot */}
              <div style={{ position: 'absolute', left: '-29px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#3b82f6', border: '3px solid #eff6ff', zIndex: 1 }} />
              
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 style={{ margin: 0, fontWeight: '700', color: '#0f172a', fontSize: '16px' }}>{promo.title}</h6>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', background: '#eff6ff', padding: '4px 10px', borderRadius: '999px' }}>
                    {new Date(promo.effectiveDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                
                {promo.amount !== undefined && (
                  <div className="d-flex align-items-center mt-2" style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', gap: '6px' }}>
                    <TrendingUp size={16} />
                    Salary Hike: +NPR {promo.amount.toLocaleString()}
                  </div>
                )}
                
                {promo.note && (
                  <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>"{promo.note}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default WaiterPromotionTimeline;
