import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li>
          <Link to="/campaigns">Campaigns</Link>
        </li>
        <li>
          <Link to="/clover">Clover Setup</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </aside>
  );
};
