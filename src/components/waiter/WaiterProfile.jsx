import React from 'react';
import { Mail, Briefcase, Calendar, DollarSign, Clock } from 'lucide-react';

const WaiterProfile = ({ profile }) => (
  <div className="analytics-card-container w-100 h-100">
    <h4 className="fw-bold mb-4" style={{ color: '#0f172a' }}>Personal Details</h4>
    <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
         <div style={{ width: '80px', height: '80px', minWidth: '80px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
           {profile?.name?.charAt(0)?.toUpperCase() || 'W'}
         </div>
         <div style={{ color: '#fff' }}>
           <h3 style={{ margin: 0, fontWeight: '800', fontSize: '24px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>{profile?.name || 'Unknown Staff'}</h3>
           <span style={{ opacity: 0.8, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{profile?.role || 'Staff Member'}</span>
         </div>
      </div>

      {/* Details List */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: '#f8fafc', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
          <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '14px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Mail size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</div>
            <div style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.email || 'N/A'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: '#f8fafc', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
          <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '14px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date of Joining</div>
            <div style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>{profile?.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: '#f8fafc', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
          <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '14px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base Salary</div>
            <div style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>{profile?.salary ? `NPR ${profile.salary.toLocaleString()}` : 'N/A'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: '#f8fafc', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
          <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '14px', background: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shift Timing</div>
            <div style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>{profile?.shiftStart || '--'} to {profile?.shiftEnd || '--'}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default WaiterProfile;
