import React from 'react';
import { CartItem } from '../../../src/types';

import { CloseIcon, PlusIcon, MinusIcon, TrashIcon } from '../Icons/icons';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onFinalizeSale: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onFinalizeSale }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const animationClass = isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right';
  
  if (!isOpen && animationClass === 'animate-slide-out-right') {
     // Don't render if it's not open to allow animation out
     return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col ${animationClass}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full border hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity <= 0}>
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full border hover:bg-gray-100">
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                   <button onClick={() => onUpdateQuantity(item.id, 0)} className="text-red-500 hover:text-red-700 mt-2">
                     <TrashIcon className="w-5 h-5"/>
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-4 border-t space-y-4">
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={onFinalizeSale}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Finalize Sale
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
