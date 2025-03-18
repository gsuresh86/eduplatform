"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  author?: {
    name?: string;
  };
}

interface CartItem {
  id: string;
  courseId: string;
  userId: string;
  addedAt: string;
  course: Course;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart items when the session changes
  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      setIsLoading(false);
    }
  }, [session, status]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart");
      
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      
      const data = await response.json();
      
      // Ensure we have valid data
      if (data && Array.isArray(data.items)) {
        setCartItems(data.items);
        setCartCount(data.count || 0);
        setCartTotal(data.total || 0);
      } else {
        console.error("Invalid cart data received:", data);
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
        toast.error("Failed to load your cart: Invalid data");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load your cart");
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (courseId: string) => {
    if (!session) {
      toast.error("You must be logged in to add items to your cart");
      return;
    }

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add item to cart");
      }

      if (response.status === 201) {
        toast.success("Item added to cart");
        // Fetch cart items after a short delay to ensure the server has processed the change
        setTimeout(() => {
          fetchCartItems();
        }, 300);
      } else {
        toast.success(data.message || "Item is already in your cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add item to cart");
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove item from cart");
      }

      toast.success("Item removed from cart");
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove item from cart");
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    setCartTotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 