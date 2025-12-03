export interface User {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    phone?: string;
}

export interface Dog {
    id: number;
    name: string;
    breed?: string;
    age?: number;
    allergies?: string;
    owner_id: number;
}

export interface Booking {
    id: number
    dog_id: number;
    date: string;
    type: 'full_day' | 'half_day';
    status: 'booked' | 'canceled' | null;
    dog_name?: string;
    breed?: string;
}

export interface Ownerprofile {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
}

export interface AuthContextType {
    User: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}