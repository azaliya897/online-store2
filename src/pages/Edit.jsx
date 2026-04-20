import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchItem, updateItem } from "../api/api";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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

  useEffect(() => {
    fetchItem(id)
      .then((item) => {
        setForm({
          title: item.title,
          price: item.price,
          description: item.description,
          category: item.category,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Введите название";
    if (!form.price || form.price <= 0) e.price = "Введите цену";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    setSaving(true);
    try {
      await updateItem(id, { ...form, price: Number(form.price) });
      setSuccess(true);
      setTimeout(() => navigate("/list"), 1500);
    } catch {
      setErrors({ general: "Ошибка обновления" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center", padding: "3rem" }}>Загрузка...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>✏️ Редактировать товар</h2>

        {success && (
          <div style={styles.successBox}>✅ Сохранено! Возвращаемся...</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {errors.general && (
            <div style={styles.errorBox}>{errors.general}</div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Название *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.title ? styles.inputErr : {}) }}
            />
            {errors.title && <span style={styles.errText}>{errors.title}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Цена ($) *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.price ? styles.inputErr : {}) }}
            />
            {errors.price && <span style={styles.errText}>{errors.price}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Описание</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{ ...styles.input, resize: "vertical" }}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Категория *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.formBtns}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelBtn}
            >
              Отмена
            </button>
            <button type="submit" disabled={saving} style={styles.submitBtn}>
              {saving ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    background: "white",
    padding: "2.5rem",
    borderRadius: "16px",
    border: "1px solid #e8e8e8",
    width: "100%",
    maxWidth: "540px",
    height: "fit-content",
  },
  title: { color: "#1a1a1a", marginBottom: "1.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  successBox: {
    background: "#f0fdf4",
    color: "#16a34a",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "1rem",
  },
  errorBox: {
    background: "#fff0f0",
    color: "#ff4444",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
  },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "0.9rem", fontWeight: "500", color: "#333" },
  input: {
    padding: "11px 14px",
    border: "1.5px solid #e8e8e8",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "inherit",
    width: "100%",
  },
  inputErr: { borderColor: "#ff4444" },
  errText: { color: "#ff4444", fontSize: "0.8rem" },
  formBtns: { display: "flex", gap: "1rem", marginTop: "0.5rem" },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    background: "white",
    border: "1.5px solid #e8e8e8",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  submitBtn: {
    flex: 2,
    padding: "12px",
    background: "#6c4ef2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};