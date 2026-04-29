import React from 'react';

const DayBookHeader = ({ title = 'Day Book', subtitle = 'Finance / Day Book', children }) => {
  return (
    <header className="fd-header">
      <div className="fd-header-content">
        <div>
          <h1 className="fd-title">{title}</h1>
          <p className="fd-card-sub">{subtitle}</p>
        </div>

        <div className="fd-header-actions">
          {children}
        </div>
      </div>
    </header>
  );
};

export default DayBookHeader;
