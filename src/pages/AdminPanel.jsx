import { useEffect, useState } from "react";
import { fetchItems, fetchUsers, deleteItem } from "../api/api";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    Promise.all([fetchItems(), fetchUsers()])
      .then(([p, u]) => { setProducts(p); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить?")) return;
    await deleteItem(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <p style={{ textAlign: "center", padding: "3rem" }}>Загрузка...</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🔧 Admin Panel</h2>

      {/* Статистика */}
      <div style={styles.statsGrid}>
        {[
          { label: "Товаров",         value: products.length,                                                  color: "#1a1a1a" },
          { label: "Пользователей",   value: users.length,                                                     color: "#6c4ef2" },
          { label: "Сумма каталога",  value: "$" + products.reduce((s, p) => s + p.price, 0).toFixed(0),      color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <p style={{ ...styles.statNum, color: s.color }}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Вкладки */}
      <div style={styles.tabs}>
        {["overview", "products", "users"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
          >
            {{ overview: "📊 Обзор", products: "📦 Товары", users: "👥 Пользователи" }[t]}
          </button>
        ))}
      </div>

      {/* Обзор */}
      {tab === "overview" && (
        <div style={styles.section}>
          <h3 style={styles.subtitle}>Последние 5 товаров</h3>
          {products.slice(0, 5).map((p) => (
            <div key={p.id} style={styles.row}>
              <img src={p.image} alt="" style={styles.rowImg} />
              <span style={styles.rowTitle}>{p.title.slice(0, 45)}...</span>
              <span style={styles.rowPrice}>${p.price}</span>
              <Link to={`/details/${p.id}`} style={styles.rowLink}>Открыть</Link>
            </div>
          ))}
        </div>
      )}

      {/* Товары */}
      {tab === "products" && (
        <div style={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={styles.subtitle}>Товары ({products.length})</h3>
            <Link to="/create" style={styles.addBtn}>+ Добавить</Link>
          </div>
          {products.map((p) => (
            <div key={p.id} style={styles.row}>
              <img src={p.image} alt="" style={styles.rowImg} />
              <span style={styles.rowTitle}>{p.title.slice(0, 45)}...</span>
              <span style={styles.rowPrice}>${p.price}</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link to={`/edit/${p.id}`} style={styles.editBtn}>✏️</Link>
                <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пользователи */}
      {tab === "users" && (
        <div style={styles.section}>
          <h3 style={styles.subtitle}>Пользователи ({users.length})</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Имя</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Город</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.name?.firstname} {u.name?.lastname}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.address?.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "2rem" },
  title: { fontSize: "1.6rem", color: "#1a1a1a", marginBottom: "1.5rem" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "1.5rem",
    textAlign: "center",
  },
  statNum: { fontSize: "2rem", fontWeight: "700", margin: 0 },
  statLabel: { color: "#999", marginTop: "6px", fontSize: "0.9rem" },
  tabs: { display: "flex", gap: "8px", marginBottom: "1.5rem" },
  tab: {
    padding: "10px 20px",
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    color: "#555",
    fontSize: "0.9rem",
  },
  tabActive: { background: "#6c4ef2", color: "white", border: "1px solid #6c4ef2" },
  section: {
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  subtitle: { color: "#1a1a1a", marginBottom: "1rem" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  rowImg: {
    width: "40px", height: "40px",
    objectFit: "contain",
    background: "#f9f9f9",
    borderRadius: "6px",
    padding: "4px",
  },
  rowTitle: { flex: 1, fontSize: "0.9rem", color: "#333" },
  rowPrice: { color: "#6c4ef2", fontWeight: "600", minWidth: "70px" },
  rowLink: { color: "#6c4ef2", fontSize: "0.85rem" },
  addBtn: {
    background: "#6c4ef2",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.85rem",
  },
  editBtn: {
    background: "#f0edff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#fff0f0",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#ff4444",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "10px",
    textAlign: "left",
    color: "#6c4ef2",
    fontSize: "0.85rem",
    fontWeight: "600",
    borderBottom: "2px solid #f0edff",
  },
  tr: { borderBottom: "1px solid #f5f5f5" },
  td: { padding: "10px", color: "#555", fontSize: "0.9rem" },
};