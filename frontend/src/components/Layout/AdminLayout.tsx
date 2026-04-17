import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-links">
          <Link
            to="/admin/dashboard"
            className={location.pathname === '/admin/dashboard' ? 'active nav-link' : 'nav-link'}
          >
            Admin Dashboard
          </Link>

          <Link
            to="/admin/dogs"
            className={location.pathname === '/admin/dogs' ? 'active nav-link' : 'nav-link'}
          >
            Alla Hundar
          </Link>

          <Link
            to="/admin/attendance"
            className={location.pathname === '/admin/attendance' ? 'active nav-link' : 'nav-link'}
          >
            Närvarolista
          </Link>

          <Link
            to="/admin/bookings"
            className={location.pathname === '/admin/bookings' ? 'active nav-link' : 'nav-link'}
          >
            Alla Bokningar
          </Link>
        </div>

        <div className="nav-user">
          <button onClick={logout}>Logga ut</button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet /> {/* Barnroutes renderas här */}
      </main>
    </div>
  );
};

export default AdminLayout;
