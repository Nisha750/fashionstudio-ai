import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = { id: string; size: string; qty: number };

type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  addToCart: (id: string, size?: string, qty?: number) => void;
  setQty: (id: string, size: string, qty: number) => void;
  removeLine: (id: string, size: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  cartCount: number;
  ready: boolean;
};

const StoreContext = createContext<StoreValue | null>(null);

const CART_KEY = "vera.cart";
const WISH_KEY = "vera.wishlist";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(read<CartLine[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const addToCart = useCallback((id: string, size = "M", qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === id && l.size === size);
      if (found) return prev.map((l) => (l === found ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, size, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, size: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.id === id && l.size === size))
        : prev.map((l) => (l.id === id && l.size === size ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((id: string, size: string) => {
    setCart((prev) => prev.filter((l) => !(l.id === id && l.size === size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      wishlist,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      toggleWishlist,
      inWishlist: (id: string) => wishlist.includes(id),
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      ready,
    }),
    [cart, wishlist, addToCart, setQty, removeLine, clearCart, toggleWishlist, ready],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
