import React, { useEffect, useState } from 'react';
import { bookingsAPI, dogsAPI } from '../services/api';
import { Booking, Dog } from '../types/types';
import '../styles/pages/MyBookings.css';
import { stringify } from 'querystring';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  // Form state för ny bokning
  const [selectedDog, setSelectedDog] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState<'full_day' | 'half_day'>('full_day');

  // Modal state för redigering
  const [showModal, setShowModal] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState({ date: '', type: 'full_day' });

  useEffect(() => {
    loadBookings();
    loadDogs();
  }, []);

  // Hämta bokningar
  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingsAPI.getMyBookings();
      const sorted = [...response.data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setBookings(sorted);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hämta hundar
  const loadDogs = async () => {
    try {
      const response = await dogsAPI.getMyDogs();
      setDogs(response.data);
    } catch (error) {
      console.error('Error loading dogs:', error);
    }
  };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, type});

    setTimeout(() => {
      setToast(null);
    }, 1500); 
  };

  // Skapa ny bokning
  const createBooking = async () => {
    if (!selectedDog || !selectedDate) {
      showToast('Välj hund och datum.');
      return;
    }

    const today = new Date();
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (bookingDate < today) {
      showToast('Du kan inte boka ett datum som redan passerat', 'error');
      return;
    }
    try {
      await bookingsAPI.createBooking({
        dog_id: Number(selectedDog),
        date: selectedDate,
        type: selectedType,
      });
      setSelectedDog('');
      setSelectedDate('');
      setSelectedType('full_day');
      await loadBookings();
      showToast('Bokningen sparades!');
    } catch (error) {
      console.error('Error creating booking:', error);
      showToast('Kunde inte skapa bokning.');
    }
  };

  

  // Avboka bokning
  const [confirmToast, setConfirmToast] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);
  
  const cancelBooking = async (id: number) => {
    setConfirmToast({
      message:"Är du säker på att du vill avboka?",
      onConfirm: async () => {
        setConfirmToast(null);
    try {
      await bookingsAPI.updateBooking(id, { status: 'canceled' });
      showToast('Bokning avbokad!');
      loadBookings();
    } catch (error: any) {
      console.error('Error canceling booking:', error);
      showToast(error.response?.data?.message || 'Avbokningen misslyckades');
    }
  }
});
  };

  // Starta redigering
  const startEdit = (booking: Booking) => {
    setEditBooking(booking);
    setEditForm({
      date: booking.date.split('T')[0],
      type: booking.type,
    });
    setShowModal(true);
  };

  const saveBookingChanges = async () => {
    if (!editBooking) return;

    const today = new Date();
    const bookingDate = new Date(editForm.date);
    bookingDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (bookingDate < today) {
      showToast('Du kan inte välja ett datum som redan passerat', 'error');
      return;
    }
    try {
      await bookingsAPI.updateBooking(editBooking.id, {
        date: editForm.date,
        type: editForm.type,
      } as any);
      showToast('Bokning uppdaterad', 'success');
      setShowModal(false);
      setEditBooking(null);
      loadBookings();
    } catch (error:any) {
      console.error('Error updating booking:', error);
      showToast(error.response?.data?.message || 'Kunde inte uppdatera bokning.', 'error');
    }
  };

  return (

    <>
    {confirmToast && (
      <div className="toast toast-confirm">
        <p>{confirmToast.message}</p>
        <button className="btn-toast-yes" onClick={confirmToast.onConfirm}>
          Ja
        </button>
        <button className="btn-toast-no" onClick={() => setConfirmToast(null)}>
          Nej
        </button>
      </div>
    )}
    {toast && (
      <div className={`toast toast-${toast.type}`}>
        {toast.message}
      </div>
    )}

    <div className="my-bookings-container">
      <h1 className="my-bookings-title">Boka Ny Tid</h1>

      {/* FORMULÄR NY BOKNING */}
      <div className="booking-form">
        <label>Välj hund:</label>
        <select value={selectedDog} onChange={(e) => setSelectedDog(Number(e.target.value))}>
          <option value="">-- välj --</option>
          {dogs.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.breed})
            </option>
          ))}
        </select>

        
        <label>Datum:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <label>Typ av pass:</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'full_day' | 'half_day')}
        >
          <option value="full_day">Heldag</option>
          <option value="half_day">Halvdag</option>
        </select>

        <button className="create-button" onClick={createBooking}>
          Boka tid
        </button>
      </div>

      <h1 className="my-bookings-title">Mina Bokningar</h1>

      {isLoading ? (
        <p>Laddar bokningar...</p>
      ) : bookings.length === 0 ? (
        <p>Inga bokningar ännu.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((b) => (
            <li key={b.id} className="booking-item">
              <div className="booking-left">
                <div className="booking-date">
                  {new Date(b.date).toLocaleDateString('sv-SE')}
                </div>
                <div className="booking-type">{b.type === 'full_day' ? 'Heldag' : 'Halvdag'}</div>
                <div className="dog-name">{b.dog_name} ({b.breed})</div>
                <div className={`status-tag status-${b.status || 'active'}`}>
                  {b.status === 'canceled' ? 'Avbokad' : 'Aktiv'}
                </div>
              </div>

              {b.status !== 'canceled' && (
                <div className="booking-actions">
                  <button className="btn-mybookings-edit" onClick={() => startEdit(b)}>
                    Ändra
                  </button>
                  <button className="btn-mybookings-cancel" onClick={() => cancelBooking(b.id)}>
                    Avboka
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ----- MODAL ----- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Ändra bokning</h2>

            <label>Datum</label>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            />

            <label>Typ</label>
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
            >
              <option value="full_day">Heldag</option>
              <option value="half_day">Halvdag</option>
            </select>

            <div className="modal-actions">
              <button className="btn-saveChanges" onClick={saveBookingChanges}>
                Spara ändringar
              </button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default MyBookings;
