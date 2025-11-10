import React from 'react';
import { User } from '../../../src/types';
import { CartIcon, UserIcon } from '../Icons/icons';
import { useTheme } from '../../ThemeContext';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onCartClick: () => void;
  onLogout: () => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onCartClick, onLogout, cartItemCount }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="position-fixed top-0 start-0 end-0 bg-white bg-opacity-75 shadow z-3" style={{backdropFilter: 'blur(4px)'}}>
      <div className="container-fluid px-3 px-sm-4 px-lg-5">
        <div className="d-flex align-items-center justify-content-between" style={{height: '4rem'}}>
          <div className="fs-4 fw-bold text-dark">
            <a href="#" className="text-decoration-none">Serratec E-Commerce</a>
          </div>
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-secondary d-none d-sm-block">Welcome, {user.name}</span>
                <button
                  onClick={onLogout}
                  className="btn btn-link text-secondary text-decoration-none p-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-2 p-0"
              >
                <UserIcon className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
            <div className="vr"></div>
            <button onClick={toggleTheme} className="btn btn-link text-secondary text-decoration-none p-0">
              {isDark ? '☀️' : '🌙'}
            </button>
            <button onClick={onCartClick} className="btn btn-link text-secondary text-decoration-none position-relative p-0">
              <CartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.75rem'}}>
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
