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
    localStorage.setItem('token', data.data.access);
    localStorage.setItem('refresh', data.data.refresh);
    const me = await api.get('/api/me/');
    localStorage.setItem('username', me.data.username);
    setUser({ username: me.data.username });
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

    function updateUser(newData) {
    setUser((prev) => ({ ...prev, ...newData }));
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}