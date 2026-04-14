import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // Обновляем данные пользователя
    login({ ...user, username: form.username, email: form.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  return (
    <div style={styles.page}>
      {/* Аватар с первой буквой имени */}
      <div style={styles.avatar}>
        {user?.username?.[0]?.toUpperCase() || "U"}
      </div>
      <h2 style={styles.name}>{user?.username}</h2>

      {/* Форма редактирования */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Редактировать профиль</h3>
        {saved && (
          <div style={styles.successBox}>✅ Сохранено!</div>
        )}
        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Имя пользователя</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@mail.ru"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.saveBtn}>Сохранить</button>
        </form>
      </div>

      {/* Статистика */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Статистика</h3>
        <p style={{ color: "#555" }}>
          ❤️ Товаров в избранном: <b>{favorites.length}</b>
        </p>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Выйти из аккаунта
      </button>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "480px",
    margin: "2rem auto",
    padding: "0 1.5rem",
    textAlign: "center",
  },
  avatar: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    background: "#6c4ef2",
    color: "white",
    fontSize: "2.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    fontWeight: "700",
  },
  name: { color: "#1a1a1a", marginBottom: "2rem" },
  card: {
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1rem",
    textAlign: "left",
  },
  cardTitle: { color: "#1a1a1a", marginBottom: "1rem" },
  successBox: {
    background: "#f0fdf4",
    color: "#16a34a",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "0.9rem", fontWeight: "500", color: "#333" },
  input: {
    padding: "10px 14px",
    border: "1.5px solid #e8e8e8",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  saveBtn: {
    padding: "11px",
    background: "#6c4ef2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "1rem",
  },
  logoutBtn: {
    padding: "12px 24px",
    background: "#fff0f0",
    color: "#ff4444",
    border: "1px solid #ffd0d0",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "1rem",
    marginTop: "0.5rem",
  },
};