import React, { useEffect, useState } from 'react';
import { usersAPI } from '../services/api';
import { User } from '../types/types';
import '../styles/pages/MyProfile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<User>({
    id: 0,
    name: '',
    email: '',
    role: 'customer',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getMyProfile();
      console.log('PROFILE RESPONSE:', response.data);
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await usersAPI.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone
      });

      console.log('Profile updated', response.data);
      setIsEditing(false);
      //loadProfile(); // uppdatera med data från backend
      
      setProfile({
        ...profile,
        name: profile.name,
        email: profile.email,
        phone: profile.phone || ''
      });

    } catch (error:any) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        alert('Kunde inte uppdatera profilen');
      }
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Min Profil</h1>

      <div className="profile-section">
        <h2 className="profile-subtitle">Personuppgifter</h2>

        <div className="profile-field">
          <label>Namn:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.name || '-'}</p>
          )}
        </div>

        <div className="profile-field">
          <label>E-post:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.email || '-'}</p>
          )}
        </div>

        <div className="profile-field">
          <label>Telefon:</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.phone || '-'}</p>
          )}
        </div>
      </div>

      <div className="profile-section">
        {isEditing ? (
          <button className="profile-btn" onClick={handleSave}>
            Spara
          </button>
        ) : (
          <button className="profile-btn" onClick={() => setIsEditing(true)}>
            Redigera
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
