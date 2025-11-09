import React from 'react';
import { Product } from '../../../src/types';
import { CartIcon } from '../Icons/icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{product.category}</p>
        <div className="mt-auto flex justify-between items-center">
          <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-200"
          >
            <CartIcon className="w-5 h-5 mr-2" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
