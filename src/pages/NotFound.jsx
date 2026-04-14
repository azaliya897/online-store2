import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={styles.page}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.text}>Страница не найдена</p>
      <Link to="/" style={styles.btn}>← На главную</Link>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  code: { fontSize: "6rem", color: "#6c4ef2", margin: 0, fontWeight: "800" },
  text: { color: "#999", fontSize: "1.2rem", margin: "1rem 0 2rem" },
  btn: {
    background: "#6c4ef2",
    color: "white",
    padding: "12px 28px",
    borderRadius: "8px",
    fontWeight: "600",
  },
};