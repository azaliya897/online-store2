import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchItems } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchItems().then(setProducts);
  }, []);

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const avgPrice = products.length
    ? (products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2)
    : 0;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Привет, {user?.username}! 👋</h2>

      {/* Статистика */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statNum}>{products.length}</p>
          <p style={styles.statLabel}>Товаров в каталоге</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statNum, color: "#6c4ef2" }}>{favorites.length}</p>
          <p style={styles.statLabel}>В избранном</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statNum, color: "#22c55e" }}>${avgPrice}</p>
          <p style={styles.statLabel}>Средняя цена</p>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <h3 style={styles.subtitle}>Быстрые действия</h3>
      <div style={styles.quickLinks}>
        <Link to="/list"      style={styles.quickLink}>📦 Каталог</Link>
        <Link to="/create"    style={styles.quickLink}>➕ Добавить товар</Link>
        <Link to="/favorites" style={styles.quickLink}>❤️ Избранное</Link>
        <Link to="/profile"   style={styles.quickLink}>👤 Профиль</Link>
        <Link to="/admin"     style={styles.quickLink}>🔧 Admin Panel</Link>
      </div>

      {/* Последние товары */}
      <h3 style={styles.subtitle}>Последние товары</h3>
      <div style={styles.recentGrid}>
        {products.slice(0, 4).map((p) => (
          <Link to={`/details/${p.id}`} key={p.id} style={styles.recentCard}>
            <img src={p.image} alt={p.title} style={styles.recentImg} />
            <p style={styles.recentTitle}>{p.title.slice(0, 40)}...</p>
            <p style={styles.recentPrice}>${p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "2rem" },
  title: { fontSize: "1.6rem", color: "#1a1a1a", marginBottom: "1.5rem" },
  subtitle: { fontSize: "1.1rem", color: "#333", margin: "2rem 0 1rem" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
  },
  statCard: {
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "1.5rem",
    textAlign: "center",
  },
  statNum: { fontSize: "2rem", fontWeight: "700", color: "#1a1a1a", margin: 0 },
  statLabel: { color: "#999", marginTop: "6px", fontSize: "0.9rem" },
  quickLinks: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  quickLink: {
    padding: "12px 20px",
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "10px",
    color: "#333",
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  recentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
  },
  recentCard: {
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "1rem",
    display: "block",
  },
  recentImg: { width: "100%", height: "120px", objectFit: "contain" },
  recentTitle: { fontSize: "0.85rem", color: "#333", margin: "8px 0 4px" },
  recentPrice: { color: "#6c4ef2", fontWeight: "700" },
};