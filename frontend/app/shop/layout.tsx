/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faPlus, faMinus, faTrash, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Importer les composants shadcn
import ArticlesPage from "./page";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

export default function ShopPage() {
    const [cartItems, setCartItems] = useState<Article[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [isDesktop, setIsDesktop] = useState(false);
    const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);
    const [isPaymentAlertOpen, setIsPaymentAlertOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768); // 768px = breakpoint pour desktop
        };

        handleResize(); // Exécuter immédiatement
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);

            setUser(parsedUser);
            const userCartKey = `cartItems_${parsedUser.pseudo}`;
            const storedUserCart = localStorage.getItem(userCartKey);

            if (storedUserCart) {
                setCartItems(JSON.parse(storedUserCart));
            }
        } else {
            const guestCart = localStorage.getItem("guestCart");

            if (guestCart) {
                setCartItems(JSON.parse(guestCart));
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            const userCartKey = `cartItems_${user.pseudo}`;

            localStorage.setItem(userCartKey, JSON.stringify(cartItems));
        } else {
            localStorage.setItem("guestCart", JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = (article: Article) => {
        console.log("Article ajouté :", article);

        if (!article._id) {
            console.error("⚠️ Erreur : article sans _id", article);
            return;
        }

        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((item) => item._id === article._id);

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

    const increaseQuantity = (_id: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === _id
                    ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (_id: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === _id && (item.quantity ?? 1) > 1
                    ? { ...item, quantity: (item.quantity ?? 1) - 1 }
                    : item
            )
        );
    };

    const removeItem = (_id: string) => {
        const itemToRemove = cartItems.find(item => item._id === _id);
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== _id));

        if (itemToRemove) {
            toast.info("Article retiré", {
                description: `${itemToRemove.title} a été retiré de votre panier`,
                position: "bottom-right",
                duration: 3000,
            });
        }
    };

    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + (item.quantity ?? 1), 0);
    };

    const calculateTotal = () => {
        return cartItems
            .reduce((total, item) => total + item.price * (item.quantity ?? 1), 0)
            .toFixed(2);
    };

    const handleCheckout = () => {
        if (!user) {
            setIsLoginAlertOpen(true);
            return;
        }

        setIsPaymentAlertOpen(true);
    };

    const handleLoginConfirm = () => {
        router.push("/users/login");
    };

    const handlePaymentConfirm = () => {
        router.push("/payment");
    };

    return (
        <div className="min-h-screen px-4 py-8 md:px-10 bg-cream dark:bg-gray-900 transition-colors">
            <div className="mb-6 text-center">
                <motion.h1
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <FontAwesomeIcon className="mr-2 text-violet-600 dark:text-violet-400" icon={faShoppingBag} />
                    Notre Boutique
                </motion.h1>
                <motion.p
                    animate={{ opacity: 1 }}
                    className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Découvrez notre sélection de produits spécialement conçus pour améliorer le quotidien des personnes autistes.
                </motion.p>
            </div>

            <div className="fixed right-4 bottom-4 z-50">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="relative bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white p-4 h-14 w-14 rounded-full shadow-lg transition-colors"
                            variant="default"
                        >
                            <FontAwesomeIcon className="text-xl" icon={faShoppingCart} />
                            {calculateTotalItems() > 0 && (
                                <div className="absolute -top-3 -right-3">
                                    <Badge
                                        className="bg-red-600 hover:bg-red-600 text-white font-bold min-w-[24px] h-6 flex items-center justify-center rounded-full px-2 border-2 border-white dark:border-gray-900"
                                    >
                                        {calculateTotalItems()}
                                    </Badge>
                                </div>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[90vw] sm:w-[400px] p-0" sideOffset={5}>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-center text-violet-600 dark:text-violet-400">
                                Votre Panier
                            </h3>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-6">
                                    <FontAwesomeIcon
                                        className="text-4xl text-gray-400 dark:text-gray-600 mb-3"
                                        icon={faShoppingCart}
                                    />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Votre panier est vide
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-[60vh] overflow-y-auto">
                                    <ul className="space-y-3">
                                        {cartItems.map((item) => (
                                            <li
                                                key={item._id}
                                                className="flex items-center gap-3 border-b dark:border-gray-700 pb-3"
                                            >
                                                <img
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                                    src={item.imageUrl}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.quantity} × {item.price.toFixed(2)} €
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <Button
                                                        className="h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white"
                                                        size="icon"
                                                        variant="default"
                                                        onClick={() => increaseQuantity(item._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Button>
                                                    <Button
                                                        className="h-8 w-8"
                                                        disabled={item.quantity === 1}
                                                        size="icon"
                                                        variant="secondary"
                                                        onClick={() => decreaseQuantity(item._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </Button>
                                                    <Button
                                                        className="h-8 w-8"
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => removeItem(item._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-4 pt-3 border-t dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                    <span className="font-bold text-lg text-gray-800 dark:text-white">
                                        {calculateTotal()} €
                                    </span>
                                </div>

                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                                    disabled={cartItems.length === 0}
                                    onClick={handleCheckout}
                                >
                                    Passer au paiement
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Alert pour connexion */}
            <AlertDialog open={isLoginAlertOpen} onOpenChange={setIsLoginAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Connexion requise</AlertDialogTitle>
                        <AlertDialogDescription>
                            Vous devez être connecté pour accéder au paiement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLoginConfirm} className="bg-violet-600 hover:bg-violet-700 text-white">
                            Se connecter
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Alert pour paiement */}
            <AlertDialog open={isPaymentAlertOpen} onOpenChange={setIsPaymentAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Paiement</AlertDialogTitle>
                        <AlertDialogDescription>
                            Redirection vers la page de paiement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePaymentConfirm} className="bg-green-600 hover:bg-green-700 text-white">
                            Continuer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ArticlesPage cart={cartItems} onAddToCart={addToCart} />
        </div>
    );
}
