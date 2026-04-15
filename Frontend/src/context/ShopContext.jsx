import React, { createContext, useState, useRef, useEffect } from "react";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { useAuth } from "./AuthContext";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  return {};
};

const getDefaultCheckedItems = () => {
  return {};
};

const ShopContextProvider = (props) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [checkedItems, setCheckedItems] = useState(getDefaultCheckedItems());
  const [cartOrder, setCartOrder] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const actionLockRef = useRef({});

  // Load products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const res = await fetchWithRetry("/api/products");
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Unexpected server response");
        }
        const data = await res.json();
        setAllProducts(data.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProductsError(err.message || "Failed to load products");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load cart from backend when user logs in.
  // IMPORTANT: only clear the cart when we KNOW auth is done (authLoading=false)
  // and the user is definitely logged out. Without this guard, the cart clears
  // on every page load for ~1-8s while the auth/me retry is in-flight, making
  // it appear as if the cart is empty until a second refresh.
  useEffect(() => {
    if (authLoading) return; // Wait until auth resolves before touching the cart
    if (user) {
      loadCart();
    } else {
      // Only clear when auth is finished and confirmed no user (logged out)
      setCartItems(getDefaultCart());
      setCheckedItems(getDefaultCheckedItems());
      setCartOrder([]);
    }
  }, [user, authLoading]);

  const loadCart = async () => {
    try {
      setLoading(true);
      // Use fetchWithRetry so Render cold-start 502s are retried instead of
      // silently failing and leaving the cart empty after a successful auth.
      const res = await fetchWithRetry("/api/cart/", {
        credentials: "include",
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return; // guard non-JSON
        const cart = await res.json();
        // Convert backend cart format to frontend format
        const items = {};
        const checks = {};

        cart.items.forEach(item => {
          const cartItemId = `${item.productId}-${item.storage}-${item.color}`;
          items[cartItemId] = item;
          checks[cartItemId] = cart.checkedItems[cartItemId] || false;
        });

        setCartItems(items);
        setCheckedItems(checks);
        setCartOrder(cart.cartOrder || []);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToBackend = async (updatedCart, updatedChecks, updatedOrder) => {
    if (!user) return;

    try {
      // For now, we'll just reload the cart from backend
      // In a real app, you might want to send the full cart state
      await loadCart();
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  };

  // Unique key for a specific product + storage + color combo
  const generateCartItemId = (
    productId,
    storage = "64GB",
    color = "Default",
  ) => {
    return `${productId}-${storage}-${color}`;
  };

  const addToCart = async (productId, storage = "64GB", color = "Default", quantityToAdd = 1) => {
    if (!user) return;

    const cartItemId = generateCartItemId(productId, storage, color);

    if (actionLockRef.current[cartItemId]) return;
    actionLockRef.current[cartItemId] = true;

    // --- Optimistic update ---
    const prevCartItems = cartItems;
    const prevCheckedItems = checkedItems;
    const prevCartOrder = cartOrder;

    setCartItems((prev) => {
      const existing = prev[cartItemId];
      return {
        ...prev,
        [cartItemId]: existing
          ? { ...existing, quantity: existing.quantity + quantityToAdd }
          : { productId, storage, color, quantity: quantityToAdd },
      };
    });
    setCartOrder((prev) =>
      prev.includes(cartItemId) ? prev : [...prev, cartItemId],
    );
    // --------------------------

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, storage, color, quantity: quantityToAdd }),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        const items = {};
        const checks = {};
        updatedCart.items.forEach((item) => {
          const id = `${item.productId}-${item.storage}-${item.color}`;
          items[id] = item;
          checks[id] = updatedCart.checkedItems[id] || false;
        });
        setCartItems(items);
        setCheckedItems(checks);
        setCartOrder(updatedCart.cartOrder || []);
      } else {
        // Revert on server error
        setCartItems(prevCartItems);
        setCheckedItems(prevCheckedItems);
        setCartOrder(prevCartOrder);
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setCartItems(prevCartItems);
      setCheckedItems(prevCheckedItems);
      setCartOrder(prevCartOrder);
    } finally {
      setTimeout(() => {
        actionLockRef.current[cartItemId] = false;
      }, 100);
    }
  };

  const getItemTotalQuantity = (productId) => {
    let total = 0;
    Object.values(cartItems).forEach((item) => {
      if (item.productId === productId) total += item.quantity;
    });
    return total;
  };

  const removeOneFromCart = async (cartItemId) => {
    if (!user) return;

    if (actionLockRef.current[cartItemId]) return;
    actionLockRef.current[cartItemId] = true;

    // --- Optimistic update ---
    const prevCartItems = cartItems;
    const prevCheckedItems = checkedItems;
    const prevCartOrder = cartOrder;

    setCartItems((prev) => {
      const existing = prev[cartItemId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        // Will be removed — optimistically drop it
        const next = { ...prev };
        delete next[cartItemId];
        return next;
      }
      return { ...prev, [cartItemId]: { ...existing, quantity: existing.quantity - 1 } };
    });
    setCartOrder((prev) => {
      const item = prevCartItems[cartItemId];
      if (item && item.quantity <= 1) return prev.filter((id) => id !== cartItemId);
      return prev;
    });
    // --------------------------

    try {
      const [productId, storage, color] = cartItemId.split('-');

      const res = await fetch("/api/cart/remove-one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, storage, color }),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        const items = {};
        const checks = {};
        updatedCart.items.forEach((item) => {
          const id = `${item.productId}-${item.storage}-${item.color}`;
          items[id] = item;
          checks[id] = updatedCart.checkedItems[id] || false;
        });
        setCartItems(items);
        setCheckedItems(checks);
        setCartOrder(updatedCart.cartOrder || []);
      } else {
        setCartItems(prevCartItems);
        setCheckedItems(prevCheckedItems);
        setCartOrder(prevCartOrder);
      }
    } catch (err) {
      console.error("Failed to remove one from cart:", err);
      setCartItems(prevCartItems);
      setCheckedItems(prevCheckedItems);
      setCartOrder(prevCartOrder);
    } finally {
      setTimeout(() => {
        actionLockRef.current[cartItemId] = false;
      }, 100);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return;

    try {
      // Parse cartItemId to get productId, storage, color
      const [productId, storage, color] = cartItemId.split('-');

      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          storage,
          color,
        }),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        
        // Convert backend cart format to frontend format
        const items = {};
        const checks = {};
        
        updatedCart.items.forEach(item => {
          const itemCartItemId = `${item.productId}-${item.storage}-${item.color}`;
          items[itemCartItemId] = item;
          checks[itemCartItemId] = updatedCart.checkedItems[itemCartItemId] || false;
        });
        
        setCartItems(items);
        setCheckedItems(checks);
        setCartOrder(updatedCart.cartOrder || []);
      }
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const toggleItemCheck = async (cartItemId) => {
    if (!user) return;

    // --- Optimistic update ---
    const prevCheckedItems = checkedItems;
    setCheckedItems((prev) => ({ ...prev, [cartItemId]: !prev[cartItemId] }));
    // --------------------------

    try {
      const [productId, storage, color] = cartItemId.split('-');

      const res = await fetch("/api/cart/toggle-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, storage, color }),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        const items = {};
        const checks = {};
        updatedCart.items.forEach((item) => {
          const id = `${item.productId}-${item.storage}-${item.color}`;
          items[id] = item;
          checks[id] = updatedCart.checkedItems[id] || false;
        });
        setCartItems(items);
        setCheckedItems(checks);
        setCartOrder(updatedCart.cartOrder || []);
      } else {
        // Revert
        setCheckedItems(prevCheckedItems);
      }
    } catch (err) {
      console.error("Failed to toggle item check:", err);
      setCheckedItems(prevCheckedItems);
    }
  };

  const toggleAllChecks = async (checkState) => {
    if (!user) return;

    // --- Optimistic update ---
    const prevCheckedItems = checkedItems;
    setCheckedItems((prev) => {
      const next = { ...prev };
      cartOrder.forEach((id) => { next[id] = checkState; });
      return next;
    });
    // --------------------------

    try {
      const res = await fetch("/api/cart/toggle-all-checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ checkState }),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        const items = {};
        const checks = {};
        updatedCart.items.forEach((item) => {
          const id = `${item.productId}-${item.storage}-${item.color}`;
          items[id] = item;
          checks[id] = updatedCart.checkedItems[id] || false;
        });
        setCartItems(items);
        setCheckedItems(checks);
        setCartOrder(updatedCart.cartOrder || []);
      } else {
        setCheckedItems(prevCheckedItems);
      }
    } catch (err) {
      console.error("Failed to toggle all checks:", err);
      setCheckedItems(prevCheckedItems);
    }
  };

  const clearCheckedCartItems = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/cart/clear-checked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const updatedCart = await res.json();
        
        // Convert backend cart format to frontend format
        const items = {};
        const checks = {};
        
        updatedCart.items.forEach(item => {
          const itemCartItemId = `${item.productId}-${item.storage}-${item.color}`;
          items[itemCartItemId] = item;
          checks[itemCartItemId] = updatedCart.checkedItems[itemCartItemId] || false;
        });
        
        setCartItems(items);
        setCheckedItems(checks);
        setCartOrder(updatedCart.cartOrder || []);
      }
    } catch (err) {
      console.error("Failed to clear checked items:", err);
    }
  };

  const areAllItemsChecked = () => {
    if (cartOrder.length === 0) return false;
    for (const id of cartOrder) {
      if (cartItems[id] && !checkedItems[id]) return false;
    }
    return true;
  };

  const getCartProducts = () => {
    return cartOrder
      .filter((id) => cartItems[id])
      .map((id) => {
        const { productId, storage, color, quantity } = cartItems[id];
        const product = allProducts.find((p) => p._id === productId);
        let currentNewPrice = product?.newPrice;
        let currentOldPrice = product?.oldPrice;
        
        if (product && product.stockItems) {
          const matchedVariant = product.stockItems.find(
            (si) => si.color === color && si.variant === storage
          );
          if (matchedVariant) {
            currentNewPrice = matchedVariant.newPrice ?? product.newPrice;
            currentOldPrice = matchedVariant.oldPrice ?? product.oldPrice;
          }
        }
        
        return { ...product, storage, color, quantity, cartItemId: id, newPrice: currentNewPrice, oldPrice: currentOldPrice };
      });
  };

  const getTotalCartAmount = () => {
    let total = 0;
    cartOrder.forEach((id) => {
      if (cartItems[id] && checkedItems[id]) {
        const { productId, quantity, storage, color } = cartItems[id];
        const product = allProducts.find((p) => p._id === productId);
        if (product) {
          let itemPrice = product.newPrice || 0;
          if (product.stockItems) {
            const matchedVariant = product.stockItems.find(
              (si) => si.color === color && si.variant === storage
            );
            if (matchedVariant && matchedVariant.newPrice != null) {
              itemPrice = matchedVariant.newPrice;
            }
          }
          total += quantity * Number(itemPrice);
        }
      }
    });
    return total;
  };

  const getTotalCartItems = () => {
    return cartOrder.length;
  };

  const getTotalCartQuantity = () => {
    return cartOrder.filter((id) => cartItems[id]).length;
  };

  const getCartItemsWithOptions = () => {
    return cartOrder
      .filter((id) => cartItems[id])
      .map((id) => {
        const { productId, storage, color, quantity } = cartItems[id];
        const product = allProducts.find((p) => p._id === productId);
        if (product) {
          return { ...product, storage, color, quantity, cartItemId: id };
        }
        return null;
      })
      .filter(Boolean);
  };

  const contextValue = {
    allProducts,
    productsLoading,
    productsError,
    cartItems,
    checkedItems,
    loading,
    addToCart,
    removeOneFromCart,
    removeFromCart,
    toggleItemCheck,
    toggleAllChecks,
    clearCheckedCartItems,
    areAllItemsChecked,
    getItemTotalQuantity,
    getCartProducts,
    getTotalCartAmount,
    getTotalCartItems,
    getTotalCartQuantity,
    getCartItemsWithOptions,
    generateCartItemId,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
