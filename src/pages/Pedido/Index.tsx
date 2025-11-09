import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';
import Header from '../../components/Header/Header';
import LoginModal from '../../components/LoginModal/LoginModal';
import CartSidebar from '../../components/CartSidebar/CartSidebar';
import { CartItem, User } from '../../types';

const PedidoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [itens, setItens] = useState<CartItem[]>([]);
  const [pagamento, setPagamento] = useState('dinheiro');
  const [observacao, setObservacao] = useState('');
  const [total, setTotal] = useState(0);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<any>(null);

  // mesmos modais e estados do Header
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  // quantidade de itens no carrinho (para o ícone do header)
  const [cartItemCount, setCartItemCount] = useState(0);

  // 🧭 Recupera o carrinho vindo da Home ou do localStorage
  useEffect(() => {
    console.log('📦 Verificando itens recebidos via navegação...', location.state);
    const itensRecebidos = (location.state as any)?.cart as CartItem[] | undefined;

    if (itensRecebidos && itensRecebidos.length > 0) {
      console.log('✅ Itens recebidos via navigate:', itensRecebidos);
      setItens(itensRecebidos);
      setCartItemCount(itensRecebidos.reduce((acc, i) => acc + i.quantity, 0));
      localStorage.setItem('cart', JSON.stringify(itensRecebidos));
    } else {
      const cartSalvo = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('🗃️ Itens carregados do localStorage:', cartSalvo);
      setItens(cartSalvo);
      setCartItemCount(cartSalvo.reduce((acc, i) => acc + i.quantity, 0));
    }
  }, [location.state]);

  // 💰 Recalcula total
  useEffect(() => {
    const calcTotal = itens.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(calcTotal);
  }, [itens]);

  // 👤 Verifica se o usuário está logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setCurrentUser({ name: decoded.sub || 'Vendedor' });
      } catch (err) {
        console.error('❌ Erro ao decodificar token:', err);
      }
    }
  }, []);

  // 🔐 Login bem-sucedido
  const handleLoginSuccess = (token: string) => {
    console.log('🟢 Login bem-sucedido no PedidoPage. Token recebido:', token);
    localStorage.setItem('token', token);
    try {
      const decoded: any = jwtDecode(token);
      setCurrentUser({ name: decoded.sub || 'Vendedor' });
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
    }
  };

  // 💾 Envia o pedido para o backend
  const handleConfirmarPedido = async () => {
    const vendedor = currentUser?.name || 'Vendedor';

    const pedido = {
      vendedor,
      itens,
      total,
      pagamento,
      observacao,
    };

    console.log('🟢 Enviando pedido:', pedido);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/pedidos', pedido, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Pedido confirmado:', response.data);
      setPedidoConfirmado(response.data);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('❌ Erro ao confirmar pedido:', error);
      alert('Erro ao enviar o pedido. Verifique o console.');
    }
  };

  // 🟩 Tela de sucesso do pedido
  if (pedidoConfirmado) {
    return (
      <div className="font-sans text-gray-900">
        <Header
          user={currentUser}
          onLoginClick={() => setLoginModalOpen(true)}
          onCartClick={() => setCartOpen(true)}
          onLogout={() => {
            setCurrentUser(null);
            localStorage.removeItem('token');
          }}
          cartItemCount={cartItemCount}
        />

        <div className="p-6 text-center mt-24">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Pedido realizado com sucesso!</h1>
          <p>Número do pedido: <strong>{pedidoConfirmado.id}</strong></p>
          <p>Total: R$ {pedidoConfirmado.total.toFixed(2)}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  // 🧾 Tela principal de pedido
  return (
    <div className="font-sans text-gray-900">
      <Header
        user={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onCartClick={() => setCartOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/'); // 👈 redireciona para Home
        }}
        cartItemCount={cartItemCount}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">Resumo do Pedido</h1>

        {itens.length === 0 ? (
          <p className="text-gray-500">Nenhum item no pedido.</p>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              {itens.map((item) => (
                <div key={item.id} className="flex justify-between border-b py-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="text-right font-bold text-xl mt-4">
                Total: R$ {total.toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <label className="block mb-2 font-semibold">Forma de Pagamento</label>
              <select
                value={pagamento}
                onChange={(e) => setPagamento(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
                <option value="pix">PIX</option>
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <label className="block mb-2 font-semibold">Observação</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="border p-2 rounded w-full"
                rows={3}
                placeholder="Observações do pedido..."
              />
            </div>

            <button
              onClick={handleConfirmarPedido}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700"
            >
              Confirmar Pedido
            </button>
          </>
        )}
      </main>

      {/* 🔹 Modais compatíveis com o Header */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
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
      />
    </div>
  );
};

export default PedidoPage;
