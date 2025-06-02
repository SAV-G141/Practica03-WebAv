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
  const [useExternalApi, setUseExternalApi] = useState(false);

  const fetchProducts = async () => {
    try {
      if (useExternalApi) {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        // Adaptar datos externos al formato Product esperado
        const adaptedData = data.map((item: { id: number; title: string; description: string; price: number; image: string; }) => ({
          id: item.id,
          name: item.title,
          description: item.description,
          price: item.price,
          stock: 10, // FakeStoreAPI no tiene stock, asignamos un valor por defecto
          image_url: item.image,
        }));
        setProducts(adaptedData);
      } else {
        const res = await fetch("http://localhost:3001/products");
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [useExternalApi]);

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
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-indigo-400">Gestión de Productos</h1>
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setUseExternalApi(false)}
            className={`px-6 py-2 rounded-lg shadow-lg transition-colors ${!useExternalApi ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Productos Locales
          </button>
          <button
            onClick={() => setUseExternalApi(true)}
            className={`px-6 py-2 rounded-lg shadow-lg transition-colors ${useExternalApi ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Productos Externos
          </button>
        </div>
        {!showForm && !useExternalApi && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
            >
              Nuevo Producto
            </button>
          </div>
        )}
        {showForm && !useExternalApi && (
          <div className="max-w-3xl mx-auto mb-8">
            <ProductForm
              product={editingProduct}
              onCancel={handleFormClose}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
