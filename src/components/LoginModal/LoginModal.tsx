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
    <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} style={{backgroundColor: 'rgba(0,0,0,0.5)'}} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Login do Vendedor</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Digite seu usuário"
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Digite sua senha"
                />
              </div>

              {error && <p className="text-danger small text-center mb-3">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100"
              >
                {loading ? 'Entrando...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
