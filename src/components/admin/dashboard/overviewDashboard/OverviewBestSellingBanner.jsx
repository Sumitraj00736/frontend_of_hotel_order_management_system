import React from 'react';
import { Plus, UtensilsCrossed, CupSoda, LayoutGrid } from 'lucide-react';

const BannerCard = ({ icon, title, subtitle, items, emptyMsg }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 flex flex-col gap-3 min-w-[200px] flex-1">
    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
      <span className="p-1.5 rounded-lg bg-white/60 border border-slate-200/60 text-slate-600">{icon}</span>
      {title}
    </div>
    <p className="text-xs font-semibold text-slate-400">{subtitle}</p>
    {items?.length ? (
      <div className="flex flex-col gap-1.5 mt-1">
        {items.slice(0, 5).map((row, index) => (
          <div key={row._id || index} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/60 transition-colors">
            <span className="text-xs font-semibold text-slate-700 truncate">
              {index + 1}. {row._id || row.name}
            </span>
            <span className="text-xs font-black text-slate-800">{row.qty || row.total || 0}</span>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex items-center justify-center py-6 text-xs font-semibold text-slate-400">{emptyMsg}</div>
    )}
  </div>
);

const OverviewBestSellingBanner = ({ bestSelling }) => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-6 shadow-lg shadow-orange-200/50">
    {/* Background decorative circle */}
    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
    <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />

    <div className="relative z-10 flex flex-col lg:flex-row gap-6">
      {/* Left CTA */}
      <div className="flex flex-col gap-3 justify-center lg:w-64 shrink-0">
        <h3 className="text-xl font-black text-white leading-tight">
          Do you know your best-selling dishes?
        </h3>
        <p className="text-sm font-semibold text-white/80">
          Unlock top 5 best selling dishes, categories, and add-ons here.
        </p>
        <button className="flex items-center gap-2 w-fit px-4 py-2 bg-white text-orange-500 text-xs font-black rounded-xl hover:bg-orange-50 transition-colors shadow-sm">
          <Plus size={14} />
          Add New Dish
        </button>
      </div>

      {/* Cards Row */}
      <div className="flex gap-4 flex-1 overflow-x-auto pb-1">
        <BannerCard
          icon={<UtensilsCrossed size={15} />}
          title="Top Selling Dishes"
          subtitle="More people loved these dishes."
          items={bestSelling?.dishes}
          emptyMsg="No Dishes Sold Yet!"
        />
        <BannerCard
          icon={<CupSoda size={15} />}
          title="Top Selling Add-Ons"
          subtitle="More people loved these add-ons."
          items={bestSelling?.addons}
          emptyMsg="No Add-Ons Sold Yet!"
        />
        <BannerCard
          icon={<LayoutGrid size={15} />}
          title="Top Selling Category"
          subtitle="More people loved this category."
          items={bestSelling?.categories}
          emptyMsg="No Categories Sold Yet!"
        />
      </div>
    </div>
  </div>
);

export default OverviewBestSellingBanner;
