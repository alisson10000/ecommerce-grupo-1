import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../../../src/types';

interface CarouselProps {
  products: Product[];
}

const Carousel: React.FC<CarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (products.length > 0) {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }
  }, [products, nextSlide]);

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-2xl mb-8 bg-gray-800">
        <div className="w-full h-full flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {products.map((product) => (
                <div key={product.id} className="w-full h-full flex-shrink-0 relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>
            ))}
        </div>

        <div className="absolute bottom-0 left-0 p-4 md:p-8 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 transition-opacity duration-500">{currentProduct.name}</h2>
            <p className="text-lg md:text-2xl font-light transition-opacity duration-500">${currentProduct.price.toFixed(2)}</p>
        </div>
        
        <div className="absolute bottom-4 right-4 flex space-x-2">
            {products.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                ></button>
            ))}
        </div>
    </div>
  );
};

export default Carousel;
