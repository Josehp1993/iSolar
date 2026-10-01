'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stock: number;
  imagen_url?: string;
  marca?: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  iva: number;
  total: number;
  addItem: (item: Omit<CartItem, 'cantidad'>, qty?: number) => void;
  updateQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'isolar_cart';

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveCart(items: CartItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  window.dispatchEvent(new Event('cart-updated'));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
    const handler = () => setItems(loadCart());
    window.addEventListener('storage', handler);
    window.addEventListener('cart-updated', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('cart-updated', handler);
    };
  }, []);

  const persist = useCallback((updated: CartItem[]) => {
    setItems(updated);
    saveCart(updated);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'cantidad'>, qty = 1) => {
    const current = loadCart();
    const existing = current.find(i => i.id === item.id);
    if (existing) {
      existing.cantidad = Math.min(existing.stock, existing.cantidad + qty);
      persist(current);
    } else {
      persist([...current, { ...item, cantidad: Math.min(item.stock, qty) }]);
    }
  }, [persist]);

  const updateQty = useCallback((id: number, qty: number) => {
    const current = loadCart();
    persist(current.map(i => i.id === id ? { ...i, cantidad: Math.max(1, Math.min(i.stock, qty)) } : i));
  }, [persist]);

  const removeItem = useCallback((id: number) => {
    persist(loadCart().filter(i => i.id !== id));
  }, [persist]);

  const clear = useCallback(() => {
    persist([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, [persist]);

  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;
  const count = items.reduce((s, i) => s + i.cantidad, 0);

  if (!mounted) {
    return <CartContext.Provider value={{ items: [], count: 0, subtotal: 0, iva: 0, total: 0, addItem, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>;
  }

  return (
    <CartContext.Provider value={{ items, count, subtotal, iva, total, addItem, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
