export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    createdAt?: string;
}

export interface Registration {
    id: string;
    number: string;
    city: string;
    brand: string;
    mileage: string;
    model: string;
    productionDate: string;
    firstName: string,
    lastName: string;
    pesel: string,
    createdAt?: string,
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}