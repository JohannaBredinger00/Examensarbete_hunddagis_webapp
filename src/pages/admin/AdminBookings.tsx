import React, { useEffect, useState } from 'react';
import '../../styles/pages/admin/AdminBookings.css';
import api from '../../services/api';

interface Booking {
  id: number;
  dog_name: string;
  owner_name: string;
  date: string;
  type: string;
  status: string;
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/bookings/all');
        console.log("Data från API:", res.data);
        setBookings(
          res.data.sort((a: Booking, b: Booking) => (a.status === 'pending' ? -1 : 1))
        );
      } catch (err) {
        console.error("Error loading bookings:", err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const approve = async (id: number) => {
    await api.post(`/bookings/${id}/approve`);
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'approved' } : b))
    );
  };

  const reject = async (id: number) => {
    await api.post(`/bookings/${id}/reject`);
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'rejected' } : b))
    );
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1>Alla Bokningar</h1>
      </header>

      <div className="admin-dashboard-content">
        {loading ? (
          <p>Laddar...</p>
        ) : bookings.length === 0 ? (
          <p>Inga bokningar</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hund</th>
                <th>Ägare</th>
                <th>Datum</th>
                <th>Typ</th>
                <th>Status</th>
                <th>Åtgärd</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.dog_name}</td>
                  <td>{b.owner_name}</td>
                  <td>{formatDate(b.date)}</td>
                  <td>{b.type}</td>
                  <td className={b.status}>{b.status}</td>
                  <td>
                    {b.status === 'pending' && (
                      <>
                        <button className="btn-approve" onClick={() => approve(b.id)}>
                          Godkänn
                        </button>
                        <button className="btn-reject" onClick={() => reject(b.id)}>
                          Neka
                        </button>
                      </>
                    )}

                    {b.status !== 'pending' && <span>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
