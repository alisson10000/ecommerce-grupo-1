import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import LoginModal from "../../components/LoginModal/LoginModal";
import CartSidebar from "../../components/CartSidebar/CartSidebar";
import Footer from "../../components/Footer/Footer";
import { CartItem, User } from "../../types";
import { PlusIcon, MinusIcon, TrashIcon } from "../../components/Icons/icons";

const API_BASE_URL = "http://localhost:8080";

interface Cliente {
  id: number;
  nome: string;
}

const PedidoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 📦 Estados principais
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("");

  const [itens, setItens] = useState<CartItem[]>([]);
  const [pagamento, setPagamento] = useState("dinheiro");
  const [observacao, setObservacao] = useState("");
  const [total, setTotal] = useState(0);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<any>(null);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // 🧭 Recupera o carrinho
  useEffect(() => {
    const itensRecebidos = (location.state as any)?.cart as CartItem[] | undefined;
    if (itensRecebidos?.length) {
      setItens(itensRecebidos);
      localStorage.setItem("cart", JSON.stringify(itensRecebidos));
    } else {
      const cartSalvo = JSON.parse(localStorage.getItem("cart") || "[]");
      setItens(cartSalvo);
    }
  }, [location.state]);

  // 💰 Recalcula total e contador
  useEffect(() => {
    const totalCalc = itens.reduce((sum, item) => {
      const preco = item.preco ?? item.price ?? 0;
      return sum + preco * item.quantity;
    }, 0);
    setTotal(totalCalc);
    setCartItemCount(itens.reduce((sum, i) => sum + i.quantity, 0));
  }, [itens]);

  // 👤 Verifica login JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setCurrentUser({ name: decoded.sub || "Vendedor" });
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }
  }, []);

  // 🔄 Carrega lista de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get("/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  // 💾 Confirmar pedido
  const handleConfirmarPedido = async () => {
    if (!clienteSelecionado) {
      alert("Selecione um cliente antes de confirmar o pedido.");
      return;
    }

    const vendedor = currentUser?.name || "Vendedor";
    const itensFormatados = itens.map((item) => ({
      idProduto: item.id,
      nome: item.nome || item.name,
      preco: item.preco ?? item.price ?? 0,
      quantidade: item.quantity,
    }));

    const pedido = {
      vendedor,
      clienteId: parseInt(clienteSelecionado),
      itens: itensFormatados,
      total,
      pagamento,
      observacao,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/pedidos", pedido, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPedidoConfirmado(response.data);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Erro ao confirmar pedido:", error);
      alert("Erro ao enviar o pedido. Verifique o console.");
    }
  };

  // ✅ Tela de sucesso
  if (pedidoConfirmado) {
    return (
      <>
        <Header
          user={currentUser}
          onLoginClick={() => setLoginModalOpen(true)}
          onCartClick={() => setCartOpen(true)}
          onLogout={() => {
            setCurrentUser(null);
            localStorage.removeItem("token");
          }}
          cartItemCount={cartItemCount}
        />

        <div className="container text-center mt-5 pt-5">
          <div className="alert alert-success p-5 shadow-sm">
            <h2 className="fw-bold text-success mb-3">
              Pedido realizado com sucesso!
            </h2>
            <p>
              Número do pedido: <strong>{pedidoConfirmado.id}</strong>
            </p>
            <p>Total: R$ {pedidoConfirmado.total.toFixed(2)}</p>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary mt-3"
            >
              Voltar para o Início
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // 🧾 Tela principal
  return (
    <>
      <Header
        user={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onCartClick={() => setCartOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem("token");
          navigate("/");
        }}
        cartItemCount={cartItemCount}
      />

      <main className="container mt-5 pt-5 pb-5">
        <h1 className="fw-bold mb-4 text-primary">Resumo do Pedido</h1>

        {itens.length === 0 ? (
          <div className="alert alert-warning">Nenhum item no pedido.</div>
        ) : (
          <>
            {/* 🧍 Cliente */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <label className="form-label fw-semibold">Cliente</label>
                <select
                  className="form-select"
                  value={clienteSelecionado}
                  onChange={(e) => setClienteSelecionado(e.target.value)}
                  required
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 🛍️ Itens com controle de quantidade */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                {itens.map((item) => {
                  const precoItem = item.preco ?? item.price ?? 0;
                  const imageUrl = `${API_BASE_URL}/imagens/${item.id}.jpg`;

                  return (
                    <div
                      key={item.id}
                      className="d-flex align-items-center justify-content-between border-bottom py-3"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={imageUrl}
                          alt={item.nome}
                          className="me-3 rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.jpg";
                          }}
                        />
                        <div>
                          <div className="fw-semibold">{item.nome}</div>

                          <div className="d-flex align-items-center mt-2">
                            <button
                              className="btn btn-outline-secondary btn-sm rounded-circle me-2"
                              onClick={() =>
                                setItens((prev) =>
                                  prev.map((i) =>
                                    i.id === item.id && i.quantity > 1
                                      ? { ...i, quantity: i.quantity - 1 }
                                      : i
                                  )
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon />
                            </button>

                            <span className="fw-bold px-2">{item.quantity}</span>

                            <button
                              className="btn btn-outline-secondary btn-sm rounded-circle ms-2"
                              onClick={() =>
                                setItens((prev) =>
                                  prev.map((i) =>
                                    i.id === item.id
                                      ? { ...i, quantity: i.quantity + 1 }
                                      : i
                                  )
                                )
                              }
                            >
                              <PlusIcon />
                            </button>

                            <button
                              className="btn btn-link text-danger ms-3 p-0"
                              onClick={() =>
                                setItens((prev) =>
                                  prev.filter((i) => i.id !== item.id)
                                )
                              }
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-end fw-bold">
                        R$ {(precoItem * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}

                <div className="text-end fw-bold fs-5 mt-3">
                  Total: R$ {total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* 💳 Pagamento */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <label className="form-label fw-semibold">
                  Forma de Pagamento
                </label>
                <select
                  className="form-select"
                  value={pagamento}
                  onChange={(e) => setPagamento(e.target.value)}
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="pix">PIX</option>
                </select>
              </div>
            </div>

            {/* 📝 Observação */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <label className="form-label fw-semibold">Observação</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Observações do pedido..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </div>
            </div>

            {/* ✅ Botão Confirmar */}
            <div className="d-grid">
              <button
                className="btn btn-primary btn-lg fw-bold"
                onClick={handleConfirmarPedido}
              >
                Confirmar Pedido
              </button>
            </div>
          </>
        )}
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(token) => {
          localStorage.setItem("token", token);
          const decoded: any = jwtDecode(token);
          setCurrentUser({ name: decoded.sub || "Vendedor" });
        }}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={itens}
        onUpdateQuantity={(id, qty) =>
          setItens((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, quantity: qty } : item
            )
          )
        }
        onFinalizeSale={handleConfirmarPedido}
        onRequireLogin={() => setLoginModalOpen(true)}
      />

      <Footer />
    </>
  );
};

export default PedidoPage;
