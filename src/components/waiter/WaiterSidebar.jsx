import React from 'react';
import '../../common/css/waiter/waiterSidebar.css';

const WaiterSidebar = ({ tables, selectedTable, onSelectTable, onFreeTable }) => (
  <div className="sidebar waiter-sidebar">
    <h5 className="mb-3">Tables</h5>
    <div className="d-flex flex-wrap gap-2">
      {tables.map((table) => (
        <button
          key={table._id}
          className={`table-chip ${selectedTable === table._id ? 'active' : ''} ${table.status === 'occupied' ? 'occupied' : ''}`}
          onClick={() => onSelectTable(table._id)}
          disabled={table.status === 'occupied'}
        >
          T{table.tableNumber}
        </button>
      ))}
    </div>
    <div className="mt-3 small text-muted">Occupied tables are disabled.</div>
    <button className="btn btn-outline-light mt-3" onClick={onFreeTable} disabled={!selectedTable}>
      Free Selected Table
    </button>
  </div>
);

export default WaiterSidebar;
