/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Badge, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import ArticlesPage from "./page";

type Article = {
    title: string;
    description: string;
    price: number;
    link: string;
    imageUrl: string;
    quantity?: number;
    weight?: number;
    productId: string;
};

type User = {
    id: string;
    pseudo: string;
    email: string;
};

export default function ShopPage() {
    const [cartItems, setCartItems] = useState<Article[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    /**
     * Charger l'utilisateur depuis le localStorage
     */
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    /**
     * Charger le panier depuis le localStorage si l'utilisateur est connecté
     */
    useEffect(() => {
        if (user) {
            const storedCart = localStorage.getItem(`cartItems_${user.id}`);

            if (storedCart) {
                try {
                    const parsedCart = JSON.parse(storedCart);

                    if (Array.isArray(parsedCart)) {
                        setCartItems(parsedCart);
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement du panier :", error);
                }
            }
        } else {
            setCartItems([]); // Vider le panier si l'utilisateur est déconnecté
        }
    }, [user]);

    /**
     * Sauvegarder le panier dans le localStorage à chaque mise à jour
     */
    useEffect(() => {
        if (user) {
            if (cartItems.length > 0) {
                localStorage.setItem(`cartItems_${user.id}`, JSON.stringify(cartItems));
            } else {
                localStorage.removeItem(`cartItems_${user.id}`);
            }
        }
    }, [cartItems, user]);

    /**
     * Ajouter un article au panier
     */
    const addToCart = (article: Article) => {
        if (!user) {
            Swal.fire({
                title: "Connectez-vous",
                text: "Vous devez être connecté pour ajouter des articles au panier.",
                icon: "warning",
            });

            return;
        }

        setCartItems((prevItems) => {
            const existingArticle = prevItems.find((item) => item.productId === article.productId);

            if (existingArticle) {
                return prevItems.map((item) =>
                    item.productId === article.productId
                        ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                        : item
                );
            }

            return [...prevItems, { ...article, quantity: 1 }];
        });
    };

    /**
     * Vider le panier à la déconnexion
     */
    const handleLogout = () => {
        Swal.fire({
            title: "Déconnexion",
            text: "Votre panier sera vidé lors de la déconnexion.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Se déconnecter",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (result.isConfirmed) {
                if (user) {
                    localStorage.removeItem(`cartItems_${user.id}`);
                }
                localStorage.removeItem("user");
                setUser(null);
                setCartItems([]);
                Swal.fire("Déconnecté", "Vous avez été déconnecté(e).", "success");
                router.replace("/");
            }
        });
    };

    /**
     * Gestion des erreurs dans les composants
     */
    if (!user && cartItems.length > 0) {
        setCartItems([]);
    }

    return (
        <div>
            {/* Popover pour le panier */}
            <Popover>
                <PopoverTrigger>
                    <Button
                        className="relative"
                        color="primary"
                        style={{
                            padding: "12px",
                            borderRadius: "30px",
                            backgroundColor: "#2D3748",
                            color: "#FFF",
                            position: "fixed",
                            right: "20px",
                            bottom: "20px",
                        }}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {cartItems.length > 0 && (
                            <Badge
                                color="danger"
                                style={{
                                    position: "absolute",
                                    top: "-10px",
                                    right: "-10px",
                                }}
                            >
                                {cartItems.length}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div style={{ padding: "10px", minWidth: "300px" }}>
                        <h3>Votre Panier</h3>
                        {cartItems.length === 0 ? (
                            <p>Votre panier est vide.</p>
                        ) : (
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li key={index} style={{ marginBottom: "10px" }}>
                                        <div>
                                            <strong>{item.title}</strong> - {item.quantity} x {item.price.toFixed(2)} €
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {cartItems.length > 0 && (
                            <div>
                                <p>Total : {cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2)} €</p>
                                <Button onClick={() => router.push("/payment")}>
                                    Passer au paiement
                                </Button>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Liste des articles */}
            <ArticlesPage cart={cartItems} onAddToCart={addToCart} />

            {user && (
                <Button style={{ marginTop: "20px" }} onClick={handleLogout}>
                    Déconnexion
                </Button>
            )}
        </div>
    );
}