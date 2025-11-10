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
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-2xl mb-8 bg-gray-800">
      {/* Slides */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {products.map((product) => {
          // 🔗 Gera URL da imagem com base no ID
          const imageUrl = `${API_BASE_URL}/imagens/${product.id}.jpg`;

          return (
            <div key={product.id} className="w-full h-full flex-shrink-0 relative">
              <img
                src={imageUrl}
                alt={product.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`🚨 [Carousel] Erro ao carregar imagem ID=${product.id}`);
                  console.error("URL com erro:", (e.target as HTMLImageElement).src);
                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          );
        })}
      </div>

      {/* Texto sobreposto */}
      <div className="absolute bottom-0 left-0 p-4 md:p-8 text-white bg-gradient-to-t from-black/70 to-transparent">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">
          {currentProduct.nome}
        </h2>
        <p className="text-lg md:text-2xl font-light">
          {typeof currentProduct.preco === 'number'
            ? `R$ ${currentProduct.preco.toFixed(2)}`
            : 'R$ 0,00'}
        </p>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              console.log(`🔘 [Carousel] Mudando para slide ${index + 1}`);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
