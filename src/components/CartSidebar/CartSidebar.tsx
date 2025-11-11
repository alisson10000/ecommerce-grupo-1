import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../../../src/types";
import { PlusIcon, MinusIcon, TrashIcon } from "../Icons/icons";
import { useTheme } from "../../ThemeContext";

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
  onRequireLogin,
}) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.preco ?? 0) * item.quantity,
    0
  );

  // 🧭 Finalizar compra (com verificação de login)
  const handleFinalize = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("⚠️ Faça login para finalizar a compra.");
      onClose();           // fecha o carrinho
      onRequireLogin();    // abre o modal de login
      return;
    }

    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    navigate("/pedido", { state: { cart: cartItems } });
    onClose();
  };

  useEffect(() => {
    console.group("🛒 [CartSidebar]");
    console.log("Itens:", cartItems);
    console.log("Subtotal:", subtotal.toFixed(2));
    console.groupEnd();
  }, [cartItems, subtotal]);

  return (
    <div
      className={`offcanvas offcanvas-end ${isDark ? "bg-dark text-light" : "bg-white text-dark"
        } ${isOpen ? "show" : ""}`}
      style={{
        visibility: isOpen ? "visible" : "hidden",
        width: "350px",
        transition: "0.3s ease",
      }}
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title fw-semibold">Carrinho</h5>
        <button
          type="button"
          className={`btn-close ${isDark ? "btn-close-white" : ""}`}
          onClick={onClose}
        ></button>
      </div>

      <div className="offcanvas-body">
        {cartItems.length === 0 ? (
          <div className="text-center mt-5 text-muted">
            <p className="fs-6">Seu carrinho está vazio.</p>
          </div>
        ) : (
          cartItems.map((item) => {
            const imageUrl = `${API_BASE_URL}/imagens/${item.id}.jpg`;
            const itemTotal = ((item.preco ?? 0) * item.quantity).toFixed(2);

            return (
              <div
                key={item.id}
                className="d-flex align-items-start gap-3 border-bottom pb-3 mb-3"
              >
                <img
                  src={imageUrl}
                  alt={item.nome}
                  className="rounded"
                  style={{
                    width: "4.5rem",
                    height: "4.5rem",
                    objectFit: "cover",
                  }}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/placeholder.jpg")
                  }
                />

                <div className="flex-grow-1">
                  <p className="fw-semibold mb-1">{item.nome}</p>
                  <p className="small mb-2 text-muted">
                    R$ {(item.preco ?? 0).toFixed(2)}
                  </p>

                  <div className="d-flex align-items-center">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="btn btn-outline-secondary btn-sm rounded-circle me-2"
                      disabled={item.quantity <= 1}
                    >
                      <MinusIcon />
                    </button>

                    <span className="px-2 fw-medium">{item.quantity}</span>

                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="btn btn-outline-secondary btn-sm rounded-circle ms-2"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>

                <div className="text-end">
                  <p className="fw-bold mb-1">R$ {itemTotal}</p>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 0)}
                    className="btn btn-link text-danger p-0"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {cartItems.length > 0 && (
        <div
          className={`offcanvas-footer p-3 border-top ${isDark ? "bg-dark" : "bg-light"
            }`}
        >
          <div className="d-flex justify-content-between fs-6 fw-semibold mb-3">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>

          <button onClick={handleFinalize} className="btn btn-primary w-100">
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
