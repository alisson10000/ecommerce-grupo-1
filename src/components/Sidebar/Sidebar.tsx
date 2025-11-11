import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";

interface SidebarProps {
  onLogout: () => void;
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isVisible }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🧩 Inicializa o Offcanvas sempre que o componente estiver visível
  useEffect(() => {
    const offcanvasElement = document.getElementById("sidebarMenu");
    if (offcanvasElement) {
      bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    }
  }, [isVisible]);

  // 🚫 Oculta o menu se o usuário não estiver logado
  if (!isVisible) return null;

  // 🧭 Itens do menu
  const menu = [
    { path: "/", label: "🏠 Início" },
    { path: "/categorias", label: "🗂️ Categorias" },
    { path: "/clientes", label: "👥 Clientes" },
    { path: "/usuarios", label: "👤 Usuários" }, // ✅ novo item
    { path: "/pedido", label: "🧾 Pedidos" },
  ];

  // 🚪 Logout (fecha menu e executa logout com segurança)
  const handleLogoutClick = () => {
    const confirmed = window.confirm("Deseja realmente sair?");
    if (!confirmed) return;

    // Fecha o offcanvas se estiver aberto
    const offcanvasEl = document.getElementById("sidebarMenu");
    const bsOffcanvas = offcanvasEl
      ? bootstrap.Offcanvas.getInstance(offcanvasEl)
      : null;

    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }

    // Aguarda fechamento e executa logout
    setTimeout(() => {
      onLogout();
    }, 250);
  };

  // ✅ Fecha o menu e navega com delay suave
  const handleLinkClick = (path: string) => {
    const offcanvasEl = document.getElementById("sidebarMenu");
    const bsOffcanvas = offcanvasEl
      ? bootstrap.Offcanvas.getInstance(offcanvasEl)
      : null;

    if (bsOffcanvas) {
      bsOffcanvas.hide();
      // espera a animação terminar antes de trocar de rota
      setTimeout(() => {
        navigate(path);
      }, 250);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* BOTÃO FIXO */}
      <button
        className="btn btn-primary position-fixed start-0 ms-3 shadow"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        style={{
          top: "75px",
          zIndex: 2000,
          fontWeight: "bold",
        }}
      >
        ☰ Menu
      </button>

      {/* OFFCANVAS */}
      <div
        className="offcanvas offcanvas-start text-bg-dark"
        tabIndex={-1}
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
        data-bs-scroll="true"
        style={{ width: "260px" }}
      >
        {/* Cabeçalho */}
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

        {/* Corpo */}
        <div className="offcanvas-body d-flex flex-column justify-content-between p-3">
          <nav>
            {menu.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`d-block py-2 px-3 rounded mb-2 fw-semibold ${
                    active ? "bg-primary text-white" : "text-light"
                  }`}
                  style={{
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault(); // evita navegação direta
                    handleLinkClick(item.path);
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* BOTÃO SAIR */}
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
