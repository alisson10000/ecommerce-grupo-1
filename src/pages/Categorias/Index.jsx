import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import LoginModal from "../../components/LoginModal/LoginModal";
import CartSidebar from "../../components/CartSidebar/CartSidebar";
import { PlusIcon, TrashIcon } from "../../components/Icons/icons";
import { jwtDecode } from "jwt-decode";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  // 🔹 Buscar token e carrinho ao montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser({ name: decoded.sub || "Usuário" });
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // 🔹 Sincroniza carrinho com localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔹 Buscar categorias
  const buscarCategorias = async () => {
    try {
      const resposta = await api.get("/categorias");
      setCategorias(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar categorias:", erro);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  // 🔹 Criar nova categoria
  const criarCategoria = async () => {
    if (!nome.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/categorias",
        { nome },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNome("");
      buscarCategorias();
    } catch (erro) {
      console.error("Erro ao criar categoria:", erro);
      alert("Erro ao criar categoria. Faça login novamente.");
    }
  };

  // 🔹 Deletar categoria
  const deletarCategoria = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta categoria?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      buscarCategorias();
    } catch (erro) {
      console.error("Erro ao deletar categoria:", erro);
      alert("Erro ao excluir categoria. Verifique o console.");
    }
  };

  // 🔹 Finalizar compra (padrão do projeto)
  const handleFinalizeSale = () => {
    if (!currentUser) {
      setCartOpen(false);
      setLoginModalOpen(true);
      return;
    }
  };

  // 🧮 Contagem do carrinho
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header
        user={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onCartClick={() => setCartOpen(true)}
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("cart");
          setCart([]);
          setCurrentUser(null);
        }}
        cartItemCount={cartItemCount}
      />

      <main className="container mt-5 pt-5 pb-5">
        <h1 className="text-center mb-4 fw-bold text-primary">
          Gerenciar Categorias
        </h1>

        {/* Adicionar categoria */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Adicionar Nova Categoria</h5>
            <div className="input-group">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da categoria"
                className="form-control"
                onKeyPress={(e) => e.key === "Enter" && criarCategoria()}
              />
              <button
                onClick={criarCategoria}
                className="btn btn-primary d-flex align-items-center"
                disabled={!nome.trim()}
              >
                <PlusIcon
                  className="me-2"
                  style={{ width: "1rem", height: "1rem" }}
                />
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de categorias */}
        <div className="row">
          {categorias.map((cat) => (
            <div key={cat.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title text-truncate">{cat.nome}</h5>
                  <button
                    onClick={() => deletarCategoria(cat.id)}
                    className="btn btn-outline-danger btn-sm mt-2 d-flex align-items-center justify-content-center"
                  >
                    <TrashIcon
                      className="me-1"
                      style={{ width: "1rem", height: "1rem" }}
                    />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categorias.length === 0 && (
          <div className="text-center text-muted mt-4">
            <p>Nenhuma categoria cadastrada ainda.</p>
          </div>
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(token) => {
          localStorage.setItem("token", token);
          const decoded = jwtDecode(token);
          setCurrentUser({ name: decoded.sub || "Usuário" });
        }}
      />

      {/* Sidebar Carrinho */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={(id, qty) =>
          setCart((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, quantity: qty } : item
            )
          )
        }
        onFinalizeSale={handleFinalizeSale}
        onRequireLogin={() => setLoginModalOpen(true)}
      />

      <Footer />
    </>
  );
};

export default Categorias;
