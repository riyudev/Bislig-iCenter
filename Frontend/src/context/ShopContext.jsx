import React, { createContext, useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  return {};
};

const getDefaultCheckedItems = () => {
  return {};
};

const ShopContextProvider = (props) => {
  const { user } = useAuth();
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
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Failed to load products");
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

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setCartItems(getDefaultCart());
      setCheckedItems(getDefaultCheckedItems());
      setCartOrder([]);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart/", {
        credentials: "include",
      });
      
      if (res.ok) {
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
    if (!user) {
      // Don't allow adding to cart if not logged in
      return;
    }

    const cartItemId = generateCartItemId(productId, storage, color);

    if (actionLockRef.current[cartItemId]) return;
    actionLockRef.current[cartItemId] = true;

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          storage,
          color,
          quantity: quantityToAdd,
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
      console.error("Failed to add to cart:", err);
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

    try {
      // Parse cartItemId to get productId, storage, color
      const [productId, storage, color] = cartItemId.split('-');

      const res = await fetch("/api/cart/remove-one", {
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
      console.error("Failed to remove one from cart:", err);
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

    try {
      // Parse cartItemId to get productId, storage, color
      const [productId, storage, color] = cartItemId.split('-');

      const res = await fetch("/api/cart/toggle-check", {
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
      console.error("Failed to toggle item check:", err);
    }
  };

  const toggleAllChecks = async (checkState) => {
    if (!user) return;

    try {
      const res = await fetch("/api/cart/toggle-all-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          checkState,
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
      console.error("Failed to toggle all checks:", err);
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
