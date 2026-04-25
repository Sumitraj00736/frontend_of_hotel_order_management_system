import React, { useMemo, useState } from 'react';
import CustomDropdown from '../../ui/CustomDropdown.jsx';

const AdminTables = ({ tables, tableForm, setTableForm, onCreateTable, onFreeTable, onUpdateTable, onDeleteTable }) => {
  const [dragId, setDragId] = useState(null);
  const [modal, setModal] = useState({ open: false, action: null, table: null });
  const [modalRow, setModalRow] = useState('');
  const [modalCol, setModalCol] = useState('');
  const [modalStatus, setModalStatus] = useState('');

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

  const openModal = (action, table, fallbackRow, fallbackCol) => {
    setModal({ open: true, action, table });
    setModalRow(table?.row || fallbackRow || '');
    setModalCol(table?.column || fallbackCol || '');
    setModalStatus(table?.status || 'available');
  };

  const closeModal = () => setModal({ open: false, action: null, table: null });

  const confirmModal = () => {
    if (!modal.table) return closeModal();
    const row = Number(modalRow) || modal.table.row || 1;
    const column = Number(modalCol) || modal.table.column || 1;
    onUpdateTable(modal.table._id, { row, column, status: modalStatus });
    closeModal();
  };

  return (
    <div className="card glass-card full-screen-card tables-grid-view">
      <div className="tables-grid-header">
        <div>
          <h5 className="mb-0 tables-grid-title">Tables & Layout</h5>
          <div className="text-muted small">Drag tables to arrange; add new tables with row/column</div>
        </div>
        <div className="tables-grid-actions">
          <input 
            className="form-control table-form-input" 
            placeholder="Table #" 
            value={tableForm.tableNumber} 
            onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })} 
          />
          <input 
            className="form-control table-form-input" 
            placeholder="Row" 
            value={tableForm.row || ''} 
            onChange={(e) => setTableForm({ ...tableForm, row: e.target.value })} 
          />
          <input 
            className="form-control table-form-input" 
            placeholder="Col" 
            value={tableForm.column || ''} 
            onChange={(e) => setTableForm({ ...tableForm, column: e.target.value })} 
          />
          <button className="btn btn-primary tables-add-btn" onClick={onCreateTable}>
            <span className="btn-icon">+</span> Add
          </button>
        </div>
      </div>

      <div className="table-grid-wrapper">
        <div className="table-grid">
          {Array.from({ length: maxRow }).map((_, rIdx) => (
            <div
              key={rIdx}
              className="table-grid-row"
              style={{ gridTemplateColumns: `repeat(${maxCol}, minmax(140px, 1fr))` }}
            >
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
                      <div className="table-actions">
                        <button className="btn btn-sm btn-outline-light" onClick={() => openModal('status', table, row, col)}>
                          View Status
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
      {modal.open && (
        <div className="modal-overlay fullscreen" onClick={closeModal}>
          <div className="modal-panel fullscreen small animate-in tables-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 modal-header-line">
              <div className="d-flex flex-column">
                <div className="eyebrow text-uppercase">Table</div>
                <h4 className="mb-0">Table {modal.table?.tableNumber}</h4>
                <div className="d-flex gap-2 mt-1">
                  <span className={`pill ${modalStatus === 'occupied' ? 'pill-amber' : 'pill-green'}`}>Status: {modalStatus}</span>
                  <span className="pill-neutral">Row {modal.table?.row || modalRow || '-'}</span>
                  <span className="pill-neutral">Col {modal.table?.column || modalCol || '-'}</span>
                </div>
              </div>
              <button className="btn btn-outline-light" onClick={closeModal}>Close</button>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">Row</label>
                <input className="form-control" value={modalRow} onChange={(e) => setModalRow(e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label">Column</label>
                <input className="form-control" value={modalCol} onChange={(e) => setModalCol(e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label">Status</label>
                <CustomDropdown
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  options={[
                    { value: 'available', label: 'Available' },
                    { value: 'occupied', label: 'Occupied' }
                  ]}
                  placeholder="Select status"
                />
              </div>
            </div>

            <div className="muted-box mt-3">Update position or status, or delete the table entirely.</div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-light" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { onDeleteTable(modal.table._id); closeModal(); }}>Delete</button>
              <button className="btn btn-primary" onClick={confirmModal}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;
