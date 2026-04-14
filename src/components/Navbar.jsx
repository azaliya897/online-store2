import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>GLANCE</Link>

        <div style={styles.right}>
          <Link to="/list" style={styles.navItem}>📦 Каталог</Link>
          <Link to="/cart" style={styles.navItem}>
            🛒 Корзина {cartCount > 0 && `(${cartCount})`}
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.navItem}>👤 {user.username}</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navItem}>Войти</Link>
              <Link to="/register" style={styles.registerBtn}>Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: "white", borderBottom: "1px solid #e8e8e8", padding: "0 1.5rem", height: "64px", display: "flex", alignItems: "center" },
  inner: { maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: "1.4rem", fontWeight: "800", color: "#6c4ef2", textDecoration: "none" },
  right: { display: "flex", alignItems: "center", gap: "1.2rem" },
  navItem: { color: "#444", textDecoration: "none", fontSize: "0.95rem" },
  logoutBtn: { background: "transparent", border: "1px solid #e8e8e8", padding: "6px 12px", borderRadius: "6px", color: "#ff4444", cursor: "pointer" },
  registerBtn: { background: "#6c4ef2", color: "white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none" },
};