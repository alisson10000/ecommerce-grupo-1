import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from '../../components/Header/Header';
import Carousel from '../../components/Carrousel/Carousel';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import LoginModal from '../../components/LoginModal/LoginModal';
import CartSidebar from '../../components/CartSidebar/CartSidebar';
import { Product, User, CartItem } from '../../types';
import { MOCK_PRODUCTS, PRODUCTS_PER_PAGE, FEATURED_PRODUCTS_IDS } from '../../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [saleSuccessMessage, setSaleSuccessMessage] = useState<string | null>(null);

  const featuredProducts = useMemo(
    () => MOCK_PRODUCTS.filter((p) => FEATURED_PRODUCTS_IDS.includes(p.id)),
    []
  );

  const totalPages = Math.ceil(MOCK_PRODUCTS.length / PRODUCTS_PER_PAGE);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return MOCK_PRODUCTS.slice(startIndex, endIndex);
  }, [currentPage]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // 🛒 Adicionar produto ao carrinho
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  // 🧮 Atualizar quantidade do carrinho
  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // 💰 Finalizar venda
  const handleFinalizeSale = () => {
    if (!currentUser) {
      alert('Faça login para finalizar a venda.');
      setCartOpen(false);
      setLoginModalOpen(true);
      return;
    }
    setCart([]);
    setCartOpen(false);
    setSaleSuccessMessage('Venda finalizada com sucesso!');
  };

  // 👤 Login bem-sucedido
  const handleLoginSuccess = (token: string) => {
    console.log('🟢 Login bem-sucedido. Redirecionando para página de pedido...');
    localStorage.setItem('token', token);

    try {
      const decoded: any = jwtDecode(token);
      setCurrentUser({ name: decoded.sub || 'Vendedor' });
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
    }

navigate('/pedido', { state: { cart } });

  };

  useEffect(() => {
    if (saleSuccessMessage) {
      const timer = setTimeout(() => {
        setSaleSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saleSuccessMessage]);

  return (
    <div className="font-sans text-gray-900">
      <Header
        user={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onCartClick={() => setCartOpen(true)}
        onLogout={() => setCurrentUser(null)}
        cartItemCount={cartItemCount}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Carousel products={featuredProducts} />

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Todos os Produtos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart} // ✅ voltou a funcionar
            />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onFinalizeSale={handleFinalizeSale}
      />

      {saleSuccessMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg animate-fade-in">
          {saleSuccessMessage}
        </div>
      )}
    </div>
  );
};

export default Home;
