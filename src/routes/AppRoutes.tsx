import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../../src/Layout/MainLayout';
import Home from '../../src/pages/Home/Index';
import PedidoPage from '../../src/pages/Pedido/Index';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pedido" element={<PedidoPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
