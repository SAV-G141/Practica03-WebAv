"use client";

import React, { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleFormClose = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (product: Omit<Product, "id">, id?: number) => {
    try {
      if (id) {
        // Update
        const res = await fetch(`http://localhost:3001/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
        const updatedProduct = await res.json();
        setProducts(
          products.map((p) => (p.id === id ? updatedProduct : p))
        );
      } else {
        // Create
        const res = await fetch("http://localhost:3001/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
      }
      handleFormClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Gestión de Productos</h1>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Nuevo Producto
        </button>
      )}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onCancel={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
