/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Badge, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import ArticlesPage from "./page";

type Article = {
    productId: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    link: string;
    quantity?: number;
};

type User = {
    pseudo: any;
    _id: string;
    email: string;
    name: string;
};

export default function ShopPage() {
    const [cartItems, setCartItems] = useState<Article[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Charger l'utilisateur depuis le localStorage et synchroniser le panier
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            console.log("Données utilisateur dans localStorage :", storedUser);

            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);

                const userCartKey = `cartItems_${parsedUser.pseudo}`;
                console.log("Clé générée pour le panier :", userCartKey);

                const storedUserCart = localStorage.getItem(userCartKey);
                const guestCart = localStorage.getItem("guestCart");

                let mergedCart: Article[] = [];
                if (guestCart) mergedCart = JSON.parse(guestCart);
                if (storedUserCart) mergedCart = mergeCarts(mergedCart, JSON.parse(storedUserCart));

                setCartItems(mergedCart);

                // Sauvegarder le panier fusionné et supprimer le panier invité
                localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
                localStorage.removeItem("guestCart");
            } else {
                const guestCart = localStorage.getItem("guestCart");
                if (guestCart) {
                    setCartItems(JSON.parse(guestCart));
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    }, []);

    // Sauvegarder le panier dans le localStorage à chaque mise à jour
    useEffect(() => {
        try {
            if (user) {
                const userCartKey = `cartItems_${user.pseudo}`;
                console.log("Sauvegarde du panier utilisateur :", cartItems);
                localStorage.setItem(userCartKey, JSON.stringify(cartItems));
            } else {
                console.log("Sauvegarde du panier invité :", cartItems);
                localStorage.setItem("guestCart", JSON.stringify(cartItems));
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du panier :", error);
        }
    }, [cartItems, user]);

    // Fusionner deux paniers
    const mergeCarts = (cart1: Article[], cart2: Article[]): Article[] => {
        const merged = [...cart1];
        cart2.forEach((item) => {
            const existingItem = merged.find((cartItem) => cartItem.productId === item.productId);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity ?? 0) + (item.quantity ?? 0);
            } else {
                merged.push(item);
            }
        });
        return merged;
    };

    // Ajouter un article au panier
    const addToCart = (article: Article) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.productId === article.productId);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.productId === article.productId
                        ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                        : item
                );
            }
            return [...prevItems, { ...article, quantity: 1 }];
        });
    };

    // Augmenter la quantité d'un article
    const increaseQuantity = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                    : item
            )
        );
    };

    // Diminuer la quantité d'un article
    const decreaseQuantity = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId && (item.quantity ?? 0) > 1
                    ? { ...item, quantity: (item.quantity ?? 1) - 1 }
                    : item
            )
        );
    };

    // Supprimer un article du panier
    const removeItem = (productId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    };

    // Calculer le nombre total d'articles
    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + (item.quantity ?? 1), 0);
    };

    // Calculer le sous-total du panier
    const calculateTotal = () => {
        return cartItems
            .reduce((total, item) => total + item.price * (item.quantity ?? 1), 0)
            .toFixed(2);
    };

    // Passer au paiement
    const handleCheckout = () => {
        if (!user) {
            Swal.fire({
                title: "Connexion requise",
                text: "Vous devez être connecté pour accéder au paiement.",
                icon: "warning",
                confirmButtonText: "Se connecter",
            }).then(() => {
                router.push("/users/login");
            });
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
            {/* Popover pour le panier */}
            <Popover>
                <PopoverTrigger>
                    <Button
                        className="relative"
                        color="primary"
                        style={{
                            padding: "14px",
                            borderRadius: "30px",
                            backgroundColor: "#2D3748",
                            color: "#FFF",
                            position: "fixed",
                            right: "20px",
                            bottom: "20px",
                        }}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {calculateTotalItems() > 0 && (
                            <Badge
                                color="danger"
                                style={{
                                    position: "absolute",
                                    top: "-10px",
                                    right: "-10px",
                                }}
                            >
                                {calculateTotalItems()}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="p-4 min-w-[300px] bg-white shadow-lg rounded-lg">
                        <h3 className="mb-4 text-xl font-semibold text-gray-700">Votre Panier</h3>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500">Votre panier est vide.</p>
                        ) : (
                            <ul className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="object-cover w-16 h-16 rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{item.title}</p>
                                            <p className="text-gray-600">
                                                {item.quantity} x {item.price.toFixed(2)} €
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => increaseQuantity(item.productId)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => decreaseQuantity(item.productId)}
                                                disabled={item.quantity === 1}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="danger"
                                                onClick={() => removeItem(item.productId)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {cartItems.length > 0 && (
                            <div className="mt-4">
                                <p className="font-semibold text-gray-700">Total : {calculateTotal()} €</p>
                                <Button
                                    className="w-full mt-2"
                                    color="success"
                                    onClick={handleCheckout}
                                >
                                    Passer au paiement
                                </Button>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Liste des articles */}
            <div className="gap-6 mt-8">
                <ArticlesPage cart={cartItems} onAddToCart={addToCart} />
            </div>
        </div>
    );
}
