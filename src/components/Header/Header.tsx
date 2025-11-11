import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../../src/types";
import { CartIcon, UserIcon } from "../Icons/icons";
import { useTheme } from "../../ThemeContext";
import * as bootstrap from "bootstrap";

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onCartClick: () => void;
  onLogout: () => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLoginClick,
  onCartClick,
  onLogout,
  cartItemCount,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 🚪 Função local de logout (igual ao Sidebar)
  const handleLogoutClick = () => {
  const confirmed = window.confirm("Deseja realmente sair?");
  if (!confirmed) return;

  console.log("🧩 [Header] Logout confirmado → fechando Offcanvas e limpando sessão...");

  // ✅ Fecha o Offcanvas imediatamente se estiver aberto
  const offcanvasEl = document.getElementById("sidebarMenu");
  if (offcanvasEl) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
  }

  // ✅ Agora dispara o logout global (limpa token, carrinho, usuário)
  onLogout();

  // ✅ Redireciona após um leve atraso (tempo da animação)
  setTimeout(() => {
    navigate("/", { replace: true });
  }, 250);
};

  return (
    <header
      className={`position-fixed top-0 start-0 end-0 shadow-sm ${
        isDark ? "bg-dark text-light" : "bg-white text-dark"
      }`}
      style={{
        height: "4rem",
        backdropFilter: "blur(6px)",
        zIndex: 1050,
      }}
    >
      <div className="container-fluid px-3 px-sm-4 px-lg-5 h-100">
        <div className="d-flex align-items-center justify-content-between h-100">
          {/* LOGO */}
          <div className="fs-5 fw-bold">
            <span
              onClick={() => navigate("/")}
              className={`text-decoration-none ${
                isDark ? "text-light" : "text-dark"
              }`}
              style={{ cursor: "pointer" }}
            >
              Serratec E-Commerce
            </span>
          </div>

          {/* AÇÕES */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-secondary d-none d-sm-block">
                  Olá, {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="btn btn-link text-secondary text-decoration-none p-0"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-2 p-0"
              >
                <UserIcon />
                <span>Login</span>
              </button>
            )}

            {/* MODO CLARO/ESCURO */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-link text-secondary text-decoration-none p-0"
              title={isDark ? "Modo claro" : "Modo escuro"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* CARRINHO */}
            <button
              type="button"
              onClick={onCartClick}
              className="btn btn-link text-secondary text-decoration-none position-relative p-0"
              title="Abrir carrinho"
            >
              <CartIcon />
              {cartItemCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
