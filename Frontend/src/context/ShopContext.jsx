import React, { createContext, useState, useRef } from "react";
import iPhoneData from "../assets/data/iPhoneData";
import laptopData from "../assets/data/LaptopData";
import iPadData from "../assets/data/iPadData";
import androidData from "../assets/data/AndroidData";

export const ShopContext = createContext(null);

// Combine all categories into one master list
const allProducts = [...iPhoneData, ...laptopData, ...iPadData, ...androidData];

const getDefaultCart = () => {
  return {};
};

const getDefaultCheckedItems = () => {
  return {};
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [checkedItems, setCheckedItems] = useState(getDefaultCheckedItems());
  const [cartOrder, setCartOrder] = useState([]);
  const actionLockRef = useRef({});

  // Unique key for a specific product + storage + color combo
  const generateCartItemId = (
    productId,
    storage = "64GB",
    color = "Default",
  ) => {
    return `${productId}-${storage}-${color}`;
  };

  const addToCart = (productId, storage = "64GB", color = "Default") => {
    const cartItemId = generateCartItemId(productId, storage, color);

    if (actionLockRef.current[cartItemId]) return;
    actionLockRef.current[cartItemId] = true;

    setCartItems((prev) => {
      const updatedCart = { ...prev };
      const isNewItem = !updatedCart[cartItemId];

      if (isNewItem) {
        updatedCart[cartItemId] = {
          productId,
          storage,
          color,
          quantity: 0,
        };
      }

      updatedCart[cartItemId].quantity++;

      if (isNewItem) {
        setCartOrder((prevOrder) => [...prevOrder, cartItemId]);
      }

      return updatedCart;
    });

    setTimeout(() => {
      actionLockRef.current[cartItemId] = false;
    }, 100);
  };

  const getItemTotalQuantity = (productId) => {
    let total = 0;
    Object.values(cartItems).forEach((item) => {
      if (item.productId === productId) total += item.quantity;
    });
    return total;
  };

  const removeOneFromCart = (cartItemId) => {
    if (actionLockRef.current[cartItemId]) return;
    actionLockRef.current[cartItemId] = true;

    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[cartItemId]) {
        updated[cartItemId].quantity--;
        if (updated[cartItemId].quantity <= 0) {
          delete updated[cartItemId];
        }
      }
      return updated;
    });

    setTimeout(() => {
      actionLockRef.current[cartItemId] = false;
    }, 100);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[cartItemId];
      return updated;
    });

    setCartOrder((prevOrder) => prevOrder.filter((id) => id !== cartItemId));

    setCheckedItems((prev) => {
      const updated = { ...prev };
      delete updated[cartItemId];
      return updated;
    });
  };

  const toggleItemCheck = (cartItemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [cartItemId]: !prev[cartItemId],
    }));
  };

  const toggleAllChecks = (checkState) => {
    const updatedChecks = {};
    cartOrder.forEach((id) => {
      if (cartItems[id]) updatedChecks[id] = checkState;
    });
    setCheckedItems((prev) => ({ ...prev, ...updatedChecks }));
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
        const product = allProducts.find((p) => p.id === productId);
        return { ...product, storage, color, quantity, cartItemId: id };
      });
  };

  const getTotalCartAmount = () => {
    let total = 0;
    cartOrder.forEach((id) => {
      if (cartItems[id] && checkedItems[id]) {
        const { productId, quantity } = cartItems[id];
        const product = allProducts.find((p) => p.id === productId);
        if (product)
          total += quantity * Number(product.newPrice.replace(/,/g, ""));
      }
    });
    return total;
  };

  const getTotalCartItems = () => {
    return cartOrder.length;
  };

  const getCartItemsWithOptions = () => {
    return cartOrder
      .filter((id) => cartItems[id])
      .map((id) => {
        const { productId, storage, color, quantity } = cartItems[id];
        const product = allProducts.find((p) => p.id === productId);
        if (product) {
          return { ...product, storage, color, quantity, cartItemId: id };
        }
        return null;
      })
      .filter(Boolean);
  };

  const contextValue = {
    allProducts,
    cartItems,
    checkedItems,
    addToCart,
    removeOneFromCart,
    removeFromCart,
    toggleItemCheck,
    toggleAllChecks,
    areAllItemsChecked,
    getItemTotalQuantity,
    getCartProducts,
    getTotalCartAmount,
    getTotalCartItems,
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
