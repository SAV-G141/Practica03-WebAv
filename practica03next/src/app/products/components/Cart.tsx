"use client";

import React from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

interface CartProps {
  cartItems: Product[];
  onRemove: (id: number) => void;
}

export default function Cart({ cartItems, onRemove }: CartProps) {
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="fixed top-16 right-4 w-80 bg-gray-800 text-white rounded-lg shadow-lg p-4 z-50">
      <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-300">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 font-bold">Total: ${totalPrice.toFixed(2)}</div>
    </div>
  );
}
