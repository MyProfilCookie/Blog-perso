/* eslint-disable padding-line-between-statements */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Badge, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faPlus, faMinus, faTrash, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import ArticlesPage from "./page";


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
    const [isCartOpen, setIsCartOpen] = useState(false);

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

        // Show a brief success notification
        Swal.fire({
            title: "Ajouté au panier!",
            text: "Article ajouté avec succès",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            position: 'bottom-end',
            toast: true
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
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== _id));
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
            Swal.fire({
                title: "Connexion requise",
                text: "Vous devez être connecté pour accéder au paiement.",
                icon: "warning",
                confirmButtonText: "Se connecter",
                confirmButtonColor: "#8B5CF6",
                background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/users/login");
                }
            });
            return;
        }

        Swal.fire({
            title: "Paiement",
            text: "Redirection vers la page de paiement.",
            icon: "info",
            confirmButtonColor: "#10B981",
            background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
            color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000',
        });
        router.push("/payment");
    };

    return (
        <div className="min-h-screen px-4 py-8 md:px-10 bg-cream dark:bg-gray-900 transition-colors">
            <div className="mb-6 text-center">
                <motion.h1
                    className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FontAwesomeIcon icon={faShoppingBag} className="mr-2 text-violet-600 dark:text-violet-400" />
                    Notre Boutique
                </motion.h1>
                <motion.p
                    className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Découvrez notre sélection de produits spécialement conçus pour améliorer le quotidien des personnes autistes.
                </motion.p>
            </div>

            <div className="fixed right-4 bottom-4 z-50">
                <Popover
                    placement="bottom-end"
                    offset={12}
                    showArrow={true}
                >
                    <PopoverTrigger>
                        <Button
                            className="bg-violet-600 dark:bg-violet-700 hover:bg-violet-700 dark:hover:bg-violet-800 text-white p-4 rounded-full shadow-lg transition-colors"
                        >
                            <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                            {calculateTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 border-2 border-white dark:border-gray-800">
                                    {calculateTotalItems()}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[90vw] sm:w-[400px]">
                        <div className="p-4 bg-cream dark:bg-gray-800 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-center text-violet-600 dark:text-violet-400">
                                Votre Panier
                            </h3>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-6">
                                    <FontAwesomeIcon
                                        icon={faShoppingCart}
                                        className="text-4xl text-gray-400 dark:text-gray-600 mb-3"
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
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700"
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
                                                        size="sm"
                                                        className="min-w-0 w-8 h-8 p-0 bg-blue-500 text-white"
                                                        onClick={() => increaseQuantity(item._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="min-w-0 w-8 h-8 p-0 bg-gray-200 dark:bg-gray-700"
                                                        disabled={item.quantity === 1}
                                                        onClick={() => decreaseQuantity(item._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="min-w-0 w-8 h-8 p-0 bg-red-500 text-white"
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
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0}
                                >
                                    Passer au paiement
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <ArticlesPage cart={cartItems} onAddToCart={addToCart} />
        </div>
    );
}