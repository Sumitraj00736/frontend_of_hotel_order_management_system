import React, { useState } from 'react';
import { Home, ListChecks, Users, Table as TableIcon, BookOpen, Boxes, BarChart, History, ChevronDown, ChevronRight } from 'lucide-react';

const iconMap = {
  overview: <Home size={18} />,
  orders: <ListChecks size={18} />,
  users: <Users size={18} />,
  tables: <TableIcon size={18} />,
  menus: <BookOpen size={18} />,
  inventory: <Boxes size={18} />,
  reports: <BarChart size={18} />,
  history: <History size={18} />
};

const coreSections = ['overview', 'orders', 'users', 'tables', 'menus'];

const AdminSidebar = ({ activeSection, onSelect, isOpen = true }) => {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const handleInventoryToggle = () => setInventoryOpen((v) => !v);
  const handleReportsToggle = () => setReportsOpen((v) => !v);
  const isInventoryActive = activeSection.startsWith('inventory');
  const isReportsActive = activeSection.startsWith('reports');

  return (
    <div className={`sidebar slide ${isOpen ? 'open' : 'closed'}`}>
      {isOpen ? <h5 className="mb-2">Dashboard</h5> : <h5 className="mb-2 sidebar-hidden">Dashboard</h5>}

      <div className="sidebar-buttons">
        {coreSections.map((section) => (
          <button
            key={section}
            className={`sidebar-button ${activeSection === section ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
            onClick={() => onSelect(section)}
            title={section.toUpperCase()}
          >
            <span className="sidebar-icon">{iconMap[section]}</span>
            <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>{section.toUpperCase()}</span>
          </button>
        ))}

        {/* Inventory with sub-menu */}
        <div>
          <button
            className={`sidebar-button ${isInventoryActive ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
            onClick={() => (isOpen ? handleInventoryToggle() : onSelect('inventory:ingredients'))}
            title="INVENTORY"
          >
            <span className="sidebar-icon">{iconMap.inventory}</span>
            <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>INVENTORY</span>
            {isOpen && <span className="ms-auto">{inventoryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}
          </button>
          {isOpen && (
            <div className={`sidebar-sub ${inventoryOpen ? 'open' : ''}`}>
              <button
                className={`sidebar-button sub ${activeSection === 'inventory:ingredients' ? 'active' : ''}`}
                onClick={() => onSelect('inventory:ingredients')}
              >
                Ingredients
              </button>
              <button
                className={`sidebar-button sub ${activeSection === 'inventory:recipes' ? 'active' : ''}`}
                onClick={() => onSelect('inventory:recipes')}
              >
                Recipes
              </button>
              <button
                className={`sidebar-button sub ${activeSection === 'inventory:transactions' ? 'active' : ''}`}
                onClick={() => onSelect('inventory:transactions')}
              >
                Stock Transactions
              </button>
            </div>
          )}
        </div>

        {/* Reports with sub-menu */}
        <div>
          <button
            className={`sidebar-button ${isReportsActive ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
            onClick={() => (isOpen ? handleReportsToggle() : onSelect('reports:company'))}
            title="REPORTS"
          >
            <span className="sidebar-icon">{iconMap.reports}</span>
            <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>REPORTS</span>
            {isOpen && <span className="ms-auto">{reportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}
          </button>
          {isOpen && (
            <div className={`sidebar-sub ${reportsOpen ? 'open' : ''}`}>
              <button
                className={`sidebar-button sub ${activeSection === 'reports:company' ? 'active' : ''}`}
                onClick={() => onSelect('reports:company')}
              >
                Company
              </button>
              <button
                className={`sidebar-button sub ${activeSection === 'reports:waiter' ? 'active' : ''}`}
                onClick={() => onSelect('reports:waiter')}
              >
                Waiter
              </button>
              <button
                className={`sidebar-button sub ${activeSection === 'reports:kitchen' ? 'active' : ''}`}
                onClick={() => onSelect('reports:kitchen')}
              >
                Kitchen
              </button>
            </div>
          )}
        </div>

        {/* History at end */}
        <button
          className={`sidebar-button ${activeSection === 'history' ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
          onClick={() => onSelect('history')}
          title="HISTORY"
        >
          <span className="sidebar-icon">{iconMap.history}</span>
          <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>HISTORY</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
