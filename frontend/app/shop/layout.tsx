"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
// Import du contexte
import { CartProvider, useCart } from "@/app/contexts/cart-context";
import { useIsClient } from "@/hooks/useIsClient";

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
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreditCard, LogIn } from "lucide-react";

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
    const isClient = useIsClient();

    useEffect(() => {
        if (!isClient || typeof window === 'undefined') return;

        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768); // 768px = breakpoint pour desktop
        };

        handleResize(); // Exécuter immédiatement
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isClient]);

    const handleCheckout = () => {
        if (!user) {
            setIsLoginAlertOpen(true);
            return;
        }

        setIsPaymentAlertOpen(true);
    };

    const handleLoginConfirm = () => {
        // Sauvegarder l'URL actuelle pour revenir après connexion
        if (typeof window !== 'undefined') {
            sessionStorage.setItem("returnUrl", window.location.pathname);
        }
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
                {isClient ? (
                    <div
                        className="opacity-100 scale-100"
                        style={{ willChange: 'auto' }}
                    >
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    className="relative bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white p-4 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
                                    variant="default"
                                >
                                    <div
                                        className="animate-pulse"
                                        style={{ willChange: 'auto' }}
                                    >
                                        <FontAwesomeIcon className="text-xl" icon={faShoppingCart} />
                                    </div>
                                    {calculateTotalItems() > 0 && (
                                        <div 
                                            className="absolute -top-3 -right-3 opacity-100 scale-100"
                                            style={{ willChange: 'auto' }}
                                        >
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
                    </div>
                ) : (
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    className="relative bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white p-4 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
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
                    </div>
                )}
            </div>

            {/* Alert pour connexion */}
            <AlertDialog open={isLoginAlertOpen} onOpenChange={setIsLoginAlertOpen}>
                <AlertDialogContent className="border-none bg-gradient-to-br from-blue-50 via-white to-purple-50 p-0 shadow-2xl dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                    <div className="rounded-t-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-6 py-5 text-white shadow-inner">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                <LogIn className="h-6 w-6" />
                            </span>
                            <div>
                                <h3 className="text-xl font-semibold leading-tight">
                                    Se connecter pour continuer
                                </h3>
                                <p className="text-sm text-white/80">
                                    Accédez à votre panier sécurisé et suivez vos commandes.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-5">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Connectez-vous pour que nous puissions garder vos produits préférés
                            et activer les facilités de paiement AutiStudy.
                        </p>
                    </div>
                    <AlertDialogFooter className="flex flex-col gap-2 border-t border-violet-100/60 px-6 py-4 dark:border-violet-900/40">
                        <Button
                            variant="ghost"
                            onClick={() => setIsLoginAlertOpen(false)}
                            className="w-full border border-violet-200 text-violet-600 hover:border-violet-300 hover:text-violet-700 dark:border-violet-800 dark:text-violet-200 dark:hover:border-violet-600"
                        >
                            Je continue mes achats
                        </Button>
                        <Button
                            onClick={handleLoginConfirm}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
                        >
                            Me connecter
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Alert pour paiement */}
            <AlertDialog open={isPaymentAlertOpen} onOpenChange={setIsPaymentAlertOpen}>
                <AlertDialogContent className="border-none bg-gradient-to-br from-blue-50 via-white to-purple-50 p-0 shadow-2xl dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                    <div className="rounded-t-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 px-6 py-5 text-white shadow-inner">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                <CreditCard className="h-6 w-6" />
                            </span>
                            <div>
                                <h3 className="text-xl font-semibold leading-tight">
                                    Direction le paiement sécurisé
                                </h3>
                                <p className="text-sm text-white/80">
                                    Nous allons ouvrir la page de paiement protégée AutiStudy.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Vérifiez votre commande puis confirmez pour être redirigé. Vous
                            pourrez toujours revenir à la boutique pour ajouter d&apos;autres
                            produits.
                        </p>
                        <div className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 text-xs text-emerald-700 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200">
                            Paiement sécurisé • Carte bancaire & Stripe • Assistance AutiStudy
                        </div>
                    </div>
                    <AlertDialogFooter className="flex flex-col gap-2 border-t border-emerald-100/70 px-6 py-4 dark:border-emerald-900/40">
                        <Button
                            variant="ghost"
                            onClick={() => setIsPaymentAlertOpen(false)}
                            className="w-full border border-emerald-200 text-emerald-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-emerald-800 dark:text-emerald-200 dark:hover:border-emerald-600"
                        >
                            Ajouter d&apos;autres produits
                        </Button>
                        <Button
                            onClick={handlePaymentConfirm}
                            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white shadow-lg hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600"
                        >
                            Continuer vers le paiement
                        </Button>
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
