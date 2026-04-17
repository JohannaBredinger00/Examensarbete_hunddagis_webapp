import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dogsAPI } from '../services/api';
import { Dog } from '../types/types';
import '../styles/pages/MyDogs.css';

const BACKEND_URL = 'http://localhost:5001'; // För att bygga bild-URL

const MyDogs: React.FC = () => {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const [dogForm, setDogForm] = useState({
    name: '',
    breed: '',
    age: '',
    allergies: ''
  });

  //const [error, setError] = useState('');
  //const [success, setSuccess] = useState('');

  // ---------------------------------------------------
  // Ladda hundar vid start
  // ---------------------------------------------------
  useEffect(() => {
    loadDogs();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, type});

    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const loadDogs = async () => {
    try {
      setIsLoading(true);
      const response = await dogsAPI.getMyDogs();
      setDogs(response.data);
      //showToast('');
    } catch (error: any) {
      console.error('Error loading dogs:', error);
      showToast('Kunde inte ladda hundar. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------
  // Lägg till hund
  // ---------------------------------------------------
  const handleAddDog = async () => {
    console.log('Submitting dogForm:', dogForm);

    if (!dogForm.name.trim()) {
      showToast('Hundens namn är obligatoriskt');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', dogForm.name.trim());
      if (dogForm.breed) formData.append('breed', dogForm.breed.trim());
      if (dogForm.age) formData.append('age', dogForm.age.toString());
      if (dogForm.allergies) formData.append('allergies', dogForm.allergies.trim());
      if (imageFile) formData.append('image', imageFile);
      await dogsAPI.addDog(formData);

      showToast('Hund tillagd!');
      await loadDogs();
      resetForm();
      setShowAddForm(false);
    } catch (error: any) {
      console.error('Error adding dog:', error);
      showToast(error.response?.data?.message || 'Kunde inte lägga till hunden.');
    }
  };


  // ---------------------------------------------------
  // Uppdatera hund med bildstöd
const handleUpdateDog = async () => {
  if (!editingDog) return;

  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, type});

    setTimeout(() => {
      setToast(null);
    }, 1500)
  };

  try {
    const formData = new FormData();
    formData.append('name', dogForm.name.trim());
    if (dogForm.breed) formData.append('breed', dogForm.breed.trim());
    if (dogForm.age) formData.append('age', dogForm.age);
    if (dogForm.allergies) formData.append('allergies', dogForm.allergies.trim());
    if (imageFile) formData.append('image', imageFile); // ny bild, om laddad

    // Skicka FormData till backend
    const response = await dogsAPI.updateDog(editingDog.id, formData);

    // Uppdatera hunden i state med data som backend returnerar
    setDogs(prev =>
      prev.map(d =>
        d.id === editingDog.id ? response.data.dog : d)
    );

    showToast(response.data.message || 'Hund uppdaterad!', 'success');
    resetForm();
    setEditingDog(null);
    setShowAddForm(false);
    setImageFile(null); // återställ filen
  } catch (error: any) {
    console.error('Error updating dog:', error);
    showToast(error.response?.data?.message || 'Kunde inte uppdatera hunden.');
  }
};


  // ---------------------------------------------------
  // Ta bort hund
  // ---------------------------------------------------

  const [confirmToast, setConfirmToast] = useState<{
  message: string;
  onConfirm: () => void;
} | null>(null);

  const handleDeleteDog = async (dogId: number) => {
    setConfirmToast({
      message:"Är du säker på att du vill ta bort denna hund?",
      onConfirm: async () => {
        setConfirmToast(null);
    try {
      await dogsAPI.deleteDog(dogId);
      setDogs(prev => prev.filter(d => d.id !== dogId));
      showToast('Hund borttagen!', 'success');
    } catch (error: any) {
      console.error('Error deleting dog:', error);
      showToast(error.response?.data?.message || 'Kunde inte ta bort hunden.');
    }
  }
});
};

  // ---------------------------------------------------
  // Starta redigering
  // ---------------------------------------------------
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

  const resetForm = () => {
    setDogForm({ name: '', breed: '', age: '', allergies: '' });
    setEditingDog(null);
    //showToast('');
    //showToast('');
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //showToast('');
    //showToast('');
    if (editingDog) await handleUpdateDog();
    else await handleAddDog();
  };

   return (
    <>
    {confirmToast && (
      <div className="toast toast-confirm">
        <p>{confirmToast.message}</p>
        <div className="toast-buttons">
          <button className="btn-mydogs-primary" onClick={confirmToast.onConfirm}>
            Ja
          </button>
          <button className="btn-mydogs-secondary" onClick={() => setConfirmToast(null)}>
            Nej
          </button>
        </div>
      </div>
    )}
    {toast && (
    <div className={`toast toast-${toast.type}`}>
      {toast.message}
    </div>
   )}

    <div className="my-dogs">
      <header className="dogs-header">
        <h1>Mina Hundar</h1>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          className="add-dog-btn"
        >
          {showAddForm ? '✕ Avbryt' : '+ Lägg till hund'}
        </button>
      </header>

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
              onChange={(e) => setDogForm({ ...dogForm, allergies: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Bild</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-update">
              {editingDog ? 'Uppdatera hund' : 'Spara hund'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowAddForm(false);
              }}
              className="btn-cancel-mydogs"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}

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
              <img
                src={dog.image ? `http://localhost:5001/uploads/${dog.image}` : '/dog-placeholder.png'}
                alt={dog.name}
                className="dog-image"
              />
              <h3>{dog.name}</h3>
              <p><strong>Ras:</strong> {dog.breed || 'Ej angiven'}</p>
              <p><strong>Ålder:</strong> {dog.age ? `${dog.age} år` : 'Ej angiven'}</p>
              <p><strong>Allergier:</strong> {dog.allergies || 'Inga'}</p>

              <div className="dog-actions">
                <button type="button" onClick={() => startEdit(dog)} className="btn-mydogs-edit">
                  Redigera
                </button>
                <button onClick={() => handleDeleteDog(dog.id)} className="btn-mydogs-remove">
                  Ta bort
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default MyDogs;
