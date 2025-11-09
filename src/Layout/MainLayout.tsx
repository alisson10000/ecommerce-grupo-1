import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header/Header';
import LoginModal from '../components/LoginModal/LoginModal';
import CartSidebar from '../components/CartSidebar/CartSidebar';
import { User, CartItem } from '../types';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  // 🔹 Recupera token e usuário ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setCurrentUser({ name: decoded.sub || 'Vendedor' });
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
      }
    }

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 👤 Login bem-sucedido
  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    try {
      const decoded: any = jwtDecode(token);
      setCurrentUser({ name: decoded.sub || 'Vendedor' });
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
    }
  };

  // 🚪 Logout global
  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
    }
  };

  return (
    <div className="font-sans text-gray-900">
      <Header
        user={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onCartClick={() => setCartOpen(true)}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
      />

      {/* 🔹 Outlet renderiza o conteúdo da página atual */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Outlet />
      </main>

      {/* Modais globais */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={(id, qty) =>
          setCart((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, quantity: qty } : item
            )
          )
        }
        onFinalizeSale={() => navigate('/pedido', { state: { cart } })}
      />
    </div>
  );
};

export default MainLayout;
