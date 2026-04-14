import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>📱 GLANCE TECH</h1>
        <p style={styles.subtitle}>iPhone • Samsung • Xiaomi • Sony • LG • Apple • Huawei</p>
        <p style={styles.subtitle}>Смартфоны • Ноутбуки • Телевизоры • Наушники • Умный дом</p>
        <Link to="/list" style={styles.btn}>Смотреть каталог →</Link>
      </div>

      <div style={styles.categories}>
        <h2 style={styles.sectionTitle}>🔥 Популярные категории</h2>
        <div style={styles.categoryGrid}>
          <Link to="/list" style={styles.categoryCard}><span style={styles.categoryIcon}>📱</span><span>Смартфоны</span></Link>
          <Link to="/list" style={styles.categoryCard}><span style={styles.categoryIcon}>💻</span><span>Ноутбуки</span></Link>
          <Link to="/list" style={styles.categoryCard}><span style={styles.categoryIcon}>📺</span><span>Телевизоры</span></Link>
          <Link to="/list" style={styles.categoryCard}><span style={styles.categoryIcon}>🎧</span><span>Наушники</span></Link>
          <Link to="/list" style={styles.categoryCard}><span style={styles.categoryIcon}>⌚</span><span>Смарт-часы</span></Link>
          <Link to="/list" style={styles.categoryCard}><span style={styles.categoryIcon}>📟</span><span>Планшеты</span></Link>
          <Link to="/list" style={styles.categoryCard}><span style={styles.categoryIcon}>🔊</span><span>Колонки</span></Link>
          <Link to="/list" style={styles.categoryCard}><span style={styles.categoryIcon}>🎮</span><span>Игры и гаджеты</span></Link>
        </div>
      </div>

      <div style={styles.brands}>
        <h2 style={styles.sectionTitle}>🏆 Популярные бренды</h2>
        <div style={styles.brandGrid}>
          <span style={styles.brand}>Apple</span>
          <span style={styles.brand}>Samsung</span>
          <span style={styles.brand}>Xiaomi</span>
          <span style={styles.brand}>Sony</span>
          <span style={styles.brand}>LG</span>
          <span style={styles.brand}>Huawei</span>
          <span style={styles.brand}>OnePlus</span>
          <span style={styles.brand}>Google</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" },
  hero: { textAlign: "center", padding: "4rem 2rem", background: "linear-gradient(135deg, #6c4ef2 0%, #8a6eff 100%)", borderRadius: "24px", marginBottom: "3rem", color: "white" },
  title: { fontSize: "2.5rem", marginBottom: "1rem" },
  subtitle: { fontSize: "1.1rem", marginBottom: "0.5rem", opacity: 0.9 },
  btn: { background: "white", color: "#6c4ef2", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", display: "inline-block", marginTop: "1rem" },
  sectionTitle: { textAlign: "center", marginBottom: "2rem", fontSize: "1.8rem", color: "#1a1a1a" },
  categories: { marginBottom: "3rem" },
  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem" },
  categoryCard: { background: "#f5f5f5", padding: "1.2rem", borderRadius: "16px", textAlign: "center", textDecoration: "none", color: "#333", transition: "transform 0.2s" },
  categoryIcon: { fontSize: "2rem", display: "block", marginBottom: "0.5rem" },
  brands: { marginBottom: "3rem", textAlign: "center" },
  brandGrid: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" },
  brand: { background: "#eee", padding: "8px 20px", borderRadius: "30px", fontSize: "0.9rem", color: "#555" },
};
