"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

import dynamic from 'next/dynamic';

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faPlus, faMinus, faTrash, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Import du contexte
import { CartProvider, useCart } from "@/app/contexts/cart-context";

// Importer les composants shadcn
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Composant de contenu du layout qui utilise le contexte
function ShopLayoutContent({ children }: { children: React.ReactNode }) {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        calculateTotalItems,
        calculateTotal,
        user
    } = useCart();

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
        <div className="min-h-screen py-4 bg-cream dark:bg-gray-900 transition-colors">
            {/* <div className="mb-4 md:mb-6 text-center">
                <motion.h1
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <FontAwesomeIcon className="mr-2 text-violet-600 dark:text-violet-400" icon={faShoppingBag} />
                    Notre Boutique
                </motion.h1>
                <motion.p
                    animate={{ opacity: 1 }}
                    className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4"
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Découvrez notre sélection de produits spécialement conçus pour améliorer le quotidien des personnes autistes.
                </motion.p>
            </div> */}

            <div className="fixed right-4 bottom-4 z-50">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 20,
                        delay: 0.5 
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="relative bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white p-4 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
                                variant="default"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <FontAwesomeIcon className="text-xl" icon={faShoppingCart} />
                                </motion.div>
                                {calculateTotalItems() > 0 && (
                                    <motion.div 
                                        className="absolute -top-3 -right-3"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 300, 
                                            damping: 15 
                                        }}
                                    >
                                        <Badge
                                            className="bg-red-600 hover:bg-red-600 text-white font-bold min-w-[24px] h-6 flex items-center justify-center rounded-full px-2 border-2 border-white dark:border-gray-900"
                                        >
                                            {calculateTotalItems()}
                                        </Badge>
                                    </motion.div>
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
                                                            onClick={() => removeFromCart(item._id)}
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
                </motion.div>
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

            {/* Rendu des enfants (pages) */}
            {children}
        </div>
    );
}

// Layout avec provider du panier
export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <ShopLayoutContent>
                {children}
            </ShopLayoutContent>
        </CartProvider>
    );
}
