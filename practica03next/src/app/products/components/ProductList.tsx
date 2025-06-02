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

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductList({ products, onEdit, onDelete, onAddToCart }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <img
            src={product.image_url && product.image_url.startsWith('http') ? product.image_url : 'https://via.placeholder.com/150'}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md mb-3"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
          />
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="font-medium text-gray-700 mb-1">Precio: ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
          <p className="font-medium text-gray-700 mb-3">Stock: {product.stock}</p>
          <div className="flex justify-between flex-wrap gap-2">
            <button
              onClick={() => onEdit(product)}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
