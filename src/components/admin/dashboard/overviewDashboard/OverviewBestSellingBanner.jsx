import React from 'react';
import { Plus, UtensilsCrossed, CupSoda, LayoutGrid } from 'lucide-react';

const OverviewBestSellingBanner = ({ bestSelling }) => (
  <div className="best-selling-banner">
    <div className="banner-content">
      <div className="banner-title">Do you know your best-selling dishes?</div>
      <div className="banner-sub">
        Unlock baked-in top 5 best selling dishes, top categories, and add-ons here.
      </div>
      <button className="banner-btn">
        <Plus size={16} /> Add New Dish
      </button>
    </div>
      <div className="banner-cards">
        <div className="panel banner-card">
          <div className="panel-heading">
            <div className="panel-title">
              <span className="panel-mini-icon"><UtensilsCrossed size={16} /></span>
              Top Selling Dishes
            </div>
          </div>
          <div className="panel-sub">More people loved these dishes.</div>
        {bestSelling?.dishes?.length ? (
          <div className="list-stack">
            {bestSelling.dishes.slice(0, 5).map((row, index) => (
              <div key={row._id} className="list-row">
                <span>{index + 1}. {row._id}</span>
                <span className="fw-600">{row.qty}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-illustration">No Dishes Sold Yet!</div>
        )}
      </div>
        <div className="panel banner-card">
          <div className="panel-heading">
            <div className="panel-title">
              <span className="panel-mini-icon"><CupSoda size={16} /></span>
              Top Selling Add-Ons
            </div>
          </div>
          <div className="panel-sub">More people loved these add-ons.</div>
        {bestSelling?.addons?.length ? (
          <div className="list-stack">
            {bestSelling.addons.slice(0, 5).map((row) => (
              <div key={row._id} className="list-row">
                <span>{row.name}</span>
                <span className="fw-600">{row.qty || row.total || 0}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-illustration">No Add-Ons Sold Yet!</div>
        )}
      </div>
        <div className="panel banner-card">
          <div className="panel-heading">
            <div className="panel-title">
              <span className="panel-mini-icon"><LayoutGrid size={16} /></span>
              Top Selling Category
            </div>
          </div>
          <div className="panel-sub">More people loved this category.</div>
        {bestSelling?.categories?.length ? (
          <div className="list-stack">
            {bestSelling.categories.slice(0, 5).map((row) => (
              <div key={row._id} className="list-row">
                <span>{row.name}</span>
                <span className="fw-600">{row.qty || row.total || 0}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-illustration">No Categories Sold Yet!</div>
        )}
      </div>
    </div>
  </div>
);

export default OverviewBestSellingBanner;
