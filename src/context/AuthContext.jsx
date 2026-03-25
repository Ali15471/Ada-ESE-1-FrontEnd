import {createContext, useState, useContext} from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider ({ children }) {
    const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) 
        return { token, username };
    return null;
    });

    async function login(username, password) {
        const data = await api.post('/api/auth/login/', { username, password });
        console.log("Login response:", data);
        localStorage.setItem('token', data.data.access);
        localStorage.setItem('refresh', data.data.refresh);
        localStorage.setItem('username', username);
        setUser({ username });
    }

    async function register(username, email, password) {
        await api.post('/api/auth/register/', { username, email, password });
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}