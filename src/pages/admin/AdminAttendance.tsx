import React, { useEffect, useState } from 'react';
import '../../styles/pages/AdminDashboard.css';
import api from '../../services/api';

interface AttendanceItem {
  bookingId: number;
  dogName: string;
  ownerName: string;
  type: string;
  status: string;
  checkin_time: string | null;
  checkout_time: string | null;
}

const AdminAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/attendance/today');
        setAttendance(res.data);
      } catch (err) {
        console.error("Error loading attendance:", err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const checkIn = async (id: number) => {
    await api.post(`/attendance/${id}/checkin`);
    setAttendance(prev =>
      prev.map(a =>
        a.bookingId === id
          ? { ...a, status: 'checked_in', checkin_time: new Date().toISOString() }
          : a
      )
    );
  };

  const checkOut = async (id: number) => {
    await api.post(`/attendance/${id}/checkout`);
    setAttendance(prev =>
      prev.map(a =>
        a.bookingId === id
          ? { ...a, status: 'checked_out', checkout_time: new Date().toISOString() }
          : a
      )
    );
  };

  const formatTime = (time: string | null) =>
    time ? new Date(time).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Närvarolista – Idag</h1>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <p>Laddar...</p>
        ) : attendance.length === 0 ? (
          <p>Inga bokningar idag</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hund</th>
                <th>Ägare</th>
                <th>Typ</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.bookingId}>
                  <td>{a.dogName}</td>
                  <td>{a.ownerName}</td>
                  <td>{a.type}</td>
                  <td className={a.status}>
                    {a.status === 'pending' && 'Ej incheckad'}
                    {a.status === 'checked_in' && 'Incheckad'}
                    {a.status === 'checked_out' && 'Utcheckad'}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={a.status !== 'pending'}
                      onChange={() => checkIn(a.bookingId)}
                      disabled={a.status !== 'pending'}
                    />
                    <span>{formatTime(a.checkin_time)}</span>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={a.status === 'checked_out'}
                      onChange={() => checkOut(a.bookingId)}
                      disabled={a.status !== 'checked_in'}
                    />
                    <span>{formatTime(a.checkout_time)}</span>
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

export default AdminAttendance;
