import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../../src/Layout/MainLayout";
import Home from "../../src/pages/Home/Index";
import PedidoPage from "../../src/pages/Pedido/Index";

const AppRoutes = () => {
  return (
    <Routes>
      {/* O MainLayout é o “casco” que envolve todas as páginas */}
      <Route path="/" element={<MainLayout />}>
        {/* 👇 Rota raiz ("/") */}
        <Route index element={<Home />} />

        {/* 👇 Outras rotas dentro do layout */}
        <Route path="pedido" element={<PedidoPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
