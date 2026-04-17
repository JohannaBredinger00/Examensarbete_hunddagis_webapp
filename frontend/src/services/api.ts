import axios from 'axios';
import { User, Dog, Booking } from '../types/types';

axios.defaults.withCredentials = true;

//const API_URL = 'http://localhost:5001/api';

// Skapar axios instance med bas-URL och credentials
const api = axios.create({baseURL: 'http://localhost:5001/api'
    //withCredentials: true, // Viktigt för cookies/auth
});

// Interceptor för att automatiskt lägga till JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers = config.headers || {};
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (config.data &&
        !(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
    return config;
    }
);


// Interceptor för att hantera errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token ogiltig - logga ut användaren
            //localStorage.removeItem('token');
            //window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// -------------------------
// Auth API functions
// -------------------------
export const authAPI = {
    login: (email: string, password: string) =>
        api.post<{ token: string; user: User }>('/users/login', { email, password }),

    register: (name: string, email: string, password: string) =>
        api.post<{ message: string; userId: number }>('/users/register', { name, email, password }),
};

// -------------------------
// Dogs API functions 
// -------------------------
export const dogsAPI = {
    getMyDogs: () => api.get<Dog[]>('/dogs/mydogs',
        { withCredentials: true }),

    addDog: (data: FormData) => api.post('/dogs/add', data, {
        withCredentials: true,
    }),
/*
    addDog: (dogData: { name: string; breed?: string; age?: number; allergies?: string }) =>
        api.post<{ message: string; dogId: number }>('/dogs/add', dogData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true, 
        }),
        */

        updateDog: (id: number, data: FormData) =>
        api.put<{ message: string; dog: Dog }>(`/dogs/${id}`, data, {
        withCredentials: true,
     }),

    /*updateDog: (id: number, dogData: { name: string; breed?: string; age?: number; allergies?: string }) =>
        api.put<{ message: string; dog: Dog }>(`/dogs/${id}`, dogData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true, 
        }),
        */


    deleteDog: (id: number) =>
        api.delete<{ message: string }>(`/dogs/${id}`,
            {withCredentials: true, 
        }),

    getDogById: (id: number) => api.get<Dog>(`/dogs/${id}`, 
        { withCredentials: true }),
};

// -------------------------
// Bookings API functions
// -------------------------
export const bookingsAPI = {
    getMyBookings: () => api.get<Booking[]>('/bookings/mybookings'),

    createBooking: (bookingsData: { dog_id: number; date: string; type: 'full_day' | 'half_day' }) =>
        api.post<{ message: string; bookingId: number }>('/bookings', bookingsData, {
            headers: { 'Content-Type': 'application/json' },
        }),

    updateBooking: (id: number, data: { status?: string; date?: string; type?: 'full_day' | 'half_day' }) =>
        api.put<{ message: string }>(`/bookings/${id}`, data, {
            headers: { 'Content-Type': 'application/json' },
        }),
};

// -------------------------
// Users API functions
// -------------------------
export const usersAPI = {
    getMyProfile: () => api.get<User>('/users/myprofile'),

    updateProfile: (data: { name?: string; email?: string; phone?: string }) =>
        api.put<{ message: string }>('/users/myprofile', data, {
            headers: { 'Content-Type': 'application/json' },
        }),
};

// -------------------------
// Owners API functions
// -------------------------
export const ownersAPI = {
    getMyProfile: () => api.get<User & { phone?: string; address?: string }>('/owners/myprofile'),

    updateMyProfile: (data: { phone?: string; address?: string }) =>
        api.put<{ message: string }>('/owners/myprofile', data, {
            headers: { 'Content-Type': 'application/json' },
        }),
};

export const attendanceAPI = {
    getToday: () => api.get('/attendance/today'),
    checkIn: (bookingId: number) => api.post(`/attendance/${bookingId}/checkin`, {}, {withCredentials: true}),
    checkOut: (bookingId: number) => api.post(`/attendance/${bookingId}/checkout`, {}, {withCredentials:  true}),
    updateStatus: (bookingId: number, status: 'checked_in' | 'checked_out') => 
        api.put(`/attendance/${bookingId}`, {status}),
};

// Admin Dogs API functions
export const adminDogsAPI = {
    getAllDogs: () => 
        api.get('/admin/dogs/all'),

    getDogById: (id: number) => 
        api.get(`/admin/dogs/${id}`),

    updateDog: (id: number, dogData: {
        name: string;
        breed?: string;
        age?: number;
        allergies?: string;
    }) => 
        api.put(`/admin/dogs/${id}`, dogData),
};

export default api;
