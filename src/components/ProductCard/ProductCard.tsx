import React, { useEffect } from 'react';
import { Product } from '../../../src/types';
import { CartIcon } from '../Icons/icons';

// ✅ Endereço fixo do backend (simples e direto)
const API_BASE_URL = "http://localhost:8080";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {

  // 🔍 Loga os dados recebidos do produto
  useEffect(() => {
    console.log("🟡 [Card] Renderizando card do produto:", {
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      foto: product.foto,
      categoria: product.categoria,
    });
  }, [product]);

  // 🔗 Monta a URL da imagem de forma segura
  const imageUrl = `${API_BASE_URL}/imagens/${product.id}.jpg`;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
    >
      {/* ✅ Usa imagem do backend, com fallback se der erro */}
      <img
        src={imageUrl}
        alt={product.nome}
        className="w-full h-48 object-cover"
        onError={(e) => {
          console.error(`🚨 [Card] Erro ao carregar imagem do produto ID=${product.id}`);
          console.error("URL com erro:", (e.target as HTMLImageElement).src);
          (e.target as HTMLImageElement).src = '/placeholder.jpg';
        }}
      />

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.nome}</h3>

        {/* 🏷️ Exibe categoria se houver */}
        <p className="text-sm text-gray-500 mb-4">
          {product.categoria?.nome || 'Sem categoria'}
        </p>

        <div className="mt-auto flex justify-between items-center">
          {/* 💰 Exibe preço com fallback */}
          <p className="text-xl font-bold text-gray-900">
            {product.preco !== undefined && product.preco !== null
              ? `R$ ${product.preco.toFixed(2)}`
              : 'R$ 0,00'}
          </p>

          <button
            onClick={() => {
              console.log("🛒 [Card] Produto adicionado ao carrinho:", {
                id: product.id,
                nome: product.nome,
                preco: product.preco,
              });
              onAddToCart(product);
            }}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-200"
          >
            <CartIcon className="w-5 h-5 mr-2" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
