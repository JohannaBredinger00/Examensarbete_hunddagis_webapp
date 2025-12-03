import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dogsAPI, bookingsAPI } from '../services/api';
import { Dog, Booking } from '../types/types';
import '../styles/pages/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

        console.log('Loggen in user:', user);

  const [dogs, setDogs] = useState<Dog[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Hämta hundar
      const dogsResponse = await dogsAPI.getMyDogs();
      setDogs(dogsResponse.data);
      
      // Hämta bokningar
      const bookingsResponse = await bookingsAPI.getMyBookings();
      setBookings(bookingsResponse.data);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Räkna kommande bokningar (framtida datum)
  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.date) >= new Date()
  );

  // Räkna tidigare besök (förflutna datum)
  const pastBookings = bookings.filter(booking => 
    new Date(booking.date) < new Date()
  );

  // Senaste bokningarna (max 3)
  const recentBookings = bookings
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);


  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Välkommen, {user?.name}! </h1>
        <p>Du är inloggad som: <span className="user-role">{user?.role}</span></p>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2> Hunddagis App</h2>
          <p>Hantera dina hundar och bokningar på ett enkelt sätt</p>
        </div>

        <div className="quick-stats">
          <h3>Snabböversikt</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{dogs.length}</span>
              <span className="stat-label">Mina hundar</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{upcomingBookings.length}</span>
              <span className="stat-label">Kommande bokningar</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{pastBookings.length}</span>
              <span className="stat-label">Tidigare besök</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="quick-actions">
            <h3>Snabba åtgärder</h3>
            <div className="actions-grid">
              <Link to="/my-bookings" className="action-btn primary">
                Boka ny tid
              </Link>
              <Link to="/my-dogs" className="action-btn secondary">
                {dogs.length === 0 ? 'Lägg till första hunden' : 'Lägg till hund'}
              </Link>
              <Link to="/my-bookings" className="action-btn secondary">
                Mina bokningar ({bookings.length})
              </Link>
              <Link to="/profile" className="action-btn secondary">
                Min profil
              </Link>
            </div>
          </div>

          {recentBookings.length > 0 && (
            <div className="recent-bookings">
              <h3>Senaste bokningar</h3>
              <div className="bookings-list">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-date">
                      {new Date(booking.date).toLocaleDateString('sv-SE')}
                    </div>
                    <div className="booking-details">
                      <strong>{booking.dog_name}</strong>
                      <span className={`booking-type ${booking.type}`}>
                        {booking.type === 'full_day' ? 'Heldag' : 'Halvdag'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {user?.role === 'admin' && (
          <div className="admin-section">
            <h3>Admin Verktyg</h3>
            <div className="admin-actions">
              <button className="admin-btn">
                Alla bokningar
              </button>
              <button className="admin-btn">
                Närvarolista
              </button>
              <button className="admin-btn">
                Alla hundar
              </button>
            </div>
          </div>
        )}

       
        
      </div>
    </div>
  );
};

export default Dashboard;