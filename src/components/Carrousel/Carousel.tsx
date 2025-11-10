import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../../../src/types';

// ✅ Endereço fixo do backend
const API_BASE_URL = "http://localhost:8080";

interface CarouselProps {
  products: Product[];
}

const Carousel: React.FC<CarouselProps> = ({ products }) => {
  console.count("🔁 [Carousel] Renderizações");

  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔁 Próximo slide
  const nextSlide = useCallback(() => {
    if (products.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }
  }, [products.length]);

  // ⏳ Troca automática a cada 5s
  useEffect(() => {
    if (products.length === 0) return;

    console.log("🎠 [Carousel] Iniciando com produtos:", products.length);
    const interval = setInterval(nextSlide, 5000);

    return () => {
      console.log("🧹 [Carousel] Limpando intervalo anterior");
      clearInterval(interval);
    };
  }, [nextSlide]);

  if (products.length === 0) {
    console.warn("⚠️ [Carousel] Nenhum produto recebido!");
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="position-relative w-100 rounded shadow mb-4 bg-dark overflow-hidden" style={{height: '16rem'}}>
      {/* Slides */}
      <div
        className="d-flex w-100 h-100"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.7s ease-in-out' }}
      >
        {products.map((product) => {
          // 🔗 Gera URL da imagem com base no ID
          const imageUrl = `${API_BASE_URL}/imagens/${product.id}.jpg`;

          return (
            <div key={product.id} className="position-relative w-100 h-100 flex-shrink-0">
              <img
                src={imageUrl}
                alt={product.nome}
                className="w-100 h-100"
                style={{objectFit: 'cover'}}
                onError={(e) => {
                  console.error(`🚨 [Carousel] Erro ao carregar imagem ID=${product.id}`);
                  console.error("URL com erro:", (e.target as HTMLImageElement).src);
                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                }}
              />
              <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-25"></div>
            </div>
          );
        })}
      </div>

      {/* Texto sobreposto */}
      <div className="position-absolute bottom-0 start-0 p-3 p-md-4 text-white" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'}}>
        <h2 className="fs-3 fs-md-1 fw-bold mb-2">
          {currentProduct.nome}
        </h2>
        <p className="fs-5 fs-md-2 fw-light">
          {typeof currentProduct.preco === 'number'
            ? `R$ ${currentProduct.preco.toFixed(2)}`
            : 'R$ 0,00'}
        </p>
      </div>

      {/* Indicadores */}
      <div className="position-absolute bottom-0 end-0 d-flex gap-2 p-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              console.log(`🔘 [Carousel] Mudando para slide ${index + 1}`);
              setCurrentIndex(index);
            }}
            className={`rounded-circle border-0 ${currentIndex === index ? 'bg-white' : 'bg-white opacity-50'}`}
            style={{width: '0.75rem', height: '0.75rem', transition: 'background-color 0.3s'}}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
