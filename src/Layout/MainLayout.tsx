import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as bootstrap from "bootstrap"; // ✅ importante para controlar o Offcanvas

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import CartSidebar from "../components/CartSidebar/CartSidebar";
import LoginModal from "../components/LoginModal/LoginModal";

import { User, CartItem, Product } from "../types";
import { useTheme } from "../ThemeContext";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  // 🧠 Carrega token e carrinho uma vez ao iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setCurrentUser({ name: decoded.sub || "Vendedor" });
      } catch {
        console.error("Erro ao decodificar token");
        localStorage.removeItem("token");
      }
    }

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // 💾 Mantém o carrinho sincronizado no localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 👤 Login bem-sucedido
  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded: any = jwtDecode(token);
      setCurrentUser({ name: decoded.sub || "Vendedor" });
    } catch {
      console.error("Erro ao decodificar token no login");
    }
    setLoginModalOpen(false);
  };

  // 🚪 Logout (Header e Sidebar compartilham a mesma função)
 const handleLogout = () => {
    console.log("🚪 handleLogout executado no MainLayout");
  const confirmou = window.confirm("Deseja realmente sair?");
  if (!confirmou) return;

  // Limpa dados
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  setCurrentUser(null);
  setCart([]);
  setCartOpen(false);

  // Fecha o menu lateral se estiver aberto
  const offcanvasEl = document.getElementById("sidebarMenu");
  if (offcanvasEl) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
  }

  console.log("🚪 Logout completo, navegando para /");

  // ✅ Redireciona
  setTimeout(() => navigate("/"), 250);
  console.log("🚪 handleLogout executado no MainLayout");
};

  // 🧮 Total de itens no carrinho (para o Header)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🛒 Adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...prev,
            {
              ...product,
              quantity: 1,
            },
          ];

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    // Abre o carrinho automaticamente
    setCartOpen(true);
  };

  // 🔁 Atualiza quantidade ou remove item
  const handleUpdateCartQuantity = (id: number, qty: number) => {
    setCart((prev) => {
      const updated =
        qty <= 0
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) =>
              item.id === id ? { ...item, quantity: qty } : item
            );

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // 💰 Finalizar compra
  const handleFinalizeSale = () => {
    if (!currentUser) {
      setCartOpen(false);
      setLoginModalOpen(true);
      return;
    }

    navigate("/pedido", { state: { cart } });
  };

  return (
    <div
      className={`d-flex flex-column min-vh-100 ${
        isDark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      {/* HEADER FIXO */}
      <Header
        user={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onCartClick={() => setCartOpen(true)}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
      />

      {/* SIDEBAR (MENU) – aparece só se estiver logado */}
      {currentUser && (
        <Sidebar onLogout={handleLogout} isVisible={!!currentUser} />
      )}

      {/* CONTEÚDO DAS PÁGINAS */}
      <main className="flex-grow-1 pt-4 mt-4">
        <Outlet context={{ addToCart }} />
      </main>

      {/* MODAL DE LOGIN GLOBAL */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* SIDEBAR DO CARRINHO GLOBAL */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onFinalizeSale={handleFinalizeSale}
        onRequireLogin={() => setLoginModalOpen(true)}
      />
    </div>
  );
};

export default MainLayout;
