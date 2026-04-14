import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Читаем избранное из localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  const remove = (id) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>❤️ Избранное</h2>

      {favorites.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>Нет избранных товаров</p>
          <Link to="/list" style={styles.goBtn}>Перейти в каталог</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {favorites.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.image} alt={item.title} style={styles.img} />
              <div style={styles.cardBody}>
                <p style={styles.cardTitle}>
                  {item.title.slice(0, 55)}...
                </p>
                <p style={styles.price}>{item.price} $</p>
                <div style={styles.actions}>
                  <Link to={`/details/${item.id}`} style={styles.viewBtn}>
                    Подробнее
                  </Link>
                  <button onClick={() => remove(item.id)} style={styles.removeBtn}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "2rem" },
  title: { color: "#1a1a1a", marginBottom: "1.5rem" },
  empty: { textAlign: "center", padding: "4rem" },
  emptyText: { color: "#999", fontSize: "1.1rem", marginBottom: "1.5rem" },
  goBtn: {
    background: "#6c4ef2",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "170px",
    objectFit: "contain",
    padding: "1rem",
    background: "#f9f9f9",
  },
  cardBody: { padding: "1rem" },
  cardTitle: { fontSize: "0.88rem", color: "#1a1a1a", marginBottom: "8px" },
  price: { fontSize: "1.1rem", fontWeight: "700", color: "#6c4ef2", marginBottom: "12px" },
  actions: { display: "flex", gap: "8px" },
  viewBtn: {
    flex: 1,
    background: "#6c4ef2",
    color: "white",
    textAlign: "center",
    padding: "8px",
    borderRadius: "6px",
    fontSize: "0.85rem",
  },
  removeBtn: {
    background: "#fff0f0",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#ff4444",
  },
};