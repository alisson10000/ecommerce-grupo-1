import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../../src/Layout/MainLayout";
import Home from "../../src/pages/Home/Index";
import PedidoPage from "../../src/pages/Pedido/Index";
import Categorias from "../pages/Categorias/Index";
import Clientes from "../pages/Clientes/Index";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pedido" element={<PedidoPage />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/clientes" element={<Clientes />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
