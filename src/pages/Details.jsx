import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchItem } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Details() {
  // useParams — достаёт id из URL (/details/5 → id = "5")
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false); // в избранном или нет

  // Загружаем товар, перезапрашиваем если id изменился
  useEffect(() => {
    setLoading(true);
    fetchItem(id)
      .then((data) => setItem(data))
      .catch(() => setError("Товар не найден"))
      .finally(() => setLoading(false));
  }, [id]);

  // Проверяем — есть ли в избранном
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setSaved(favs.some((f) => f.id === Number(id)));
  }, [id]);

  // Добавить / убрать из избранного
  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (saved) {
      localStorage.setItem(
        "favorites",
        JSON.stringify(favs.filter((f) => f.id !== item.id))
      );
    } else {
      localStorage.setItem("favorites", JSON.stringify([...favs, item]));
    }
    setSaved(!saved);
  };

  if (loading) return <p style={styles.center}>⏳ Загрузка...</p>;
  if (error)   return <p style={{ ...styles.center, color: "#ff4444" }}>❌ {error}</p>;

  return (
    <div style={styles.page}>
      <p style={styles.breadcrumb}>Главная / Каталог / {item.category}</p>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Назад</button>

      <div style={styles.card}>
        {/* Картинка */}
        <div style={styles.imgWrap}>
          <img src={item.image} alt={item.title} style={styles.img} />
        </div>

        {/* Информация */}
        <div style={styles.info}>
          <span style={styles.badge}>{item.category}</span>
          <h2 style={styles.title}>{item.title}</h2>
          <p style={styles.rating}>⭐ {item.rating?.rate} / 5 ({item.rating?.count} отзывов)</p>
          <p style={styles.desc}>{item.description}</p>
          <p style={styles.inStock}>В наличии</p>
          <p style={styles.price}>{item.price} $</p>

          {/* Кнопки */}
          <div style={styles.btns}>
            <button style={styles.cartBtn}>В корзину</button>
            {user && (
              <button onClick={toggleFavorite} style={styles.favBtn}>
                {saved ? "❤️ В избранном" : "🤍 В избранное"}
              </button>
            )}
          </div>

          {user && (
            <div style={styles.adminBtns}>
              <button
                onClick={() => navigate(`/edit/${item.id}`)}
                style={styles.editBtn}
              >
                ✏️ Редактировать
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "1000px", margin: "0 auto", padding: "1.5rem" },
  breadcrumb: { color: "#999", fontSize: "0.85rem", marginBottom: "0.75rem" },
  backBtn: {
    background: "none",
    border: "1px solid #e8e8e8",
    padding: "8px 16px",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    color: "#555",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e8e8e8",
    padding: "2rem",
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  },
  imgWrap: {
    flex: "0 0 280px",
    background: "#f9f9f9",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    minHeight: "280px",
  },
  img: { maxWidth: "100%", maxHeight: "240px", objectFit: "contain" },
  info: { flex: 1, minWidth: "250px" },
  badge: {
    display: "inline-block",
    background: "#f0edff",
    color: "#6c4ef2",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    marginBottom: "1rem",
  },
  title: { fontSize: "1.4rem", color: "#1a1a1a", marginBottom: "0.75rem" },
  rating: { color: "#f59e0b", fontSize: "0.9rem", marginBottom: "1rem" },
  desc: { color: "#555", lineHeight: 1.7, marginBottom: "1rem", fontSize: "0.95rem" },
  inStock: { color: "#22c55e", fontWeight: "500", marginBottom: "0.5rem" },
  price: { fontSize: "2rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "1.5rem" },
  btns: { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" },
  cartBtn: {
    background: "#6c4ef2",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "1rem",
  },
  favBtn: {
    background: "white",
    border: "1px solid #e8e8e8",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "0.95rem",
  },
  adminBtns: { marginTop: "0.5rem" },
  editBtn: {
    background: "#f0edff",
    color: "#6c4ef2",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "500",
  },
  center: { textAlign: "center", padding: "3rem", color: "#999" },
};