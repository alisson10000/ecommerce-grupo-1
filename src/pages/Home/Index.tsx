import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Carousel from "../../components/Carrousel/Carousel";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../components/Pagination/Pagination";
import { Product, CartItem } from "../../types";

const API_BASE_URL = "http://localhost:8080";

const Home: React.FC = () => {
  // Estados apenas para produtos e carrinho local
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 8;

  // 🧩 Carrega carrinho salvo no localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
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

      localStorage.setItem("cart", JSON.stringify(updated));
      console.log("🧺 [Home] Carrinho atualizado:", updated);
      return updated;
    });
  };

  console.log("🎨 [Render] Home:", {
    produtos: products.length,
    carrinho: cart.length,
  });

  return (
    <div className="font-family-sans-serif text-dark">
      <div className="container-fluid px-3 px-sm-4 px-lg-5 pt-5 pb-4">
        <br />
        <br />
        <br />
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
      </div>
    </div>
  );
};

export default Home;
