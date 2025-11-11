import React, { useState, useEffect } from "react";
import api from "../../config/api";


export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = async () => {
    try {
      const resposta = await api.get("/clientes");
      setClientes(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar clientes:", erro);
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>

      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="border p-2 rounded mb-4 w-64"
      />

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.nome}</td>
              <td className="border p-2">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
