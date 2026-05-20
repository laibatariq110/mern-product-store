import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    const productToCreate = {
      name: newProduct.name.trim(),
      price: newProduct.price,
      image: newProduct.image.trim(),
    };

    if (
      !productToCreate.name ||
      !productToCreate.image ||
      !productToCreate.price
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productToCreate),
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.data) {
      return {
        success: false,
        message: data.message || "Failed to create product.",
      };
    }

    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully." };
  },
  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (!res.ok || !data.success || !Array.isArray(data.data)) {
      set({ products: [] });
      return { success: false, message: data.message || "Failed to load products." };
    }

    set({ products: data.data });
    return { success: true };
  },
  deleteProducts: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));
    return { success: true, message: data.message };
  },
  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }
    set((state) => ({
      products: state.products.map((product) =>
        product._id === pid ? data.data : product,
      ),
    }));
    return { success: true, message: data.message };
  },
}));
