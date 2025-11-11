import React from "react";
import { Routes, Route } from "react-router-dom";

// 🧩 Layout principal
import MainLayout from "../Layout/MainLayout";

// 🏠 Páginas
import Home from "../pages/Home/Index";
import PedidoPage from "../pages/Pedido/Index";
import CategoriasPage from "../pages/Categorias/Index";
import ClientesPage from "../pages/Clientes/Index";
import UsuariosPage from "../pages/Usuarios/Index"; // ✅ nova importação

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout principal engloba todas as rotas protegidas */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pedido" element={<PedidoPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} /> {/* ✅ nova rota */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
