import React from 'react';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p className="dashboard-number">--</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p className="dashboard-number">$--</p>
        </div>
        <div className="dashboard-card">
          <h3>Active Products</h3>
          <p className="dashboard-number">--</p>
        </div>
        <div className="dashboard-card">
          <h3>Pending Orders</h3>
          <p className="dashboard-number">--</p>
        </div>
      </div>
    </div>
  );
};
