import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Header from "../components/Header/Header";
import LoginModal from "../components/LoginModal/LoginModal";
import CartSidebar from "../components/CartSidebar/CartSidebar";
import Sidebar from "../components/Sidebar/Sidebar";
import { User, CartItem } from "../types";
import { useTheme } from "../ThemeContext";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  // 🎨 Log de cada render
  console.log("🎨 [MainLayout] Render:", {
    currentUser,
    isLoginModalOpen,
    isCartOpen,
    cartLength: cart.length,
  });

  // 🧠 Carregar usuário e carrinho só uma vez (ao montar)
  useEffect(() => {
    console.group("🧠 [MainLayout] init");

    // Token
    const token = localStorage.getItem("token");
    console.log("🔐 Token no localStorage:", token);

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const name = decoded.sub || "Vendedor";
        setCurrentUser({ name });
        console.log("✅ Usuário autenticado ao iniciar:", name);
      } catch (err) {
        console.error("❌ Erro ao decodificar token:", err);
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    } else {
      console.log("🚫 Nenhum token encontrado ao iniciar.");
    }

    // Carrinho
    const savedCartRaw = localStorage.getItem("cart") || "[]";
    console.log("🧺 Cart bruto no localStorage:", savedCartRaw);

    try {
      const savedCart: CartItem[] = JSON.parse(savedCartRaw);
      console.log("🟢 Carrinho carregado:", savedCart);
      setCart(savedCart);
    } catch (err) {
      console.error("❌ Erro ao fazer parse do carrinho:", err);
      setCart([]);
    }

    console.groupEnd();
  }, []);

  // 🧮 Total de itens no carrinho
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  console.log("🧮 [MainLayout] cartItemCount:", cartItemCount);

  // 🔐 Login bem-sucedido (USADO PELO LoginModal GLOBAL)
  const handleLoginSuccess = (token: string) => {
    console.group("🔑 [MainLayout] handleLoginSuccess");
    console.log("📥 Token recebido:", token);
    localStorage.setItem("token", token);

    try {
      const decoded: any = jwtDecode(token);
      const name = decoded.sub || "Vendedor";
      setCurrentUser({ name });
      console.log("✅ currentUser atualizado:", { name });
    } catch (err) {
      console.error("❌ Erro ao decodificar token no login:", err);
    }

    setLoginModalOpen(false);
    console.groupEnd();
  };

  // 🚪 Logout global
  const handleLogout = () => {
    console.group("🚪 [MainLayout] handleLogout");
    const confirmou = window.confirm("Deseja realmente sair?");
    console.log("❓ Confirmação logout:", confirmou);

    if (confirmou) {
      console.warn("👋 Usuário confirmou logout.");
      localStorage.removeItem("token");
      setCurrentUser(null);
      navigate("/", { replace: true });
    } else {
      console.log("↩️ Logout cancelado.");
    }
    console.groupEnd();
  };

  // 🔁 Atualizar quantidade no carrinho
  const handleUpdateCartQuantity = (id: number, qty: number) => {
    console.group("🔁 [MainLayout] handleUpdateCartQuantity");
    console.log(`🧮 Atualizando produto ID=${id} para quantidade=${qty}`);

    setCart((prev) => {
      console.log("📦 Carrinho anterior:", prev);
      const updated =
        qty <= 0
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) =>
              item.id === id ? { ...item, quantity: qty } : item
            );
      console.log("🆕 Carrinho atualizado:", updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    console.groupEnd();
  };

  // 💰 Finalizar compra
  const handleFinalizeSale = () => {
    console.group("💰 [MainLayout] handleFinalizeSale");
    console.log("👤 currentUser:", currentUser);
    console.log("🧺 Carrinho atual:", cart);

    if (!currentUser) {
      console.warn("⚠️ Usuário não logado → abrindo modal de login.");
      setCartOpen(false);
      setLoginModalOpen(true);
      console.groupEnd();
      return;
    }

    console.log("✅ Redirecionando para /pedido com carrinho.");
    navigate("/pedido", { state: { cart } });
    console.groupEnd();
  };

  // Log da visibilidade da Sidebar
  useEffect(() => {
    console.log(
      "🧭 [MainLayout] Sidebar visível?",
      currentUser ? "SIM" : "NÃO"
    );
  }, [currentUser]);

  return (
    <div className={`d-flex ${isDark ? "dark-mode" : ""}`}>
      {/* ✅ Sidebar aparece só quando currentUser existe */}
      {currentUser && (
        <Sidebar
          onLogout={handleLogout}
          isVisible={!!currentUser}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-grow-1">
        <Header
          user={currentUser}
          onLoginClick={() => {
            console.log("🧩 [MainLayout] Botão login clicado → abrir modal");
            setLoginModalOpen(true);
          }}
          onCartClick={() => {
            console.log("🧺 [MainLayout] Botão carrinho clicado → abrir sidebar");
            setCartOpen(true);
          }}
          onLogout={handleLogout}
          cartItemCount={cartItemCount}
        />

        <main className="container pt-5 mt-4 mb-5">
          <Outlet />
        </main>

        {/* Modal global de Login */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => {
            console.log("🧩 [MainLayout] Fechando LoginModal");
            setLoginModalOpen(false);
          }}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Sidebar global do Carrinho */}
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => {
            console.log("🧺 [MainLayout] Fechando CartSidebar");
            setCartOpen(false);
          }}
          cartItems={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onFinalizeSale={handleFinalizeSale}
        />
      </div>
    </div>
  );
};

export default MainLayout;
