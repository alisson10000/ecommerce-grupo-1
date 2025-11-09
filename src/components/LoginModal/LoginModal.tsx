import React, { useState } from 'react';
import axios from 'axios';
import { CloseIcon } from '../Icons/icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void; // 🔹 Callback correta
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🟢 Iniciando login...');
    console.log('📩 Enviando para backend:', {
      username: username.trim(),
      password: '[OCULTO]',
    });

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username: username.trim(),
        password: password.trim(),
      });

      console.log('✅ Resposta recebida do backend:', response);
      console.log('📦 Dados retornados:', response.data);

      // 💡 compatível com backend que retorna { token, type, user }
      const token = response.data.token || response.data;

      if (token) {
        console.log('🔐 Token JWT recebido:', token);

        // Salva o token localmente
        localStorage.setItem('token', token);

        // Informa ao componente pai que o login foi bem-sucedido
        console.log('📤 Chamando onLoginSuccess no componente pai...');
        onLoginSuccess(token);

        // Fecha o modal
        onClose();
      } else {
        console.warn('⚠️ Nenhum token retornado pelo servidor.');
        throw new Error('Token JWT não retornado pelo servidor.');
      }
    } catch (err: any) {
      console.error('❌ Erro durante o login:', err);

      if (err.response) {
        console.log('📨 Resposta de erro do backend:', err.response);
        setError(err.response.data.message || 'Usuário ou senha inválidos.');
      } else if (err.request) {
        console.log('📭 Nenhuma resposta recebida (erro de rede ou CORS).');
        setError('Servidor não respondeu. Verifique se o backend está rodando.');
      } else {
        console.log('💥 Erro inesperado ao configurar requisição.');
        setError('Erro ao tentar fazer login.');
      }
    } finally {
      console.log('🔚 Finalizando tentativa de login.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login do Vendedor</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite seu usuário"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite sua senha"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? 'Entrando...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
