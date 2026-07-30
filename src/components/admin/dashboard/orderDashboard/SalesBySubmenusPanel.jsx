import React from 'react';
import { PanelsTopLeft } from 'lucide-react';

const SalesBySubmenusPanel = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-500">
            <PanelsTopLeft size={16} />
          </span>
          Sales by Submenus
        </div>
        <p className="text-xs font-semibold text-slate-400 mt-1">Top Submenus</p>
      </div>
      <button className="text-xs font-bold text-orange-500 hover:underline">View All</button>
    </div>

    {/* Empty state */}
    <div className="flex items-center justify-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 py-12 text-xs font-semibold text-slate-400">
      No Sub Menus Sold Yet!
    </div>
  </div>
);

export default SalesBySubmenusPanel;
