import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dogsAPI } from '../services/api';
import { Dog } from '../types/types';
import '../styles/pages/MyDogs.css';

const MyDogs: React.FC = () => {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);

  const [dogForm, setDogForm] = useState({
    name: '',
    breed: '',
    age: '',
    allergies: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ---------------------------------------------------
  // Ladda hundar vid start
  // ---------------------------------------------------
  useEffect(() => {
    loadDogs();
  }, []);

  const loadDogs = async () => {
    try {
      setIsLoading(true);
      const response = await dogsAPI.getMyDogs();

      console.log("Dogs loaded:", response.data);
      setDogs(response.data);
      setError('');
    } catch (error: any) {
      console.error('Error loading dogs:', error);
      setError('Kunde inte ladda hundar. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------
  // Lägg till hund
  // ---------------------------------------------------
  const handleAddDog = async () => {
    if (!dogForm.name.trim()) {
      setError('Hundens namn är obligatoriskt');
      return;
    }
    try {
      await dogsAPI.addDog({
        name: dogForm.name.trim(),
        breed: dogForm.breed.trim() || undefined,
        age: dogForm.age ? parseInt(dogForm.age) : undefined,
        allergies: dogForm.allergies.trim() || undefined
      });

      setSuccess('Hund tillagd!');
      await loadDogs();
      resetForm();
      setShowAddForm(false);
    } catch (error: any) {
      console.error('Error adding dog:', error);
      setError(error.response?.data?.message || 'Kunde inte lägga till hunden.');
    }
  };

  
  // Uppdatera hund
  const handleUpdateDog = async () => {
    if (!editingDog) return;

    try {
      await dogsAPI.updateDog(editingDog.id, {
        name: dogForm.name.trim(),
        breed: dogForm.breed.trim() || undefined,
        age: dogForm.age ? parseInt(dogForm.age) : undefined,
        allergies: dogForm.allergies.trim() || undefined
      });

      setSuccess('Hund uppdaterad!');
      await loadDogs();
      resetForm();
      setEditingDog(null);
    } catch (error: any) {
      console.error('Error updating dog:', error);
      setError(error.response?.data?.message || 'Kunde inte uppdatera hunden.');
    }
  };

 
  // Ta bort hund
  const handleDeleteDog = async (dogId: number) => {
    if (!window.confirm('Är du säker på att du vill ta bort denna hund?')) return;

    try {
      await dogsAPI.deleteDog(dogId);
      setSuccess('Hund borttagen!');
      await loadDogs();
    } catch (error: any) {
      console.error('Error deleting dog:', error);
      setError(error.response?.data?.message || 'Kunde inte ta bort hunden.');
    }
  };


  // Starta redigering
  const startEdit = (dog: Dog) => {
    setEditingDog(dog);
    setDogForm({
      name: dog.name,
      breed: dog.breed || '',
      age: dog.age?.toString() || '',
      allergies: dog.allergies || ''
    });
    setShowAddForm(true);
  };

  // Reset form
  const resetForm = () => {
    setDogForm({ name: '', breed: '', age: '', allergies: '' });
    setEditingDog(null);
    setError('');
    setSuccess('');
  };

  // Hantera formulär-submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (editingDog) {
      await handleUpdateDog();
    } else {
      await handleAddDog();
    }
  };

  return (
    <div className="my-dogs">
      <header className="dogs-header">
        <h1>Mina Hundar</h1>
        <button
        type='button'
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm); 
          }}
          className="add-dog-btn"
        >
          {showAddForm ? '✕ Avbryt' : '+ Lägg till hund'}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* FORM */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-dog-form">
          <h3>{editingDog ? 'Redigera hund' : 'Lägg till ny hund'}</h3>

          <div className="form-group">
            <label>Namn*</label>
            <input
              type="text"
              value={dogForm.name}
              onChange={(e) => setDogForm({ ...dogForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Ras</label>
            <input
              type="text"
              value={dogForm.breed}
              onChange={(e) => setDogForm({ ...dogForm, breed: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Ålder</label>
            <input
              type="number"
              value={dogForm.age}
              onChange={(e) => setDogForm({ ...dogForm, age: e.target.value })}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Allergier*</label>
            <input
              type="text"
              value={dogForm.allergies}
              onChange={(e) =>
                setDogForm({ ...dogForm, allergies: e.target.value })
              }
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingDog ? 'Uppdatera hund' : 'Spara hund'}
            </button>
            <button type="button" onClick={() => {
              resetForm();
              setShowAddForm(false);
            }}
            className="btn-secondary"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}

      {/* HUNDLISTA */}
      <div className="dogs-grid">
        {isLoading ? (
          <p>Laddar hundar...</p>
        ) : dogs.length === 0 ? (
          <div className="no-dogs">
            <p>Du har inga hundar registrerade än.</p>
            <p>Lägg till din första hund ovan!</p>
          </div>
        ) : (
          dogs.map((dog) => (
            <div key={dog.id} className="dog-card">
              <h3>{dog.name}</h3>
              <p><strong>Ras:</strong> {dog.breed || 'Ej angiven'}</p>
              <p><strong>Ålder:</strong> {dog.age ? `${dog.age} år` : 'Ej angiven'}</p>
              <p><strong>Allergier:</strong> {dog.allergies || 'Inga'}</p>

              <div className="dog-actions">
                <button 
                type="button"
                onClick={() => startEdit(dog)}
                className="btn-secondary"
                >
                  Redigera
                </button>
                <button
                onClick={() => handleDeleteDog(dog.id)}
                className="btn-danger"
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyDogs;
