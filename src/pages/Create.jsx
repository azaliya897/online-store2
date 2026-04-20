import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Create() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "Смартфоны",
    description: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Категории техники (как на главной)
  const categories = [
    "Смартфоны",
    "Ноутбуки",
    "Телевизоры",
    "Наушники",
    "Смарт-часы",
    "Планшеты",
    "Колонки",
    "Игры и гаджеты",
    "Аксессуары"
  ];

  // Проверка прав доступа
  if (!isAdmin || !isAdmin()) {
    return (
      <div style={styles.accessDenied}>
        <h2>⛔ Доступ запрещён</h2>
        <p>Только для администраторов</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.title || !form.price) {
      setError("Заполните название и цену");
      setLoading(false);
      return;
    }

    const newItem = {
      title: form.title,
      price: parseFloat(form.price),
      category: form.category,
      description: form.description || "Описание товара",
      image: form.image || "https://via.placeholder.com/150",
      rating: { rate: 4.5 }
    };

    try {
      await createItem(newItem);
      navigate("/list");
    } catch (err) {
      setError("Ошибка создания товара");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>➕ Добавить товар</h2>
      
      {error && <p style={styles.error}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Название *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Цена ($) *</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Категория *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={styles.select}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Описание</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={styles.textarea}
            rows="4"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>URL картинки (опционально)</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            style={styles.input}
            placeholder="https://..."
          />
        </div>

        <div style={styles.buttons}>
          <button type="button" onClick={() => navigate("/list")} style={styles.cancelBtn}>
            Отмена
          </button>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Создание..." : "Создать товар"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "500px", margin: "0 auto", padding: "2rem" },
  title: { marginBottom: "1.5rem", color: "#1a1a1a" },
  form: { background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #e8e8e8" },
  field: { marginBottom: "1rem" },
  label: { display: "block", marginBottom: "0.5rem", color: "#555", fontSize: "0.9rem" },
  input: { width: "100%", padding: "10px", border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "0.9rem" },
  select: { width: "100%", padding: "10px", border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "0.9rem" },
  textarea: { width: "100%", padding: "10px", border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "0.9rem", fontFamily: "inherit" },
  buttons: { display: "flex", gap: "1rem", marginTop: "1.5rem" },
  cancelBtn: { flex: 1, padding: "10px", background: "white", border: "1px solid #e8e8e8", borderRadius: "8px", cursor: "pointer" },
  submitBtn: { flex: 1, padding: "10px", background: "#6c4ef2", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  error: { color: "#ff4444", marginBottom: "1rem", textAlign: "center" },
  accessDenied: { textAlign: "center", padding: "4rem", color: "#ff4444" }
};
