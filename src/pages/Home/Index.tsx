import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

import Carousel from "../../components/Carrousel/Carousel";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../components/Pagination/Pagination";
import Footer from "../../components/Footer/Footer";
import { Product } from "../../types";

const API_BASE_URL = "http://localhost:8080";

type LayoutContext = {
  addToCart: (product: Product) => void;
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

  const { addToCart } = useOutletContext<LayoutContext>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/produtos`);
        const data = response.data;
        if (!Array.isArray(data)) return;

        setProducts(data);
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return products.slice(start, end);
  }, [currentPage, products]);

  return (
    <>
      {/* 🔹 Container principal apenas para o conteúdo */}
      <div className="container px-3 px-sm-4 px-lg-5 pb-4">
        <div className="mb-5 mt-4">
          <Carousel products={featuredProducts} />
        </div>

        <h2 className="fs-1 fw-bold text-dark mb-4 text-center text-md-start">
          Todos os Produtos
        </h2>

        <div className="row g-3">
          {currentProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={product} onAddToCart={addToCart} />
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center text-muted mt-5">
              <p>Nenhum produto disponível no momento.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* 🔹 Footer fora do container para ocupar 100% da largura */}
      <Footer />
    </>
  );
};

export default Home;
