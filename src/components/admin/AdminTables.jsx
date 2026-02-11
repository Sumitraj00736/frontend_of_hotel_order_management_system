import React from 'react';

const AdminTables = ({ tables, tableForm, setTableForm, onCreateTable, onFreeTable }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Tables</h5>
    <div className="d-flex gap-2 mb-3">
      <input className="form-control" placeholder="Table Number" value={tableForm.tableNumber} onChange={(e) => setTableForm({ tableNumber: e.target.value })} />
      <button className="btn btn-primary" onClick={onCreateTable}>Add</button>
    </div>
    <ul className="list-group">
      {tables.map((table) => (
        <li key={table._id} className="list-group-item d-flex justify-content-between align-items-center">
          <span>Table {table.tableNumber}</span>
          <div className="d-flex gap-2 align-items-center">
            <span className="badge bg-secondary">{table.status}</span>
            <button className="btn btn-sm btn-outline-light" onClick={() => onFreeTable(table._id)}>
              Free
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminTables;
