import React, { useEffect, useState } from 'react';
import '../../styles/pages/AdminDashboard.css';
import api from '../../services/api';


interface Dog {
  id: number;
  name: string;
  breed?: string;
  age?: number;
  allergies?: string;
  ownerName: string;
  ownerPhone?: string;
}

const AdminDogs: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const res = await api.get('/admin/dogs/all');
        setDogs(res.data);
      } catch (err) {
        console.error("Error loading dogs:", err);
      }
      setLoading(false);
    };
    fetchDogs();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Alla Hundar</h1>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <p>Laddar...</p>
        ) : dogs.length === 0 ? (
          <p>Inga hundar registrerade</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Namn</th>
                <th>Ras</th>
                <th>Ålder</th>
                <th>Allergier</th>
                <th>Ägare</th>
                <th>Telefon</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map(d => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.breed || '-'}</td>
                  <td>{d.age || '-'}</td>
                  <td>{d.allergies || '-'}</td>
                  <td>{d.ownerName}</td>
                  <td>{d.ownerPhone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDogs;
