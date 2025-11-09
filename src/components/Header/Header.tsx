import React from 'react';
import { User } from '../../../src/types';
import { CartIcon, UserIcon } from '../Icons/icons';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onCartClick: () => void;
  onLogout: () => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onCartClick, onLogout, cartItemCount }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-gray-800">
            <a href="#">Serratec E-Commerce</a>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 hidden sm:block">Welcome, {user.name}</span>
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
            <div className="h-6 w-px bg-gray-300"></div>
            <button onClick={onCartClick} className="relative text-gray-700 hover:text-indigo-600 transition-colors">
              <CartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
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
