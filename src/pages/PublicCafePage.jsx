import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../common/css/public/cafePublic.css';

const PublicCafePage = () => {
  const { cafeSlug } = useParams();
  const [state, setState] = useState({ loading: true, error: '', cafe: null });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://hotel-order-management-system.onrender.com';
        const res = await fetch(`${baseUrl}/api/public/cafes/${cafeSlug}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Cafe not found');
        }
        const data = await res.json();
        if (active) {
          setState({ loading: false, error: '', cafe: data });
        }
      } catch (error) {
        if (active) {
          setState({ loading: false, error: error.message || 'Cafe not found', cafe: null });
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [cafeSlug]);

  if (state.loading) {
    return (
      <div className="public-cafe">
        <div className="public-card">Loading...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="public-cafe">
        <div className="public-card">
          <h2>Not Found</h2>
          <p>{state.error}</p>
        </div>
      </div>
    );
  }

  const cafeName = state.cafe?.name || cafeSlug;

  return (
    <div className="public-cafe">
      <header className="public-header">
        <div className="brand">merorestro</div>
      </header>
      <main className="public-content">
        <div className="public-card">
          <div className="public-avatar">{cafeName.slice(0, 2).toUpperCase()}</div>
          <h1>{cafeName}</h1>
          <p>Welcome to our cafe page.</p>
          <div className="public-actions">
            <button className="public-btn">Menu</button>
            <button className="public-btn">Delivery</button>
            <button className="public-btn ghost">Contact Us</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCafePage;
