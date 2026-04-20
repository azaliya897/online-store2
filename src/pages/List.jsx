import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchItems, deleteItem } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function List() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [addedId, setAddedId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();

  // Загрузка избранного из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    fetchItems()
      .then((items) => setData(items))
      .catch(() => setError("Ошибка загрузки данных"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await deleteItem(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Ошибка удаления");
    }
  };

  // Функция добавления/удаления из избранного
  const toggleFavorite = (item) => {
    let newFavorites;
    if (favorites.find(f => f.id === item.id)) {
      newFavorites = favorites.filter(f => f.id !== item.id);
    } else {
      newFavorites = [...favorites, item];
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Проверка, в избранном ли товар
  const isFavorite = (id) => favorites.some(f => f.id === id);

  const categories = ["all", ...new Set(data.map((item) => item.category))];

  const filtered = data
    .filter((item) => activeCategory === "all" || item.category === activeCategory)
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating?.rate - a.rating?.rate;
      return 0;
    });

  if (loading) return <p style={styles.center}>⏳ Загрузка товаров...</p>;
  if (error) return <p style={{ ...styles.center, color: "#ff4444" }}>❌ {error}</p>;

  return (
    <div style={styles.page}>
      <p style={styles.breadcrumb}>Главная / Каталог</p>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <h4 style={styles.filterTitle}>Категории</h4>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.catBtn,
                ...(activeCategory === cat ? styles.catBtnActive : {}),
              }}
            >
              {cat === "all" ? "Все товары" : cat}
            </button>
          ))}

          <h4 style={{ ...styles.filterTitle, marginTop: "1.5rem" }}>Сортировка</h4>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="none">По умолчанию</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="rating">По рейтингу</option>
          </select>
        </aside>

        <div style={styles.main}>
          <div style={styles.topBar}>
            <h2 style={styles.title}>
              {activeCategory === "all" ? "Все товары" : activeCategory}
            </h2>
            <input
              type="text"
              placeholder="🔍 Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            {user && (
              <Link to="/create" style={styles.addBtn}>+ Добавить</Link>
            )}
          </div>

          <p style={styles.count}>Найдено: {filtered.length} товаров</p>

          {filtered.length === 0 && (
            <p style={styles.center}>Ничего не найдено 😕</p>
          )}

          <div style={styles.grid}>
            {filtered.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.imgWrap}>
                  <img src={item.image} alt={item.title} style={styles.img} />
                  <button 
                    onClick={() => toggleFavorite(item)} 
                    style={styles.heartBtn}
                  >
                    {isFavorite(item.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                <div style={styles.cardBody}>
                  <span style={styles.badge}>{item.category}</span>
                  <p style={styles.cardTitle}>
                    {item.title.length > 50 ? item.title.slice(0, 50) + "..." : item.title}
                  </p>
                  <p style={styles.rating}>⭐ {item.rating?.rate}</p>
                  <p style={styles.inStock}>В наличии</p>
                  <p style={styles.price}>{item.price} $</p>

                  <Link to={`/details/${item.id}`} style={styles.detailLink}>
                    Подробнее →
                  </Link>

                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      ...styles.cartBtn,
                      ...(addedId === item.id ? styles.cartBtnAdded : {}),
                    }}
                  >
                    {addedId === item.id ? "✅ Добавлено!" : "В корзину"}
                  </button>

                  {isAdmin && isAdmin() && (
                    <div style={styles.adminBtns}>
                      <Link to={`/edit/${item.id}`} style={styles.editBtn}>
                        ✏️ Изменить
                      </Link>
                      <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "1200px", margin: "0 auto", padding: "1rem 1.5rem 2rem" },
  breadcrumb: { color: "#999", fontSize: "0.85rem", marginBottom: "1rem" },
  layout: { display: "flex", gap: "1.5rem", alignItems: "flex-start" },
  sidebar: {
    width: "190px", flexShrink: 0, background: "white",
    borderRadius: "12px", padding: "1.25rem", border: "1px solid #e8e8e8",
    position: "sticky", top: "80px",
  },
  filterTitle: { fontSize: "0.85rem", color: "#333", marginBottom: "10px", fontWeight: "600" },
  catBtn: {
    display: "block", width: "100%", textAlign: "left",
    padding: "8px 10px", marginBottom: "4px", background: "none",
    border: "none", borderRadius: "6px", fontSize: "0.85rem", color: "#555", cursor: "pointer",
  },
  catBtnActive: { background: "#f0edff", color: "#6c4ef2", fontWeight: "600" },
  filterSelect: { width: "100%", padding: "8px", border: "1px solid #e8e8e8", borderRadius: "6px", fontSize: "0.85rem" },
  main: { flex: 1 },
  topBar: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" },
  title: { fontSize: "1.3rem", color: "#1a1a1a", flexShrink: 0 },
  searchInput: {
    flex: 1, minWidth: "180px", padding: "9px 14px",
    border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "0.9rem", background: "#f5f5f5",
  },
  addBtn: { background: "#6c4ef2", color: "white", padding: "9px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", textDecoration: "none" },
  count: { color: "#999", fontSize: "0.85rem", marginBottom: "1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem" },
  card: { background: "white", borderRadius: "12px", border: "1px solid #e8e8e8", overflow: "hidden", display: "flex", flexDirection: "column" },
  imgWrap: { position: "relative", background: "#f9f9f9", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
  img: { maxHeight: "150px", maxWidth: "100%", objectFit: "contain" },
  heartBtn: { position: "absolute", bottom: "10px", right: "10px", background: "white", border: "1px solid #e8e8e8", borderRadius: "50%", width: "32px", height: "32px", fontSize: "1rem", cursor: "pointer" },
  cardBody: { padding: "0.875rem", flex: 1, display: "flex", flexDirection: "column", gap: "4px" },
  badge: { display: "inline-block", background: "#f0edff", color: "#6c4ef2", padding: "2px 8px", borderRadius: "20px", fontSize: "0.72rem", marginBottom: "3px" },
  cardTitle: { fontSize: "0.88rem", color: "#1a1a1a", lineHeight: 1.4, flex: 1 },
  rating: { color: "#f59e0b", fontSize: "0.8rem" },
  inStock: { color: "#22c55e", fontSize: "0.78rem", fontWeight: "500" },
  price: { fontSize: "1.1rem", fontWeight: "700", color: "#1a1a1a" },
  detailLink: { color: "#6c4ef2", fontSize: "0.82rem", marginBottom: "4px", textDecoration: "none" },
  cartBtn: { background: "#6c4ef2", color: "white", border: "none", padding: "9px", borderRadius: "8px", fontSize: "0.88rem", fontWeight: "500", cursor: "pointer" },
  cartBtnAdded: { background: "#22c55e" },
  adminBtns: { display: "flex", gap: "6px", marginTop: "6px" },
  editBtn: { fontSize: "0.78rem", color: "#6c4ef2", textDecoration: "none" },
  deleteBtn: { background: "#fff0f0", border: "none", borderRadius: "6px", padding: "4px 8px", fontSize: "0.85rem", color: "#ff4444", cursor: "pointer" },
  center: { textAlign: "center", padding: "3rem", color: "#999" },
};
