import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import '../styles/Layout.css';

export const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
};
