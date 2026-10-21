import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  // Último producto agregado: lo muestra el aviso (CartToast) en vez de abrir el carrito.
  const [lastAdded, setLastAdded] = useState(null);

  function addItem(item) {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
    setLastAdded({ ...item, toastId: Date.now() });
  }

  function removeItem(variantId) {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }

  function updateQuantity(variantId, quantity) {
    setItems((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    total,
    count,
    isOpen,
    lastAdded,
    dismissAdded: () => setLastAdded(null),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return context;
}
