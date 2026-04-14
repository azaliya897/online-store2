// Context — глобальное хранилище данных пользователя
// Без него пришлось бы передавать user через props в каждый компонент
import { createContext, useState, useContext } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // При загрузке читаем сохранённого пользователя из localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Вход — сохраняем пользователя
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Выход — удаляем пользователя
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Удобный хук — вместо того чтобы писать useContext(AuthContext) каждый раз
export function useAuth() {
  return useContext(AuthContext);
}