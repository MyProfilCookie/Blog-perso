/* eslint-disable padding-line-between-statements */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Badge, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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
            }).then(() => router.push("/users/login"));
            return;
        }

        Swal.fire({
            title: "Paiement",
            text: "Redirection vers la page de paiement.",
            icon: "info",
        });
        router.push("/payment");
    };

    return (
        <div className="min-h-screen px-4 py-8 md:px-10">
            <Popover placement="bottom-end">
                <PopoverTrigger>
                    <Button className="fixed bg-gray-800 text-white p-4 rounded-full right-4 bottom-4">
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {calculateTotalItems() > 0 && (
                            <Badge className="absolute -top-2 -right-2" color="danger">
                                {calculateTotalItems()}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div
                        className="p-4 bg-cream dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg"
                        style={{
                            // width: "320px", // Largeur fixe
                            maxWidth: "90vw", // Évite le débordement sur petits écrans
                            maxHeight: "400px", // Limite la hauteur
                            overflowY: "auto", // Scroll si trop d'articles
                            transformOrigin: "top right", // Animation plus fluide
                        }}
                    >
                        <h3 className="text-lg font-bold mb-4 text-center">Votre Panier</h3>

                        {cartItems.length === 0 ? (
                            <p className="text-center">Votre panier est vide.</p>
                        ) : (
                            <ul className="space-y-2">
                                {cartItems.map((item) => (
                                    <li key={item._id} className="flex items-center gap-3 border-b pb-2">
                                        <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-md" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{item.title}</p>
                                            <p className="text-xs text-gray-400">{item.quantity} × {item.price.toFixed(2)} €</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button size="sm" onClick={() => increaseQuantity(item._id)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                            <Button size="sm" disabled={item.quantity === 1} onClick={() => decreaseQuantity(item._id)}>
                                                <FontAwesomeIcon icon={faMinus} />
                                            </Button>
                                            <Button size="sm" color="danger" onClick={() => removeItem(item._id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <p className="font-bold text-right mt-2">Total: {calculateTotal()} €</p>

                        <Button className="w-full mt-3 text-sm p-2" color="success" onClick={handleCheckout}>
                            Passer au paiement
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            <ArticlesPage cart={cartItems} onAddToCart={addToCart} />
        </div>
    );
}