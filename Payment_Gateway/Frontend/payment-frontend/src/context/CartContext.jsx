import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("payment_gateway_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const savedCoupon = localStorage.getItem("payment_gateway_coupon");
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("payment_gateway_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to storage:", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem("payment_gateway_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("payment_gateway_coupon");
      }
    } catch (e) {
      console.error("Failed to save coupon to storage:", e);
    }
  }, [appliedCoupon]);

  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  };

  const clearToast = () => {
    setToast(null);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        showToast(`Updated "${product.name}" quantity in cart!`, "success");
        return updated;
      } else {
        showToast(`Added "${product.name}" to cart!`, "success");
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item.id === productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.name}" from cart.`, "info");
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      showToast("Please enter a valid coupon code", "warning");
      return false;
    }

    const validCoupons = {
      SAVE10: { code: "SAVE10", type: "percent", value: 10, description: "10% OFF" },
      WELCOME20: { code: "WELCOME20", type: "percent", value: 20, description: "20% OFF" },
      FLAT500: { code: "FLAT500", type: "fixed", value: 500, description: "₹500 OFF" },
    };

    if (validCoupons[cleanCode]) {
      setAppliedCoupon(validCoupons[cleanCode]);
      showToast(`Coupon "${cleanCode}" applied successfully!`, "success");
      return true;
    } else {
      showToast("Invalid coupon code. Try SAVE10, WELCOME20, or FLAT500", "error");
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === "fixed") {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal + tax + shipping - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        totalItemCount,
        tax,
        shipping,
        discountAmount,
        grandTotal,
        toast,
        showToast,
        clearToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
