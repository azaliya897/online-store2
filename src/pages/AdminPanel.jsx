import { useEffect, useState } from "react";
import { fetchItems, fetchUsers, deleteItem } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Фильтры для товаров в Admin Panel
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("all");
  const [productSort, setProductSort] = useState("none");

  // Фильтр для пользователей
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    // Если не админ — отправляем на главную
    if (!isAdmin) { navigate("/"); return; }

    Promise.all([fetchItems(), fetchUsers()])
      .then(([p, u]) => { setProducts(p); setUsers(u); })
      .finally(() => setLoading(false));
  }, [isAdmin, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить товар?")) return;
    await deleteItem(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Категории для фильтра
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  // Фильтрованные и отсортированные товары
  const filteredProducts = products
    .filter((p) => productCategory === "all" || p.category === productCategory)
    .filter((p) => p.title.toLowerCase().includes(productSearch.toLowerCase()))
    .sort((a, b) => {
      if (productSort === "price-asc")  return a.price - b.price;
      if (productSort === "price-desc") return b.price - a.price;
      if (productSort === "rating")     return b.rating?.rate - a.rating?.rate;
      return 0;
    });

  // Фильтрованные пользователи
  const filteredUsers = users.filter((u) =>
    (u.name?.firstname + " " + u.name?.lastname + " " + u.email)
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: "center", padding: "3rem" }}>Загрузка...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>🔧 Admin Panel</h2>
        {/* Показываем роль текущего пользователя */}
        <span style={styles.roleBadge}>Роль: Администратор</span>
      </div>

      {/* Статистика */}
      <div style={styles.statsGrid}>
        {[
          { label: "Товаров в каталоге", value: products.length,                                              color: "#6c4ef2" },
          { label: "Пользователей",      value: users.length,                                                 color: "#22c55e" },
          { label: "Сумма каталога",     value: "$" + products.reduce((s, p) => s + p.price, 0).toFixed(0),  color: "#f59e0b" },
          { label: "Средняя цена",       value: "$" + (products.reduce((s, p) => s + p.price, 0) / (products.length || 1)).toFixed(2), color: "#e94560" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <p style={{ ...styles.statNum, color: s.color }}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Вкладки */}
      <div style={styles.tabs}>
        {[
          { key: "overview", label: "📊 Обзор" },
          { key: "products", label: "📦 Товары" },
          { key: "users",    label: "👥 Пользователи" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Вкладка: Обзор */}
      {tab === "overview" && (
        <div style={styles.section}>
          <h3 style={styles.subtitle}>Последние добавленные товары</h3>
          {products.slice(0, 6).map((p) => (
            <div key={p.id} style={styles.row}>
              <img src={p.image} alt="" style={styles.rowImg} />
              <span style={styles.rowTitle}>{p.title.slice(0, 45)}...</span>
              <span style={styles.rowCategory}>{p.category}</span>
              <span style={styles.rowPrice}>${p.price}</span>
              <Link to={`/details/${p.id}`} style={styles.rowLink}>Открыть</Link>
            </div>
          ))}
        </div>
      )}

      {/* Вкладка: Товары с фильтрацией */}
      {tab === "products" && (
        <div style={styles.section}>
          {/* Панель фильтров */}
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="🔍 Поиск товара..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              style={styles.filterInput}
            />
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              style={styles.filterSelect}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Все категории" : cat}
                </option>
              ))}
            </select>
            <select
              value={productSort}
              onChange={(e) => setProductSort(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="none">Сортировка</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="rating">По рейтингу</option>
            </select>
            <Link to="/create" style={styles.addBtn}>+ Добавить товар</Link>
          </div>

          <p style={styles.filterCount}>Найдено: {filteredProducts.length} товаров</p>

          {filteredProducts.map((p) => (
            <div key={p.id} style={styles.row}>
              <img src={p.image} alt="" style={styles.rowImg} />
              <span style={styles.rowTitle}>{p.title.slice(0, 45)}...</span>
              <span style={styles.rowCategory}>{p.category}</span>
              <span style={styles.rowPrice}>${p.price}</span>
              <span style={styles.rowRating}>⭐ {p.rating?.rate}</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link to={`/edit/${p.id}`} style={styles.editBtn}>✏️</Link>
                <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Вкладка: Пользователи с поиском */}
      {tab === "users" && (
        <div style={styles.section}>
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="🔍 Поиск пользователя..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          <p style={styles.filterCount}>Найдено: {filteredUsers.length} пользователей</p>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Имя</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Город</th>
                <th style={styles.th}>Роль</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.name?.firstname} {u.name?.lastname}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.address?.city}</td>
                  <td style={styles.td}>
                    {/* Показываем роль — первый пользователь admin, остальные user */}
                    <span style={{
                      ...styles.roleTag,
                      background: u.id === 1 ? "#fff3e0" : "#f0edff",
                      color: u.id === 1 ? "#e65100" : "#6c4ef2",
                    }}>
                      {u.id === 1 ? "admin" : "user"}
                    </span>
                  </td>
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
  header: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" },
  title: { fontSize: "1.6rem", color: "#1a1a1a" },
  roleBadge: {
    background: "#fff3e0", color: "#e65100",
    padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" },
  statCard: { background: "white", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.5rem", textAlign: "center" },
  statNum: { fontSize: "2rem", fontWeight: "700", margin: 0 },
  statLabel: { color: "#999", marginTop: "6px", fontSize: "0.9rem" },
  tabs: { display: "flex", gap: "8px", marginBottom: "1.5rem" },
  tab: { padding: "10px 20px", background: "white", border: "1px solid #e8e8e8", borderRadius: "8px", color: "#555", fontSize: "0.9rem", cursor: "pointer" },
  tabActive: { background: "#6c4ef2", color: "white", border: "1px solid #6c4ef2" },
  section: { background: "white", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.5rem" },
  subtitle: { color: "#1a1a1a", marginBottom: "1rem" },
  filterBar: { display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" },
  filterInput: { flex: 1, minWidth: "180px", padding: "9px 14px", border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "0.9rem", background: "#f5f5f5" },
  filterSelect: { padding: "9px 14px", border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "0.9rem", background: "#f5f5f5" },
  filterCount: { color: "#999", fontSize: "0.85rem", marginBottom: "0.75rem" },
  addBtn: { background: "#6c4ef2", color: "white", padding: "9px 16px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "600" },
  row: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "10px 0", borderBottom: "1px solid #f5f5f5", flexWrap: "wrap" },
  rowImg: { width: "40px", height: "40px", objectFit: "contain", background: "#f9f9f9", borderRadius: "6px", padding: "4px", flexShrink: 0 },
  rowTitle: { flex: 1, fontSize: "0.88rem", color: "#333", minWidth: "150px" },
  rowCategory: { background: "#f0edff", color: "#6c4ef2", padding: "2px 8px", borderRadius: "20px", fontSize: "0.75rem" },
  rowPrice: { color: "#6c4ef2", fontWeight: "600", minWidth: "60px" },
  rowRating: { color: "#f59e0b", fontSize: "0.85rem" },
  rowLink: { color: "#6c4ef2", fontSize: "0.85rem" },
  editBtn: { background: "#f0edff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" },
  deleteBtn: { background: "#fff0f0", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", color: "#ff4444" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px", textAlign: "left", color: "#6c4ef2", fontSize: "0.85rem", fontWeight: "600", borderBottom: "2px solid #f0edff" },
  tr: { borderBottom: "1px solid #f5f5f5" },
  td: { padding: "10px", color: "#555", fontSize: "0.9rem" },
  roleTag: { padding: "3px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" },
};