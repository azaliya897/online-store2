import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim())          e.username = "Введите имя";
    if (!form.email.includes("@"))      e.email    = "Некорректный email";
    if (form.password.length < 4)       e.password = "Минимум 4 символа";
    if (form.password !== form.confirm) e.confirm  = "Пароли не совпадают";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) { setErrors(foundErrors); return; }

    setLoading(true);
    // Симулируем задержку — принимаем любые данные
    await new Promise((resolve) => setTimeout(resolve, 800));

    login({
      username: form.username,
      email: form.email,
      token: "token-" + Date.now(),
    });

    setLoading(false);
    navigate("/dashboard");
  };

  const fields = [
    { name: "username", label: "Имя пользователя", type: "text",     placeholder: "Любое имя" },
    { name: "email",    label: "Email",             type: "email",    placeholder: "email@mail.ru" },
    { name: "password", label: "Пароль",            type: "password", placeholder: "Минимум 4 символа" },
    { name: "confirm",  label: "Повторите пароль",  type: "password", placeholder: "Повторите пароль" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Регистрация</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                style={{ ...styles.input, ...(errors[name] ? styles.inputErr : {}) }}
              />
              {errors[name] && <span style={styles.errText}>{errors[name]}</span>}
            </div>
          ))}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <p style={styles.footer}>
          Уже есть аккаунт?{" "}
          <Link to="/login" style={{ color: "#6c4ef2" }}>Войти</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" },
  card: { background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #e8e8e8", width: "100%", maxWidth: "420px" },
  title: { textAlign: "center", color: "#1a1a1a", marginBottom: "1.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "0.9rem", fontWeight: "500", color: "#333" },
  input: { padding: "11px 14px", border: "1.5px solid #e8e8e8", borderRadius: "8px", fontSize: "1rem" },
  inputErr: { borderColor: "#ff4444" },
  errText: { color: "#ff4444", fontSize: "0.8rem" },
  btn: { padding: "13px", background: "#6c4ef2", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600" },
  footer: { textAlign: "center", marginTop: "1.5rem", color: "#666", fontSize: "0.9rem" },
};