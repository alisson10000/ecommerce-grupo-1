import React, { useEffect } from 'react';
import { CartItem } from '../../../src/types';
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon } from '../Icons/icons';

const API_BASE_URL = "http://localhost:8080";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onFinalizeSale: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onFinalizeSale,
}) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.preco ?? 0) * item.quantity,
    0
  );

  useEffect(() => {
    console.group("🛒 [CartSidebar] Atualização de Carrinho");
    console.log("📦 Itens:", cartItems.length);
    cartItems.forEach((item, i) => {
      console.log(`➡️ Item ${i + 1}:`, {
        id: item.id,
        nome: item.nome,
        preco: item.preco,
        qtd: item.quantity,
        totalItem: (item.preco ?? 0) * item.quantity,
      });
    });
    console.log("💰 Subtotal:", subtotal.toFixed(2));
    console.groupEnd();
  }, [cartItems, subtotal]);

  return (
    <div className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`} style={{visibility: isOpen ? 'visible' : 'hidden'}}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Carrinho</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="offcanvas-body">
        {cartItems.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="mb-3" style={{width: '4rem', height: '4rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="fs-5">Seu carrinho está vazio.</p>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => {
              const imageUrl = `${API_BASE_URL}/imagens/${item.id}.jpg`;
              const itemTotal = ((item.preco ?? 0) * item.quantity).toFixed(2);

              return (
                <div key={item.id} className="d-flex align-items-start gap-3 border-bottom pb-3 mb-3">
                  <img
                    src={imageUrl}
                    alt={item.nome}
                    className="rounded"
                    style={{width: '5rem', height: '5rem', objectFit: 'cover'}}
                    onError={(e) => {
                      console.error(`🚨 Erro ao carregar imagem ${item.id}`);
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                  <div className="flex-grow-1">
                    <p className="fw-semibold text-dark mb-1">{item.nome}</p>
                    <p className="text-muted small mb-2">R$ {(item.preco ?? 0).toFixed(2)}</p>

                    <div className="d-flex align-items-center">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-outline-secondary btn-sm rounded-circle me-2"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon />
                      </button>

                      <span className="px-3 fw-medium">{item.quantity}</span>

                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-outline-secondary btn-sm rounded-circle ms-2"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>

                  <div className="text-end">
                    <p className="fw-bold text-dark mb-1">R$ {itemTotal}</p>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 0)}
                      className="btn btn-link text-danger p-0"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="offcanvas-footer p-3 border-top bg-light">
          <div className="d-flex justify-content-between fs-5 fw-semibold text-dark mb-3">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={onFinalizeSale}
            className="btn btn-primary w-100"
          >
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
