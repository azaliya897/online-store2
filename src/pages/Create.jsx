import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/api";

export default function Create() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())              e.title       = "Введите название";
    if (!form.price || form.price <= 0)  e.price       = "Введите цену";
    if (!form.description.trim())        e.description = "Введите описание";
    if (!form.category)                  e.category    = "Выберите категорию";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // без этого страница перезагрузится!

    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    setLoading(true);
    try {
      await createItem({
        title: form.title,
        price: Number(form.price),
        description: form.description,
        category: form.category,
        image: "https://fakestoreapi.com/img/placeholder.jpg",
      });

      setSuccess(true);
      // После создания — переход на список через 1.5 секунды
      setTimeout(() => navigate("/list"), 1500);

    } catch {
      setErrors({ general: "Ошибка при создании товара" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Добавить товар</h2>

        {success && (
          <div style={styles.successBox}>
            ✅ Товар создан! Переходим к списку...
          </div>
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
              placeholder="Например: iPhone 15"
              style={{ ...styles.input, ...(errors.title ? styles.inputErr : {}) }}
            />
            {errors.title && <span style={styles.errText}>{errors.title}</span>}
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Цена ($) *</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="999"
                style={{ ...styles.input, ...(errors.price ? styles.inputErr : {}) }}
              />
              {errors.price && <span style={styles.errText}>{errors.price}</span>}
            </div>

            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Категория *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={{ ...styles.input, ...(errors.category ? styles.inputErr : {}) }}
              >
                <option value="">Выберите...</option>
                <option value="electronics">Электроника</option>
                <option value="jewelery">Украшения</option>
                <option value="men's clothing">Мужская одежда</option>
                <option value="women's clothing">Женская одежда</option>
              </select>
              {errors.category && <span style={styles.errText}>{errors.category}</span>}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Описание *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Описание товара..."
              rows={4}
              style={{
                ...styles.input,
                resize: "vertical",
                ...(errors.description ? styles.inputErr : {}),
              }}
            />
            {errors.description && (
              <span style={styles.errText}>{errors.description}</span>
            )}
          </div>

          <div style={styles.formBtns}>
            <button
              type="button"
              onClick={() => navigate("/list")}
              style={styles.cancelBtn}
            >
              Отмена
            </button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Создаём..." : "Создать товар"}
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
    maxWidth: "580px",
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
  row: { display: "flex", gap: "1rem" },
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
  },
};