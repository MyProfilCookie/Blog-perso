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
import Link from "next/link";
import { toast } from "sonner";
import { Check, Info } from "lucide-react";

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

  const showCartToast = useCallback(
    ({
      variant,
      title,
      description,
    }: {
      variant: "success" | "info";
      title: string;
      description?: string;
    }) => {
      const styles =
        variant === "success"
          ? {
              badge: "bg-green-500/90 text-white",
              icon: <Check className="h-4 w-4" />,
            }
          : {
              badge: "bg-violet-500/90 text-white",
              icon: <Info className="h-4 w-4" />,
            };

      toast.custom(
        () => (
          <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-violet-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur dark:border-violet-900/40 dark:bg-gray-900/90">
            <div
              className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${styles.badge}`}
            >
              {styles.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {title}
              </p>
              {description && (
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>
            <Link
              href="/shop#cart"
              className="rounded-full border border-violet-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700 transition hover:border-violet-400 hover:text-violet-900 dark:border-violet-800 dark:text-violet-200 dark:hover:border-violet-600"
            >
              Voir le panier
            </Link>
          </div>
        ),
        { duration: 2600, position: "top-center" },
      );
    },
    [],
  );

  // Fonction pour fusionner le panier invité avec le panier utilisateur
  const mergeGuestCartWithUserCart = useCallback((userData: User) => {
    try {
      const guestCart = localStorage.getItem("guestCart");
      const userCartKey = `cartItems_${userData.pseudo}`;
      const userCart = localStorage.getItem(userCartKey);

      if (!guestCart) {
        console.log("📦 Pas de panier invité à fusionner");
        return;
      }

      const guestItems: Article[] = JSON.parse(guestCart);
      const userItems: Article[] = userCart ? JSON.parse(userCart) : [];

      console.log("🔄 Fusion des paniers:", {
        guestItems: guestItems.length,
        userItems: userItems.length
      });

      // Fusionner les articles
      const mergedItems = [...userItems];
      
      guestItems.forEach((guestItem) => {
        const existingIndex = mergedItems.findIndex(
          (item) => item._id === guestItem._id
        );

        if (existingIndex !== -1) {
          // L'article existe déjà, additionner les quantités
          mergedItems[existingIndex] = {
            ...mergedItems[existingIndex],
            quantity: (mergedItems[existingIndex].quantity || 1) + (guestItem.quantity || 1)
          };
        } else {
          // Nouvel article, l'ajouter
          mergedItems.push(guestItem);
        }
      });

      console.log("✅ Panier fusionné:", mergedItems.length, "articles");

      // Sauvegarder le panier fusionné
      localStorage.setItem(userCartKey, JSON.stringify(mergedItems));
      
      // Nettoyer le panier invité
      localStorage.removeItem("guestCart");
      
      // Mettre à jour l'état
      setCartItems(mergedItems);

      // Notification
      if (guestItems.length > 0) {
        toast.success("Panier restauré ✓", {
          description: `${guestItems.length} article(s) ajouté(s) à votre panier`,
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la fusion des paniers:", error);
    }
  }, []);

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
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(loadUserData);
    } else {
      setTimeout(loadUserData, 0);
    }
  }, [isInitialized]);

  // Écouter l'événement de connexion utilisateur pour fusionner les paniers
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUserLogin = (event: CustomEvent) => {
      const userData = event.detail;
      console.log("👤 Utilisateur connecté, fusion des paniers...");
      
      // Mettre à jour l'utilisateur
      userCache = userData;
      userCacheTimestamp = Date.now();
      setUser(userData);
      
      // Fusionner les paniers
      mergeGuestCartWithUserCart(userData);
    };

    window.addEventListener("userLoggedIn", handleUserLogin as EventListener);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLogin as EventListener);
    };
  }, [mergeGuestCartWithUserCart]);

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

    showCartToast({
      variant: "success",
      title: "Article ajouté au panier",
      description: article.title,
    });
  };

  // Remove item from cart
  const removeFromCart = (articleId: string) => {
    const itemToRemove = cartItems.find((item) => item._id === articleId);

    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== articleId),
    );

    if (itemToRemove) {
      showCartToast({
        variant: "info",
        title: "Article retiré",
        description: itemToRemove.title,
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
