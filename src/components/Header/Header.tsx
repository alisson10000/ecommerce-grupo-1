import React from "react";
import { User } from "../../../src/types";
import { CartIcon, UserIcon } from "../Icons/icons";
import { useTheme } from "../../ThemeContext";

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
            <a
              href="/"
              className={`text-decoration-none ${
                isDark ? "text-light" : "text-dark"
              }`}
            >
              Serratec E-Commerce
            </a>
          </div>

          {/* AÇÕES */}
          <div className="d-flex align-items-center gap-3">
            {/* BOTÃO DE LOGIN OU SAUDAÇÃO */}
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-secondary d-none d-sm-block">
                  Olá, {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="btn btn-link text-secondary text-decoration-none p-0"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-2 p-0"
              >
                <UserIcon />
                <span>Login</span>
              </button>
            )}

            {/* MODO CLARO/ESCURO */}
            <button
              onClick={toggleTheme}
              className="btn btn-link text-secondary text-decoration-none p-0"
              title={isDark ? "Modo claro" : "Modo escuro"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* CARRINHO */}
            <button
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
