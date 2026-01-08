"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useRouter } from "next/navigation";


const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { toast } = useToast();

  const router = useRouter();

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const storedVariants = JSON.parse(localStorage.getItem("selectedVariants")) || {};

      setCartItems(storedCart);
      setSelectedVariants(storedVariants);
    }
  }, []);

  // Update localStorage whenever cartItems change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVariants", JSON.stringify(selectedVariants));
    }
  }, [selectedVariants]);

  // Add Product to Cart
  const addToCart = (product) => {

    const quantityType = `${product.quantity} ${product.unit}`; // e.g., "500 g"

    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item._id === product._id && item.quantityType === quantityType
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id && item.quantityType === quantityType
            ? { ...item, numOrder: item.numOrder + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, numOrder: 1, quantityType }];
      }
    });

    // ✅ Store selected variant correctly using product name as key
    setSelectedVariants((prev) => ({
      ...prev,
      [product.name]: product, // Store the whole selected product variant
    }));

        console.log('product info: ', product);

    // toast or notification of adding to cart 
    toast({
      title: "Item Added to Cart",
      description: `${product?.name} has been added to your cart.`,
      action: <ToastAction altText="View cart" onClick={() => router.push("/cart")}>View Cart</ToastAction>,
      className: 'bg-green-500 text0'
    });
  };


  // Increment Quantity
  const incrementQ = (product) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === product._id && item.quantityType === product.quantityType
          ? { ...item, numOrder: item.numOrder + 1 }
          : item
      )
    );

    // toast or notification of adding to cart 
    toast({
      title: "Item added!",
      description: ``,
      action: <ToastAction altText="View cart" onClick={() => router.push("/cart")}>View Cart</ToastAction>,
      className: 'bg-yellow-500 text0'
    });
  };

  // Decrement Quantity (Remove if quantity becomes 0)
  const decrementQ = (product) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === product._id && item.quantityType === product.quantityType
          ? { ...item, numOrder: item.numOrder - 1 }
          : item
      );

      return updatedCart.filter((item) => item.numOrder > 0);
    });

    // toast or notification of adding to cart 
    toast({
      title: "Item removed!",
      description: ``,
      action: <ToastAction altText="View cart" onClick={() => router.push("/cart")}>View Cart</ToastAction>,
      className: 'bg-red-500 text0'
    });

  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    setSelectedVariants((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedVariants({});
  };

  // ✅ Calculate Total Cart Price
  const calculateTotal = () => {
      const delivery_charges = 0;
      const cgst = 0;
      const sgst = 0;
      const platform_fee = 5;

    const subtotal = cartItems.reduce((total, item) => {


      const discount_price = item.price * (1 - item.discount_lower / 100);
      const original_price = item.price;

      const price = item.discount_lower > 0 ? discount_price : original_price;
      return total + price * item.numOrder;
    }, 0);

    return cartItems.length > 0 ? subtotal + delivery_charges + cgst + sgst + platform_fee : 0;
  };

  const calculateSavedTotal = () => {

    const savedTotal = cartItems.reduce((total, item) => {
      const discount_price = item.price * (1 - item.discount_lower / 100);
      const original_price = item.price;

      const savedPrice = item.discount_lower > 0 ? (original_price - discount_price).toFixed(2) : 0;
      return total + savedPrice * item.numOrder;
    }, 0);

    return cartItems.length > 0 ? savedTotal : 0;
  };

  const completeTransaction = () => {
    // #num_units_ordered - 1
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incrementQ,
        decrementQ,
        removeFromCart,
        clearCart,
        calculateTotal,
        calculateSavedTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
