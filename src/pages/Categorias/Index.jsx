import React, { useState, useEffect } from "react";
import api from "../../config/api";


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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Categorias</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nova categoria"
          className="border p-2 rounded w-64"
        />
        <button
          onClick={criarCategoria}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </div>

      <ul className="space-y-2">
        {categorias.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>{cat.nome}</span>
            <button
              onClick={() => deletarCategoria(cat.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
