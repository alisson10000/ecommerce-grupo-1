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
    <div className="card h-100 shadow-sm">
      {/* ✅ Usa imagem do backend, com fallback se der erro */}
      <img
        src={imageUrl}
        alt={product.nome}
        className="card-img-top"
        style={{height: '12rem', objectFit: 'cover'}}
        onError={(e) => {
          console.error(`🚨 [Card] Erro ao carregar imagem do produto ID=${product.id}`);
          console.error("URL com erro:", (e.target as HTMLImageElement).src);
          (e.target as HTMLImageElement).src = '/placeholder.jpg';
        }}
      />

      <div className="card-body d-flex flex-column">
        <h3 className="card-title fs-6 fw-semibold text-truncate">{product.nome}</h3>

        {/* 🏷️ Exibe categoria se houver */}
        <p className="text-muted small mb-4">
          {product.categoria?.nome || 'Sem categoria'}
        </p>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          {/* 💰 Exibe preço com fallback */}
          <p className="fs-5 fw-bold text-dark mb-0">
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
            className="btn btn-primary d-flex align-items-center justify-content-center"
          >
            <CartIcon className="me-2" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
