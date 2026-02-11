import React from 'react';

const WaiterSidebar = ({ tables, selectedTable, onSelectTable, onFreeTable }) => (
  <div className="sidebar">
    <h5 className="mb-3">Tables</h5>
    <div className="d-flex flex-wrap gap-2">
      {tables.map((table) => (
        <button
          key={table._id}
          className={`table-chip ${selectedTable === table._id ? 'active' : ''}`}
          onClick={() => onSelectTable(table._id)}
        >
          T{table.tableNumber}
        </button>
      ))}
    </div>
    <button className="btn btn-outline-light mt-3" onClick={onFreeTable} disabled={!selectedTable}>
      Free Selected Table
    </button>
  </div>
);

export default WaiterSidebar;
