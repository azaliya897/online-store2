import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = "Введите имя пользователя";
    if (!password)        e.password = "Введите пароль";
    if (password && password.length < 4) e.password = "Минимум 4 символа";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    setLoading(true);

    // Симулируем загрузку 800мс — принимаем ЛЮБОЙ логин и пароль
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Сохраняем пользователя — любое имя и пароль принимается
    login({
      username: username,
      email: username + "@shop.com",
      token: "token-" + Date.now(),
    });

    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Вход</h2>
        <p style={styles.hint}>Введите любое имя и пароль</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Любое имя"
              style={{ ...styles.input, ...(errors.username ? styles.inputErr : {}) }}
            />
            {errors.username && <span style={styles.errText}>{errors.username}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 4 символа"
              style={{ ...styles.input, ...(errors.password ? styles.inputErr : {}) }}
            />
            {errors.password && <span style={styles.errText}>{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p style={styles.footer}>
          Нет аккаунта?{" "}
          <Link to="/register" style={{ color: "#6c4ef2" }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" },
  card: { background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #e8e8e8", width: "100%", maxWidth: "420px" },
  title: { textAlign: "center", color: "#1a1a1a", marginBottom: "0.5rem" },
  hint: { textAlign: "center", color: "#999", fontSize: "0.85rem", marginBottom: "1.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "0.9rem", fontWeight: "500", color: "#333" },
  input: { padding: "11px 14px", border: "1.5px solid #e8e8e8", borderRadius: "8px", fontSize: "1rem" },
  inputErr: { borderColor: "#ff4444" },
  errText: { color: "#ff4444", fontSize: "0.8rem" },
  btn: { padding: "13px", background: "#6c4ef2", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600" },
  footer: { textAlign: "center", marginTop: "1.5rem", color: "#666", fontSize: "0.9rem" },
};
