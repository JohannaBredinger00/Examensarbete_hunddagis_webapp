import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/dashboard"><h2>Hunddagis</h2></Link>
        </div>

        <div className="nav-links">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active nav-link' : 'nav-link'}>Dashboard</Link>
          <Link to="/my-dogs" className={location.pathname === '/my-dogs' ? 'active nav-link' : 'nav-link'}>Mina Hundar</Link>
          <Link to="/my-bookings" className={location.pathname === '/my-bookings' ? 'active nav-link' : 'nav-link'}>Mina Bokningar</Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active nav-link' : 'nav-link'}>Min Profil</Link>
        </div>

        <div className="nav-user">
          <span>Hej, {user?.name}</span>
          <button onClick={logout}>Logga ut</button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;
