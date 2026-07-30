import React from 'react';

const LineChart = ({ data = [], xKey = 'label', yKey = 'value' }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-lg h-12 w-full border border-slate-100">
        No data
      </div>
    );
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
    <svg viewBox="0 0 100 100" className="w-full h-12 text-blue-500 overflow-visible">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default LineChart;
