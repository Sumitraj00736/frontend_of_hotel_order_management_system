import React, { useMemo, useState } from 'react';
import { Home, Wallet, ShoppingCart, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import '../../common/css/admin/dashboard.css';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Home size={18} /> },
  { id: 'finance', label: 'Finance', icon: <Wallet size={18} /> },
  { id: 'order', label: 'Order', icon: <ShoppingCart size={18} /> }
];

const OverviewCards = ({ report }) => {
  const items = [
    { title: 'Sales', value: report?.totalSales || 0, tone: 'blue', note: 'No changes!' },
    { title: 'Purchase', value: report?.purchase || 0, tone: 'amber', note: 'No changes!' },
    { title: 'Income', value: report?.income || 0, tone: 'green', note: 'No changes!' },
    { title: 'Expenses', value: report?.expenses || 0, tone: 'red', note: 'No changes!' },
    { title: 'Payment In', value: report?.paymentIn || 0, tone: 'teal', note: 'No changes!' },
    { title: 'Payment Out', value: report?.paymentOut || 0, tone: 'purple', note: 'No changes!' }
  ];
  return (
    <div className="dash-kpi-grid">
      {items.map((item) => (
        <div key={item.title} className={`dash-kpi tone-${item.tone}`}>
          <div className="dash-kpi-title">{item.title}</div>
          <div className="dash-kpi-value">Rs {item.value}</div>
          <div className="dash-kpi-note">{item.note}</div>
        </div>
      ))}
    </div>
  );
};

const FinanceCards = OverviewCards;

const OrderCards = ({ overview }) => {
  const items = [
    { title: 'Sales', value: overview?.orderSales || 0, tone: 'green', note: 'No changes!' },
    { title: 'Order Served', value: overview?.served || 0, tone: 'amber', note: 'No changes!' },
    { title: 'KOT Taken', value: overview?.kot || 0, tone: 'blue', note: 'No changes!' },
    { title: 'Avg Order Amount', value: overview?.avgOrder || 0, tone: 'pink', note: 'No changes!' }
  ];
  return (
    <div className="dash-kpi-grid">
      {items.map((item) => (
        <div key={item.title} className={`dash-kpi tone-${item.tone}`}>
          <div className="dash-kpi-title">{item.title}</div>
          <div className="dash-kpi-value">{item.title === 'Sales' ? 'Rs ' : ''}{item.value}</div>
          <div className="dash-kpi-note">{item.note}</div>
        </div>
      ))}
    </div>
  );
};

const GradientSalesCard = ({ totalSales = 0, breakdown }) => (
  <div className="panel gradient-panel">
    <div className="panel-heading">
      <div>
        <div className="panel-eyebrow">Sales</div>
        <div className="panel-value">Rs {totalSales}</div>
        <div className="panel-sub">Total Sales</div>
      </div>
      <div className="chip danger"><ArrowDownRight size={14} /> No changes!</div>
    </div>
    <div className="mini-chart" aria-hidden />
    <div className="breakdown">
      {breakdown.map((row) => (
        <div key={row.label} className="breakdown-row">
          <span className="dot" style={{ background: row.color }} />
          <span>{row.label}</span>
          <span className="fw-600">Rs {row.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const SalesOverviewChart = () => (
  <div className="panel">
    <div className="panel-heading">
      <div>
        <div className="panel-title">Sales Overview</div>
        <div className="panel-sub">Here is a live overview of your sales</div>
      </div>
      <button className="chip ghost"><Calendar size={16} /> Today</button>
    </div>
    <div className="chart-placeholder">Line chart placeholder</div>
  </div>
);

const SalesSummary = ({ paid = 0, unpaid = 0 }) => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">Sales Summary</div>
      <div className="panel-sub">Real-time sales tracking.</div>
    </div>
    <div className="summary-body">
      <div className="text-muted tiny-text mb-2">Total Sales</div>
      <div className="panel-value mb-3">Rs {paid + unpaid}</div>
      <div className="summary-row"><span className="dot blue" /> Paid <span className="fw-600">Rs {paid}</span></div>
      <div className="summary-row"><span className="dot red" /> Unpaid Sales <span className="fw-600">Rs {unpaid}</span></div>
    </div>
  </div>
);

const OrderInsight = () => (
  <div className="panel">
    <div className="panel-heading">
      <div>
        <div className="panel-title">Order Insight</div>
        <div className="panel-sub">Here is a live overview of your orders.</div>
      </div>
      <div className="chip ghost"><Calendar size={16} /> Today</div>
    </div>
    <div className="chart-placeholder">Orders chart placeholder</div>
  </div>
);

const LiveOrderStatus = ({ completed = 0, pending = 0, cancelled = 0 }) => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">Live Order Status</div>
      <div className="panel-sub">Here is a live overview of your orders status.</div>
    </div>
    <div className="summary-body center">
      <div className="panel-value">{completed + pending + cancelled}</div>
      <div className="panel-sub">Orders</div>
      <div className="summary-row"><span className="dot green" /> Completed Order <span className="fw-600">{completed}</span></div>
      <div className="summary-row"><span className="dot amber" /> Pending Order <span className="fw-600">{pending}</span></div>
      <div className="summary-row"><span className="dot red" /> Cancelled Order <span className="fw-600">{cancelled}</span></div>
    </div>
  </div>
);

const AdminOverview = ({ report, overview }) => {
  const [tab, setTab] = useState('overview');

  const paid = report?.paid || 0;
  const unpaid = report?.unpaid || 0;
  const totalSales = report?.totalSales || 0;

  const breakdown = useMemo(
    () => [
      { label: 'Dine In Service', value: report?.dineIn || 0, color: '#4f46e5' },
      { label: 'Reservation Services', value: report?.reservation || 0, color: '#9333ea' },
      { label: 'Delivery Services', value: report?.delivery || 0, color: '#22c55e' },
      { label: 'Takeaway Services', value: report?.takeaway || 0, color: '#f97316' }
    ],
    [report]
  );

  return (
    <div className="dashboard-screen">
      <div className="dash-header">
        <div className="dash-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`dash-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <div className="dash-filters">
          <button className="chip ghost"><Calendar size={16} /> Today</button>
          <button className="chip ghost">Daybook: All</button>
        </div>
      </div>

      {tab === 'overview' && (
        <>
          <OverviewCards report={report} />
          <div className="panel-grid two-col">
            <GradientSalesCard totalSales={totalSales} breakdown={breakdown} />
            <SalesOverviewChart />
          </div>
        </>
      )}

      {tab === 'finance' && (
        <>
          <FinanceCards report={report} />
          <div className="panel-grid two-col">
            <SalesOverviewChart />
            <SalesSummary paid={paid} unpaid={unpaid} />
          </div>
        </>
      )}

      {tab === 'order' && (
        <>
          <OrderCards overview={overview} />
          <div className="panel-grid two-col">
            <OrderInsight />
            <LiveOrderStatus
              completed={overview?.completedOrders || 0}
              pending={overview?.pendingOrders || 0}
              cancelled={overview?.cancelledOrders || 0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
