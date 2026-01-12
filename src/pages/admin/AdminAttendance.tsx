import React, { useEffect, useState } from 'react';
import '../../styles/pages/admin/AdminAttendance.css';
import { attendanceAPI } from '../../services/api';

interface AttendanceItem {
  bookingId: number;
  dog_name: string;
  owner_name: string;
  type: string;
  status: string;
  checkin_time: string | null;
  checkout_time: string | null;
}

const AdminAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const loadAttendance = async () => {
      setLoading(true);
      try {
        console.log('Laddar närvaro från API...');
        const res = await attendanceAPI.getToday();
        console.log('API response:', res.data);
        const data = Array.isArray(res.data) ? res.data : res.data.attendance || [];
        setAttendance(res.data);
      } catch (err: any) {
        console.error('Error loading attendance:', err.response?.data || err.message);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, []);

  const checkIn = async (id: number) => {
    setUpdatingId(id);
    try {
      await attendanceAPI.checkIn(id);
      setAttendance(prev =>
        prev.map(a =>
          a.bookingId === id
            ? { ...a, status: 'checked_in', checkin_time: new Date().toISOString() }
            : a
        )
      );
    } catch (err) {
      console.error('Check-in failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const checkOut = async (id: number) => {
    setUpdatingId(id);
    try {
      await attendanceAPI.checkOut(id);
      setAttendance(prev => prev.filter(a => a.bookingId !== id));
     /* setAttendance(prev =>
        prev.map(a =>
          a.bookingId === id
            ? { ...a, status: 'checked_out', checkout_time: new Date().toISOString() }
            : a
        )
      ); */
    } catch (err) {
      console.error('Check-out failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatTime = (time: string | null) =>
    time ? new Date(time).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1>Närvarolista – Idag</h1>
      </header>

      <div className="admin-dashboard-content">
        {loading && <p>Laddar...</p>}
        {!loading && attendance.length === 0 && <p>Inga bokningar idag</p>}
        {!loading && attendance.length > 0 && (
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
              {attendance.map(a => {
                return (
                  <tr key={a.bookingId}>
                    <td>{a.dog_name}</td>
                    <td>{a.owner_name}</td>
                    <td>{a.type}</td>
                    <td className={a.status}>
                      {a.status === 'booked' && 'Ej incheckad'}
                      {a.status === 'checked_in' && 'Incheckad'}
                      {a.status === 'checked_out' && 'Utcheckad'}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={a.status === 'checked_in' || a.status === 'checked_out'}
                        onChange={() => checkIn(a.bookingId)}
                        disabled={a.status !== 'booked' || updatingId === a.bookingId}
                      />
                      <span>{formatTime(a.checkin_time)}</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={a.status === 'checked_out'}
                        onChange={() => checkOut(a.bookingId)}
                        disabled={a.status !== 'checked_in' || updatingId === a.bookingId}
                      />
                      <span>{formatTime(a.checkout_time)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
