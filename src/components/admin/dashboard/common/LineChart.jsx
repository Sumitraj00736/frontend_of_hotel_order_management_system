import React from 'react';

const LineChart = ({ data = [], xKey = 'label', yKey = 'value' }) => {
  if (!data.length) {
    return <div className="chart-placeholder">No data</div>;
  }
  const values = data.map((d) => Number(d[yKey]) || 0);
  const max = Math.max(...values, 1);
  const points = values
    .map((val, idx) => {
      const x = (idx / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - (val / max) * 80 - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" className="mini-line-chart">
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2" />
    </svg>
  );
};

export default LineChart;
