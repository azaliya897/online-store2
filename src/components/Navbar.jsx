import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
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
          <Link to="/list" style={styles.navItem}>
            <span>☰</span>
            <span style={styles.navLabel}>Каталог</span>
          </Link>

          <Link to="/cart" style={styles.navItem}>
            <span style={{ position: "relative", display: "inline-block" }}>
              🛒
              {cartCount > 0 && (
                <span style={styles.badge}>{cartCount}</span>
              )}
            </span>
            <span style={styles.navLabel}>Корзина</span>
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={styles.navItem}>
                <span>📊</span>
                <span style={styles.navLabel}>Dashboard</span>
              </Link>
              <Link to="/profile" style={styles.navItem}>
                <span>👤</span>
                <span style={styles.navLabel}>{user.username}</span>
              </Link>
              {isAdmin && isAdmin() && (
                <Link to="/admin" style={styles.adminBtn}>🔧 Admin</Link>
              )}
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navItem}>
                <span>👤</span>
                <span style={styles.navLabel}>Войти</span>
              </Link>
              <Link to="/register" style={styles.registerBtn}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "white",
    borderBottom: "1px solid #e8e8e8",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "800",
    color: "#6c4ef2",
    letterSpacing: "1px",
    flexShrink: 0,
    textDecoration: "none",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    flexShrink: 0,
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    color: "#444",
    textDecoration: "none",
  },
  navLabel: { fontSize: "0.72rem", color: "#555" },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-8px",
    background: "#ff4444",
    color: "white",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    fontSize: "0.65rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
  adminBtn: {
    background: "#fff3e0",
    color: "#e65100",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textDecoration: "none",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #e8e8e8",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#ff4444",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  registerBtn: {
    background: "#6c4ef2",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textDecoration: "none",
  },
};
