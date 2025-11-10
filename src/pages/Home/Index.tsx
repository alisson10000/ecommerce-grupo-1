import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Carousel from '../../components/Carrousel/Carousel';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import LoginModal from '../../components/LoginModal/LoginModal';
import CartSidebar from '../../components/CartSidebar/CartSidebar';
import { Product, User, CartItem } from '../../types';

const API_BASE_URL = "http://localhost:8080";

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Estados principais
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [saleSuccessMessage, setSaleSuccessMessage] = useState<string | null>(null);

  const PRODUCTS_PER_PAGE = 8;

  // 🧩 Carrega carrinho salvo no localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length > 0) {
      console.log("📦 [Home] Carrinho recuperado:", savedCart);
      setCart(savedCart);
    }
  }, []);

  // 🟢 Busca produtos do backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🟡 [Home] Buscando produtos...");
        const response = await axios.get(`${API_BASE_URL}/produtos`);
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error("🔴 Backend retornou formato inválido:", data);
          return;
        }

        setProducts(data);
        setFeaturedProducts(data.slice(0, 4));
        console.log(`🟢 ${data.length} produtos carregados com sucesso.`);
      } catch (error) {
        console.error("🚨 Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  // 📄 Paginação
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return products.slice(start, end);
  }, [currentPage, products]);

  // 🛒 Contagem total de itens no carrinho
  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // 🛍️ Adicionar produto ao carrinho
  const handleAddToCart = (product: Product) => {
    console.log("🛒 [Home] Adicionando produto:", product);

    const newItem: CartItem = { ...product, quantity: 1 };

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === newItem.id);
      let updated;

      if (existing) {
        updated = prevCart.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prevCart, newItem];
      }

      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });

    // 👇 Abre automaticamente o sidebar quando adiciona o produto
    setCartOpen(true);
  };

  // 🔢 Atualiza quantidade
  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    console.log(`🔄 [Home] Atualizando quantidade ID=${productId} → ${newQuantity}`);
    setCart((prev) => {
      const updated =
        newQuantity <= 0
          ? prev.filter((item) => item.id !== productId)
          : prev.map((item) =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            );

      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // 💰 Finalizar venda → redireciona para /pedido
  const handleFinalizeSale = () => {
    if (!currentUser) {
      console.warn("⚠️ [Home] Usuário não logado → abrir modal de login");
      setCartOpen(false);
      setLoginModalOpen(true);
      return;
    }

    console.log("✅ [Home] Redirecionando com carrinho:", cart);
    navigate('/pedido', { state: { cart } });
  };

  // 👤 Login bem-sucedido
  const handleLoginSuccess = (token: string) => {
    console.log("🔑 [Home] Login bem-sucedido:", token);
    localStorage.setItem('token', token);

    try {
      const decoded: any = jwtDecode(token);
      setCurrentUser({ name: decoded.sub || 'Vendedor' });
    } catch (err) {
      console.error("🚨 Erro ao decodificar token:", err);
    }
  };

  // ⏳ Limpa mensagem de sucesso
  useEffect(() => {
    if (saleSuccessMessage) {
      const timer = setTimeout(() => setSaleSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [saleSuccessMessage]);

  console.log("🎨 [Render] Home:", {
    produtos: products.length,
    carrinho: cart.length,
    sidebar: isCartOpen ? "ABERTO" : "FECHADO",
  });

  return (
    <div className="font-family-sans-serif text-dark">
      {/* ✅ HEADER */}
      <Header
        user={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onCartClick={() => {
          console.log("🧭 [Home] Botão do carrinho clicado → abrindo sidebar");
          setCartOpen(true);
        }}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('token');
        }}
        cartItemCount={cartItemCount}
      />

      {/* ✅ CONTEÚDO */}
      <main className="container-fluid px-3 px-sm-4 px-lg-5 pt-5 pb-4">
        <Carousel products={featuredProducts} />

        <h2 className="fs-1 fw-bold text-dark mb-4">Todos os Produtos</h2>
        <div className="row g-3">
          {currentProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* ✅ MODAL DE LOGIN */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* ✅ SIDEBAR DO CARRINHO */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => {
          console.log("🧩 [Home] Fechando sidebar");
          setCartOpen(false);
        }}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onFinalizeSale={handleFinalizeSale}
      />

      {/* ✅ ALERTA DE SUCESSO */}
      {saleSuccessMessage && (
        <div className="position-fixed bottom-0 end-0 bg-success text-white p-3 rounded shadow" style={{margin: '1rem'}}>
          {saleSuccessMessage}
        </div>
      )}
    </div>
  );
};

export default Home;
