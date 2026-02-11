import React from "react";

const AdminReports = ({ analytics = [] }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Reports & Analytics</h4>
          <div className="text-muted small">
            Overview of sales performance and popular items
          </div>
        </div>
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
          Live Data
        </span>
      </div>

      {/* Stats Section */}
      <div className="row g-4 mb-4">
        {[
          { title: "Daily Sales", value: "Rs 0", icon: "📅" },
          { title: "Weekly Sales", value: "Rs 0", icon: "📊" },
          { title: "Yearly Sales", value: "Rs 0", icon: "📈" },
        ].map((stat, index) => (
          <div key={index} className="col-12 col-md-4">
            <div className="p-4 rounded-4 border bg-light h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">{stat.title}</div>
                  <h5 className="fw-bold mt-1 mb-0">{stat.value}</h5>
                </div>
                <div className="fs-3">{stat.icon}</div>
              </div>
              <div className="text-success small mt-2">
                +0% from last period
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Most Frequent Items */}
      <div className="border-top pt-4">
        <h5 className="fw-semibold mb-3">Most Frequent Menu Items</h5>

        {analytics.length === 0 ? (
          <div className="text-center text-muted py-4">
            <div className="fs-1">📦</div>
            <div>No sales data available yet.</div>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {analytics.map(([name, count], index) => (
              <li
                key={name}
                className="list-group-item d-flex justify-content-between align-items-center px-0"
              >
                <div>
                  <span className="badge bg-secondary me-2">
                    #{index + 1}
                  </span>
                  {name}
                </div>
                <span className="fw-semibold">{count} orders</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
