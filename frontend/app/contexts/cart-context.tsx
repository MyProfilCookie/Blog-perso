/* eslint-disable no-console */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { toast } from "sonner";

// Define the Article type
type Article = {
  title: string;
  description: string;
  price: number;
  link: string;
  imageUrl: string;
  productId: string;
  _id: string;
  quantity?: number;
};

type User = {
  pseudo: string;
  _id: string;
  email: string;
  name: string;
};

// Define the Cart context type
type CartContextType = {
  cartItems: Article[];
  addToCart: (article: Article) => void;
  removeFromCart: (articleId: string) => void;
  increaseQuantity: (articleId: string) => void;
  decreaseQuantity: (articleId: string) => void;
  clearCart: () => void;
  calculateTotalItems: () => number;
  calculateTotal: () => string;
  user: User | null;
  isAuthenticated: boolean;
};

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  clearCart: () => {},
  calculateTotalItems: () => 0,
  calculateTotal: () => "0.00",
  user: null,
  isAuthenticated: false,
});

// Hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cache pour éviter les vérifications répétées
let userCache: User | null = null;
let userCacheTimestamp = 0;
const USER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Article[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mémoriser l'état d'authentification pour éviter les recalculs
  const isAuthenticated = useMemo(() => {
    return Boolean(user && user.pseudo && user._id);
  }, [user]);

  // Load user and cart from localStorage on component mount - optimisé
  useEffect(() => {
    if (typeof window === "undefined" || isInitialized) return;

    const loadUserData = () => {
      try {
        const now = Date.now();
        
        // Utiliser le cache utilisateur si valide
        if (userCache && (now - userCacheTimestamp) < USER_CACHE_DURATION) {
          setUser(userCache);
          const userCartKey = `cartItems_${userCache.pseudo}`;
          const storedUserCart = localStorage.getItem(userCartKey);
          if (storedUserCart) {
            setCartItems(JSON.parse(storedUserCart));
          }
          setIsInitialized(true);
          return;
        }

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);

          // Vérifier que l'utilisateur a toutes les données nécessaires
          if (parsedUser && parsedUser.pseudo && parsedUser._id) {
            userCache = parsedUser;
            userCacheTimestamp = now;
            setUser(parsedUser);
            
            const userCartKey = `cartItems_${parsedUser.pseudo}`;
            const storedUserCart = localStorage.getItem(userCartKey);

            if (storedUserCart) {
              setCartItems(JSON.parse(storedUserCart));
            }
          } else {
            console.warn("Données utilisateur incomplètes, utilisation du panier invité");
            userCache = null;
          }
        } else {
          const guestCart = localStorage.getItem("guestCart");
          if (guestCart) {
            setCartItems(JSON.parse(guestCart));
          }
          userCache = null;
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        // En cas d'erreur, nettoyer les données corrompues
        localStorage.removeItem("user");
        localStorage.removeItem("guestCart");
        userCache = null;
      } finally {
        setIsInitialized(true);
      }
    };

    // Utiliser requestIdleCallback pour ne pas bloquer le rendu
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadUserData);
    } else {
      setTimeout(loadUserData, 0);
    }
  }, [isInitialized]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (user && user.pseudo) {
        const userCartKey = `cartItems_${user.pseudo}`;
        localStorage.setItem(userCartKey, JSON.stringify(cartItems));
      } else {
        localStorage.setItem("guestCart", JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error);
    }
  }, [cartItems, user]);

  // Add item to cart
  const addToCart = (article: Article) => {
    if (!article._id) {
      console.error("⚠️ Erreur : article sans _id", article);

      return;
    }

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item._id === article._id,
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevItems];

        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity ?? 1) + 1,
        };

        return updatedCart;
      }

      return [...prevItems, { ...article, quantity: 1 }];
    });

    // Notification avec Sonner
    toast.success("Article ajouté au panier", {
      description: `${article.title} a été ajouté à votre panier`,
      position: "bottom-right",
      duration: 3000,
    });
  };

  // Remove item from cart
  const removeFromCart = (articleId: string) => {
    const itemToRemove = cartItems.find((item) => item._id === articleId);

    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== articleId),
    );

    if (itemToRemove) {
      toast.info("Article retiré", {
        description: `${itemToRemove.title} a été retiré de votre panier`,
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  // Increase item quantity
  const increaseQuantity = (articleId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === articleId
          ? { ...item, quantity: (item.quantity ?? 1) + 1 }
          : item,
      ),
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (articleId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === articleId && (item.quantity ?? 1) > 1
          ? { ...item, quantity: (item.quantity ?? 1) - 1 }
          : item,
      ),
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    if (user) {
      const userCartKey = `cartItems_${user.pseudo}`;

      localStorage.removeItem(userCartKey);
    } else {
      localStorage.removeItem("guestCart");
    }
  };

  // Calculate total items in cart
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity ?? 1), 0);
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * (item.quantity ?? 1), 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        calculateTotalItems,
        calculateTotal,
        user,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
