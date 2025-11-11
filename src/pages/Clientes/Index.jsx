import React, { useState, useEffect } from "react";
import api from "../../config/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    numero: "",
    complemento: "",
    endereco: {
      id: "",
      logradouro: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
  });

  // 🔹 Carregar clientes na montagem
  useEffect(() => {
    listarClientes();
  }, []);

  const listarClientes = async () => {
    try {
      const resposta = await api.get("/clientes");
      setClientes(resposta.data);
    } catch (erro) {
      console.error("❌ Erro ao buscar clientes:", erro);
    }
  };

  // 🔹 Salvar (adicionar ou atualizar)
  const salvarCliente = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nome: novoCliente.nome,
        email: novoCliente.email,
        cpf: novoCliente.cpf,
        telefone: novoCliente.telefone,
        numero: novoCliente.numero,
        complemento: novoCliente.complemento,
        endereco: {
          id: Number(novoCliente.endereco.id),
          logradouro: novoCliente.endereco.logradouro,
          bairro: novoCliente.endereco.bairro,
          cidade: novoCliente.endereco.cidade,
          uf: novoCliente.endereco.uf,
          cep: novoCliente.endereco.cep,
        },
      };

      if (editando) {
        await api.put(`/clientes/${editando.id}`, payload);
      } else {
        await api.post("/clientes", payload);
      }

      listarClientes();
      cancelarEdicao();
    } catch (erro) {
      console.error("❌ Erro ao salvar cliente:", erro);
    }
  };

  // 🔹 Editar cliente
  const editarCliente = (cliente) => {
    setEditando(cliente);
    setNovoCliente({
      nome: cliente.nome,
      email: cliente.email,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      numero: cliente.numero,
      complemento: cliente.complemento,
      endereco: {
        id: cliente.endereco?.id || "",
        logradouro: cliente.endereco?.logradouro || "",
        bairro: cliente.endereco?.bairro || "",
        cidade: cliente.endereco?.cidade || "",
        uf: cliente.endereco?.uf || "",
        cep: cliente.endereco?.cep || "",
      },
    });
  };

  // 🔹 Cancelar edição
  const cancelarEdicao = () => {
    setEditando(null);
    setNovoCliente({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      numero: "",
      complemento: "",
      endereco: {
        id: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
      },
    });
  };

  // 🔹 Filtro de busca
  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // 🔹 Interface
  return (
    <div
      className="d-flex justify-content-center align-items-start bg-light min-vh-100"
      style={{ paddingTop: "6rem" }}
    >
      <div
        className="card shadow-lg p-4 w-100"
        style={{ maxWidth: "1000px", borderRadius: "16px" }}
      >
        {/* 🔹 Título */}
        <h2 className="text-center fw-bold mb-4 text-primary">
          {editando ? "Editar Cliente" : "Cadastro de Clientes"}
        </h2>

        {/* 🔹 Formulário */}
        <form onSubmit={salvarCliente} className="row g-2 mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nome"
              value={novoCliente.nome}
              onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="E-mail"
              value={novoCliente.email}
              onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="CPF"
              value={novoCliente.cpf}
              onChange={(e) => setNovoCliente({ ...novoCliente, cpf: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Telefone"
              value={novoCliente.telefone}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, telefone: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Número"
              value={novoCliente.numero}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, numero: e.target.value })
              }
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Complemento"
              value={novoCliente.complemento}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, complemento: e.target.value })
              }
            />
          </div>

          {/* 🔹 Endereço */}
          <h5 className="fw-bold mt-3 text-secondary">Endereço</h5>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="ID"
              value={novoCliente.endereco.id}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, id: e.target.value },
                })
              }
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Logradouro"
              value={novoCliente.endereco.logradouro}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, logradouro: e.target.value },
                })
              }
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Bairro"
              value={novoCliente.endereco.bairro}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, bairro: e.target.value },
                })
              }
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cidade"
              value={novoCliente.endereco.cidade}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, cidade: e.target.value },
                })
              }
            />
          </div>

          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="UF"
              value={novoCliente.endereco.uf}
              maxLength={2}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, uf: e.target.value },
                })
              }
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="CEP"
              value={novoCliente.endereco.cep}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, cep: e.target.value },
                })
              }
            />
          </div>

          <div className="col-md-12 d-flex justify-content-end mt-3">
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

        {/* 🔹 Busca */}
        <div className="d-flex justify-content-center mb-3">
          <input
            type="text"
            className="form-control w-50 text-center"
            placeholder="Buscar cliente..."
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
                <th>CPF</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nome}</td>
                    <td>{c.email}</td>
                    <td>{c.cpf}</td>
                    <td>{c.telefone}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => editarCliente(c)}
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-muted py-3">
                    Nenhum cliente encontrado.
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
