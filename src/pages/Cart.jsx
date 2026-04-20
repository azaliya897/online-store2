import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();

  // Преобразуем cartTotal в число
  const total = Number(cartTotal) || 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>🛒 Корзина пуста</p>
        <Link to="/list" style={styles.goBtn}>Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🛒 Корзина</h2>

      <div style={styles.list}>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.row}>
            <img src={item.image} alt={item.title} style={styles.img} />
            <div style={styles.info}>
              <p style={styles.itemTitle}>{item.title?.slice(0, 50)}</p>
              <p style={styles.itemPrice}>${item.price} × {item.quantity}</p>
            </div>
            <p style={styles.itemTotal}>
              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </p>
            <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>🗑️</button>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <p style={styles.total}>Итого: <b>${total.toFixed(2)}</b></p>
        <div style={styles.footerBtns}>
          <button onClick={clearCart} style={styles.clearBtn}>Очистить корзину</button>
          <button style={styles.orderBtn}>Оформить заказ</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "800px", margin: "0 auto", padding: "2rem" },
  title: { color: "#1a1a1a", marginBottom: "1.5rem" },
  list: { display: "flex", flexDirection: "column", gap: "1rem" },
  row: {
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  img: { width: "60px", height: "60px", objectFit: "contain", background: "#f9f9f9", borderRadius: "8px", padding: "4px" },
  info: { flex: 1, minWidth: "150px" },
  itemTitle: { fontSize: "0.9rem", color: "#1a1a1a", marginBottom: "4px" },
  itemPrice: { fontSize: "0.85rem", color: "#999" },
  itemTotal: { fontSize: "1rem", fontWeight: "700", color: "#6c4ef2", minWidth: "70px", textAlign: "right" },
  removeBtn: { background: "#fff0f0", border: "none", borderRadius: "8px", padding: "8px 12px", color: "#ff4444", cursor: "pointer" },
  footer: {
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "1.5rem",
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  total: { fontSize: "1.2rem", color: "#1a1a1a" },
  footerBtns: { display: "flex", gap: "1rem" },
  clearBtn: { padding: "10px 20px", background: "white", border: "1px solid #e8e8e8", borderRadius: "8px", color: "#ff4444", cursor: "pointer" },
  orderBtn: { padding: "10px 24px", background: "#6c4ef2", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  empty: { textAlign: "center", padding: "5rem 2rem" },
  emptyText: { fontSize: "1.3rem", color: "#999", marginBottom: "1.5rem" },
  goBtn: { background: "#6c4ef2", color: "white", padding: "12px 28px", borderRadius: "8px", display: "inline-block", fontWeight: "600", textDecoration: "none" },
};