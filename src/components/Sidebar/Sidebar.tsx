import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface SidebarProps {
  onLogout: () => void;
  isVisible: boolean; // se false → não renderiza nada
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isVisible }) => {
  const location = useLocation();

  // 🚫 Não renderiza absolutamente nada se o usuário não estiver logado
  if (!isVisible) {
    console.log("🚫 [Sidebar] Usuário não logado — ocultando menu.");
    return null;
  }

  const menu = [
    { path: "/", label: "🏠 Início" },
    { path: "/categorias", label: "🗂️ Categorias" },
    { path: "/clientes", label: "👥 Clientes" },
    { path: "/pedido", label: "🧾 Pedidos" },
  ];

  useEffect(() => {
    console.log("📍 [Sidebar] Rota atual:", location.pathname);
  }, [location.pathname]);

  const handleLogoutClick = () => {
    console.warn("🚪 [Sidebar] Logout clicado");
    onLogout();
  };

  return (
    <>
      {/* 🔘 BOTÃO FIXO para abrir o menu lateral */}
      <button
        className="btn btn-primary position-fixed start-0 ms-3 shadow"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        style={{
          top: "80px", // logo abaixo do header fixo
          zIndex: 2000,
          fontWeight: "bold",
        }}
      >
        ☰ Menu
      </button>

      {/* 🧭 SIDEBAR Bootstrap Offcanvas */}
      <div
        className="offcanvas offcanvas-start text-bg-dark"
        tabIndex={-1}
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
        data-bs-scroll="true"
        style={{ width: "260px" }}
      >
        {/* 🔹 Cabeçalho */}
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title fw-bold" id="sidebarMenuLabel">
            Painel Administrativo
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Fechar"
          ></button>
        </div>

        {/* 🔹 Corpo */}
        <div className="offcanvas-body d-flex flex-column justify-content-between p-3">
          <nav>
            {menu.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`d-block py-2 px-3 rounded mb-2 fw-semibold ${
                    active
                      ? "bg-primary text-white"
                      : "text-light hover:bg-secondary"
                  }`}
                  style={{
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  data-bs-dismiss="offcanvas"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 🔹 Botão de logout */}
          <button
            onClick={handleLogoutClick}
            className="btn btn-danger w-100 mt-3"
            data-bs-dismiss="offcanvas"
          >
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
