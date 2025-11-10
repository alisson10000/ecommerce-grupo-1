import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { PlusIcon, TrashIcon } from "../../components/Icons/icons";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    buscarCategorias();
  }, []);

  const buscarCategorias = async () => {
    try {
      const resposta = await api.get("/categorias");
      setCategorias(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar categorias:", erro);
    }
  };

  const criarCategoria = async () => {
    if (!nome.trim()) return;
    try {
      await api.post("/categorias", { nome });
      setNome("");
      buscarCategorias(); // recarrega lista
    } catch (erro) {
      console.error("Erro ao criar categoria:", erro);
    }
  };

  const deletarCategoria = async (id) => {
    try {
      await api.delete(`/categorias/${id}`);
      buscarCategorias();
    } catch (erro) {
      console.error("Erro ao deletar categoria:", erro);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="text-center mb-4 fw-bold text-primary">Gerenciar Categorias</h1>

          {/* Card para adicionar categoria */}
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
                  onKeyPress={(e) => e.key === 'Enter' && criarCategoria()}
                />
                <button
                  onClick={criarCategoria}
                  className="btn btn-primary d-flex align-items-center"
                  disabled={!nome.trim()}
                >
                  <PlusIcon className="me-2" style={{ width: '1rem', height: '1rem' }} />
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de categorias em grid */}
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
                      <TrashIcon className="me-1" style={{ width: '1rem', height: '1rem' }} />
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
        </div>
      </div>
    </div>
  );
}
