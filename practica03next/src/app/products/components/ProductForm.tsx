"use client";

import React, { useState, useEffect } from "react";

interface ProductFormProps {
  product: {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
  } | null;
  onSubmit: (product: Omit<ProductFormProps["product"], "id">, id?: number) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
      setImageUrl(product.image_url);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
      setImageUrl("");
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        name,
        description,
        price,
        stock,
        image_url: imageUrl,
      },
      product?.id
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border border-gray-700 p-6 rounded-lg shadow-sm bg-gray-800 text-gray-100">
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-indigo-400">Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-indigo-400">Descripción:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-indigo-400">Precio:</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
          className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-indigo-400">Stock:</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
          required
          className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-indigo-400">URL de la imagen:</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          Guardar
        </button>
        <button type="button" onClick={onCancel} className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
