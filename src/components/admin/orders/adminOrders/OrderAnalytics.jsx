import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { TrendingUp, ShoppingBag, CreditCard, Clock } from 'lucide-react';

const COLORS = ['#FC8019', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

const OrderAnalytics = ({ orders = [] }) => {
  const stats = useMemo(() => {
    // 1. Hourly Trend
    const hourlyData = Array(24).fill(0).map((_, i) => ({ 
      hour: `${i}:00`, 
      sales: 0,
      orders: 0
    }));
    
    // 2. Order Types
    const typeMap = { dine_in: 0, takeaway: 0, delivery: 0, pickup: 0 };
    
    // 3. Status
    const statusMap = { paid: 0, preparing: 0, cancelled: 0 };

    let totalRevenue = 0;

    orders.forEach(o => {
      const date = new Date(o.createdAt);
      const hour = date.getHours();
      hourlyData[hour].sales += o.totalAmount || 0;
      hourlyData[hour].orders += 1;
      
      if (typeMap[o.orderType] !== undefined) typeMap[o.orderType]++;
      if (statusMap[o.status] !== undefined) statusMap[o.status]++;
      if (o.status !== 'cancelled') totalRevenue += o.totalAmount || 0;
    });

    const typeData = Object.entries(typeMap).map(([name, value]) => ({ 
      name: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 
      value 
    })).filter(d => d.value > 0);

    return { 
      hourlyData: hourlyData.filter(h => h.orders > 0 || (h.hour === '12:00')), 
      typeData, 
      totalRevenue,
      orderCount: orders.length,
      cancelledCount: statusMap.cancelled
    };
  }, [orders]);

  return (
    <div className="order-analytics-container">
      {/* Top Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="p-4 rounded-4 shadow-sm border-0 h-100" style={{ background: 'linear-gradient(135deg, #FFB87A 0%, #FC8019 100%)', color: '#fff' }}>
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-700 text-uppercase small opacity-75">Gross Revenue</span>
              <CreditCard size={20} />
            </div>
            <h3 className="fw-900 m-0">Rs {stats.totalRevenue.toLocaleString()}</h3>
            <div className="small mt-2 opacity-75 fw-600">+12.5% from yesterday</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-4 rounded-4 shadow-sm bg-white border h-100">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-700 text-uppercase small text-muted">Total Orders</span>
              <ShoppingBag size={20} className="text-primary" />
            </div>
            <h3 className="fw-800 m-0">{stats.orderCount}</h3>
            <div className="small mt-2 text-success fw-700">↑ High volume today</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-4 rounded-4 shadow-sm bg-white border h-100">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-700 text-uppercase small text-muted">Avg. Order Value</span>
              <TrendingUp size={20} className="text-success" />
            </div>
            <h3 className="fw-800 m-0">Rs {stats.orderCount ? Math.round(stats.totalRevenue / stats.orderCount) : 0}</h3>
            <div className="small mt-2 text-muted fw-600">Per transaction</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-4 rounded-4 shadow-sm bg-white border h-100">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-700 text-uppercase small text-muted">Cancellations</span>
              <Clock size={20} className="text-danger" />
            </div>
            <h3 className="fw-800 m-0 text-danger">{stats.cancelledCount}</h3>
            <div className="small mt-2 text-muted fw-600">{Math.round((stats.cancelledCount / (stats.orderCount || 1)) * 100)}% failure rate</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Sales Chart */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-800 mb-4 d-flex align-items-center gap-2">
              <div style={{ width: '4px', height: '18px', backgroundColor: '#FC8019', borderRadius: '4px' }}></div>
              Hourly Sales Performance
            </h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={stats.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#FC8019" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#FC8019', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Order Type Distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-800 mb-4 d-flex align-items-center gap-2">
              <div style={{ width: '4px', height: '18px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
              Order Composition
            </h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={stats.typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;
