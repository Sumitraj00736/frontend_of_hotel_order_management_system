import React, { useMemo, useState } from 'react';

const AdminTables = ({ tables, tableForm, setTableForm, onCreateTable, onFreeTable, onUpdateTable }) => {
  const [dragId, setDragId] = useState(null);

  const maxRow = useMemo(() => Math.max(5, ...tables.map((t) => t.row || 1)), [tables]);
  const maxCol = useMemo(() => Math.max(5, ...tables.map((t) => t.column || 1)), [tables]);
  const tableMap = useMemo(() => {
    const map = new Map();
    tables.forEach((t) => {
      const key = `${t.row || 1}-${t.column || 1}`;
      map.set(key, t);
    });
    return map;
  }, [tables]);

  const handleDrop = (row, col) => {
    if (!dragId) return;
    onUpdateTable(dragId, { row, column: col });
    setDragId(null);
  };

  return (
    <div className="card glass-card full-screen-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-0">Tables & Layout</h5>
          <div className="text-muted small">Drag tables to arrange; add new tables with row/column</div>
        </div>
        <div className="d-flex gap-2">
          <input className="form-control" style={{ width: 120 }} placeholder="Table #" value={tableForm.tableNumber} onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })} />
          <input className="form-control" style={{ width: 90 }} placeholder="Row" value={tableForm.row || ''} onChange={(e) => setTableForm({ ...tableForm, row: e.target.value })} />
          <input className="form-control" style={{ width: 90 }} placeholder="Col" value={tableForm.column || ''} onChange={(e) => setTableForm({ ...tableForm, column: e.target.value })} />
          <button className="btn btn-primary" onClick={onCreateTable}>Add</button>
        </div>
      </div>

      <div className="table-grid">
        {Array.from({ length: maxRow }).map((_, rIdx) => (
          <div key={rIdx} className="table-grid-row">
            {Array.from({ length: maxCol }).map((__, cIdx) => {
              const row = rIdx + 1;
              const col = cIdx + 1;
              const key = `${row}-${col}`;
              const table = tableMap.get(key);
              return (
                <div
                  key={key}
                  className={`table-grid-cell ${table ? 'occupied-cell' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(row, col)}
                >
                  <div className="text-muted tiny">R{row} C{col}</div>
                  {table && (
                    <div
                      draggable
                      onDragStart={() => setDragId(table._id)}
                      className={`table-chip ${table.status === 'occupied' ? 'occupied' : 'active'}`}
                    >
                      <div className="fw-semibold">Table {table.tableNumber}</div>
                      <div className="text-muted small">Status: {table.status}</div>
                      <div className="d-flex gap-1 mt-1">
                        <button className="btn btn-sm btn-outline-light" onClick={() => onFreeTable(table._id)}>
                          Free
                        </button>
                        <button
                          className="btn btn-sm btn-outline-light"
                          onClick={() => onUpdateTable(table._id, { row: table.row || row, column: table.column || col })}
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTables;
