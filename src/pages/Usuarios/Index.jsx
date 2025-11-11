import React, { useEffect, useState } from "react";
import api from "../../config/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    numero: "",
    complemento: "",
    enderecoId: "",
  });

  // 🔹 Carregar usuários ao montar
  useEffect(() => {
    listarUsuarios();
  }, []);

  const listarUsuarios = async () => {
    try {
      const resposta = await api.get("/usuarios");
      setUsuarios(resposta.data);
    } catch (erro) {
      console.error("❌ Erro ao buscar usuários:", erro);
    }
  };

  // 🔹 Salvar (adicionar ou atualizar)
  const salvarUsuario = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        senha: novoUsuario.senha,
        perfil: "ADMIN", // 🔹 fixo conforme solicitado
        numero: novoUsuario.numero,
        complemento: novoUsuario.complemento,
        enderecoId: Number(novoUsuario.enderecoId),
      };

      if (editando) {
        await api.put(`/usuarios/${editando.id}`, payload);
      } else {
        await api.post("/usuarios", payload);
      }

      listarUsuarios();
      cancelarEdicao();
    } catch (erro) {
      console.error("❌ Erro ao salvar usuário:", erro);
    }
  };

  // 🔹 Editar usuário
  const editarUsuario = (usuario) => {
    setEditando(usuario);
    setNovoUsuario({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      numero: usuario.numero || "",
      complemento: usuario.complemento || "",
      enderecoId: usuario.enderecoId || "",
    });
  };

  // 🔹 Excluir usuário
  const excluirUsuario = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return;

    try {
      await api.delete(`/usuarios/${id}`);
      listarUsuarios();
    } catch (erro) {
      console.error("❌ Erro ao excluir usuário:", erro);
    }
  };

  // 🔹 Cancelar edição
  const cancelarEdicao = () => {
    setEditando(null);
    setNovoUsuario({
      nome: "",
      email: "",
      senha: "",
      numero: "",
      complemento: "",
      enderecoId: "",
    });
  };

  // 🔹 Filtro de busca
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // 🔹 Interface
  return (
    <div
      className="d-flex justify-content-center align-items-start bg-light min-vh-100"
      style={{ paddingTop: "6rem" }}
    >
      <div
        className="card shadow-lg p-4 w-100"
        style={{ maxWidth: "950px", borderRadius: "16px" }}
      >
        {/* 🔹 Título */}
        <h2 className="text-center fw-bold mb-4 text-primary">
          {editando ? "Editar Usuário ADMIN" : "Cadastro de Usuário ADMIN"}
        </h2>

        {/* 🔹 Formulário */}
        <form onSubmit={salvarUsuario} className="row g-2 align-items-center mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nome"
              value={novoUsuario.nome}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="E-mail"
              value={novoUsuario.email}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
              value={novoUsuario.senha}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
              required={!editando}
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Número"
              value={novoUsuario.numero}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, numero: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Complemento"
              value={novoUsuario.complemento}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, complemento: e.target.value })
              }
            />
          </div>

          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Endereço ID"
              value={novoUsuario.enderecoId}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, enderecoId: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-12 d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {editando ? "💾 Salvar" : "➕ Cadastrar"}
            </button>
          </div>

          {editando && (
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={cancelarEdicao}
                className="btn btn-secondary btn-sm"
              >
                Cancelar
              </button>
            </div>
          )}
        </form>

        {/* 🔹 Campo de busca */}
        <div className="d-flex justify-content-center mb-3">
          <input
            type="text"
            className="form-control w-50 text-center"
            placeholder="Buscar usuário..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* 🔹 Tabela */}
        <div className="table-responsive">
          <table className="table table-hover text-center align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>{u.perfil}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editarUsuario(u)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => excluirUsuario(u.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-muted py-3">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
