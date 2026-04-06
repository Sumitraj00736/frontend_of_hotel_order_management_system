import React from 'react';
import { Plus } from 'lucide-react';

const OverviewBestSellingBanner = ({ bestSelling }) => (
  <div className="best-selling-banner">
    <div className="banner-content">
      <div className="banner-title">Do you know your best-selling dishes?</div>
      <div className="banner-sub">
        We have listed the top 5 best-selling dishes, top categories, and add-ons here.
      </div>
      <button className="banner-btn">
        <Plus size={16} /> Add New Dish
      </button>
    </div>
    <div className="banner-cards">
      <div className="panel banner-card">
        <div className="panel-heading">
          <div className="panel-title">Top Selling Dishes</div>
          <button className="panel-link">View All</button>
        </div>
        <div className="panel-sub">More people loved these dishes.</div>
        {bestSelling?.dishes?.length ? (
          <div className="list-stack">
            {bestSelling.dishes.map((row) => (
              <div key={row._id} className="list-row">
                <span>{row._id}</span>
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
          <div className="panel-title">Top Selling Add-Ons</div>
          <button className="panel-link">View All</button>
        </div>
        <div className="panel-sub">More people loved these add-ons.</div>
        {bestSelling?.addons?.length ? (
          <div className="list-stack">
            {bestSelling.addons.map((row) => (
              <div key={row._id} className="list-row">
                <span>{row.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-illustration">No Add-Ons Sold Yet!</div>
        )}
      </div>
      <div className="panel banner-card">
        <div className="panel-heading">
          <div className="panel-title">Top Selling Category</div>
          <button className="panel-link">View All</button>
        </div>
        <div className="panel-sub">More people loved this category.</div>
        {bestSelling?.categories?.length ? (
          <div className="list-stack">
            {bestSelling.categories.map((row) => (
              <div key={row._id} className="list-row">
                <span>{row.name}</span>
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
