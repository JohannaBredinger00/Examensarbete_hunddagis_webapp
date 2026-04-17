import React, { useEffect, useState } from 'react';
import '../../styles/pages/admin/AdminDogs.css';
import { adminDogsAPI } from '../../services/api';

interface AdminDog {
  id: number;
  name: string;
  breed?: string;
  age?: number;
  allergies?: string;
  ownerName?: string;
  ownerPhone?: string;
}

const AdminDogs: React.FC = () => {
  const [dogs, setDogs] = useState<AdminDog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const res = await adminDogsAPI.getAllDogs();
        setDogs(res.data);
      } catch (err) {
        console.error("Error loading dogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDogs();
  }, []);

  const handleChange = (id: number, field: keyof AdminDog, value: string | number) => {
    setDogs(prev =>
      prev.map(d => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, type});

    setTimeout(() => {
      setToast(null);
    }, 1500); 
  };

  const handleUpdateDog = async (id: number) => {
    const dog = dogs.find(d => d.id === id);
    if (!dog) return;

    setUpdatingId(id);

    try {
      // Typa svaret korrekt
      const res = await adminDogsAPI.updateDog(id, {
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        allergies: dog.allergies,
      });

      // Uppdatera state direkt med det nya objektet
      setDogs(prevDogs =>
        prevDogs.map(d => (d.id === id ? { ...d, ...res.data.dog } : d))
      );

     showToast(res.data.message || 'Hund uppdaterad!', 'success');
    } catch (err: any) {
      console.error("Error updating dog:", err);
      showToast(err.response?.data?.message || "Kunde inte uppdatera hunden!");
    } finally {
      setUpdatingId(null);
    }
  };
return (
  <>
    {/* Toast */}
    {toast && (
      <div className={`toast toast-${toast.type}`}>
        {toast.message}
      </div>
    )}

    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1>Alla Hundar</h1>
      </header>

      <div className="admin-dashboard-content">
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
                <th>Åtgärd</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map(d => (
                <tr key={d.id}>
                  <td>
                    <input
                      type="text"
                      value={d.name}
                      onChange={e => handleChange(d.id, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={d.breed || ''}
                      onChange={e => handleChange(d.id, 'breed', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={d.age || ''}
                      onChange={e => handleChange(d.id, 'age', Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={d.allergies || ''}
                      onChange={e => handleChange(d.id, 'allergies', e.target.value)}
                    />
                  </td>
                  <td>{d.ownerName}</td>
                  <td>{d.ownerPhone || '-'}</td>
                  <td>
                    <button
                      className="btn-update"
                      onClick={() => handleUpdateDog(d.id)}
                      disabled={updatingId === d.id}
                    >
                      {updatingId === d.id ? 'Uppdaterar...' : 'Uppdatera'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </>
);
};

export default AdminDogs;
