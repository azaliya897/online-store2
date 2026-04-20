import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password) => {
    let role = 'user';
    let username = email.split('@')[0];
    
    // Админ: admin@shop.com / admin123
    if (email === 'admin@shop.com' && password === 'admin123') {
      role = 'admin';
      username = 'Администратор';
    }
    
    const userData = { email, username, role };
    setUser(userData);
    return userData;
  };

  const logout = () => setUser(null);
  
  // Функция isAdmin — ВАЖНО!
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
