import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";

import Home       from "./pages/Home";
import List       from "./pages/List";
import Details    from "./pages/Details";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Create     from "./pages/Create";
import Edit       from "./pages/Edit";
import Profile    from "./pages/Profile";
import Dashboard  from "./pages/Dashboard";
import Favorites  from "./pages/Favorites";
import AdminPanel from "./pages/AdminPanel";
import NotFound   from "./pages/NotFound";
import Cart       from "./pages/Cart";

// Защита для авторизованных пользователей
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Защита только для администраторов
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />; // не админ → на главную
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Публичные */}
        <Route path="/"            element={<Home />} />
        <Route path="/list"        element={<List />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/cart"        element={<Cart />} />

        {/* Для авторизованных */}
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create"     element={<ProtectedRoute><Create /></ProtectedRoute>} />
        <Route path="/edit/:id"   element={<ProtectedRoute><Edit /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/favorites"  element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

        {/* Только для администраторов */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

