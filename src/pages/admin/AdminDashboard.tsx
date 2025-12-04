import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="dashboard-content">
        <div className="admin-section">
          <h3>Admin Verktyg</h3>
          <div className="admin-actions">
            <Link to="/admin/dogs" className="admin-btn">Alla hundar</Link>
            <Link to="/admin/attendance" className="admin-btn">Närvarolista</Link>
            <Link to="/admin/bookings" className="admin-btn">Alla bokningar</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
