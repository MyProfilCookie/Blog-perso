/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Badge, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"; // Nouvelle API pour le "app directory"

import ArticlesPage from "./page"; // Page des articles

// Modifiez la définition du type Article dans ce fichier
type Article = {
    title: string;
    description: string;
    price: number;
    link: string;
    imageUrl: string;
    quantity?: number;
    weight?: number; // Poids optionnel pour chaque article
};

export default function ShopPage() {
    const [cartItems, setCartItems] = useState<Article[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Pour gérer l'authentification
    const router = useRouter(); // Nouvelle API de navigation

    // Fonction pour vérifier si l'utilisateur est connecté
    const checkUserLoggedIn = () => {
        const userToken = localStorage.getItem("userToken");

        if (userToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    // Charger le panier depuis localStorage à l'initialisation et vérifier la connexion
    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");

        checkUserLoggedIn();

        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);

                if (Array.isArray(parsedCart)) {
                    setCartItems(parsedCart);
                }
            } catch (error: any) {
                alert(`Erreur lors de l'analyse du panier : ${error.message}`);
            }
        }
    }, []);

    // Sauvegarder le panier dans localStorage à chaque mise à jour du panier
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Calculer le sous-total du panier
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0).toFixed(2);
    };

    // Calculer le poids total du panier
    const calculateTotalWeight = () => {
        return cartItems.reduce((total, item) => total + (item.weight ?? 0) * (item.quantity ?? 1), 0).toFixed(2);
    };

    // Calculer le nombre total d'articles dans le panier
    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + (item.quantity ?? 1), 0);
    };

    // Fonction pour rediriger vers la page de paiement
    const handleCheckout = () => {
        if (!isLoggedIn) {
            Swal.fire({
                title: "Connexion requise",
                text: "Vous devez être connecté pour procéder au paiement.",
                icon: "warning",
            }).then(() => {
                router.push("/login");
            });
        } else {
            const totalPrice = calculateTotal();
            const totalWeight = calculateTotalWeight();

            localStorage.setItem("totalPrice", totalPrice); // Enregistrer le sous-total
            localStorage.setItem("parcelWeight", totalWeight); // Enregistrer le poids total
            router.push("/payment");
        }
    };

    // Gestion de l'ajout au panier, suppression, etc.
    const addToCart = (article: Article) => {
        const articleWithQuantity = { ...article, quantity: article.quantity || 1 };
        const existingArticle = cartItems.find((cartItem) => cartItem.title === article.title);

        if (existingArticle) {
            Swal.fire({
                title: "Article déjà dans le panier",
                text: "Cet article est déjà dans votre panier. Voulez-vous l'ajouter à nouveau ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui, ajouter",
                cancelButtonText: "Non, annuler",
            }).then((result) => {
                if (result.isConfirmed && (existingArticle.quantity ?? 0) < 10) {
                    setCartItems((prevItems) =>
                        prevItems.map((item) =>
                            item.title === article.title
                                ? { ...item, quantity: (item.quantity ?? 0) + 1 }
                                : item
                        )
                    );
                    Swal.fire({
                        icon: "success",
                        title: "Article ajouté",
                        text: `"${article.title}" a été ajouté au panier avec succès.`,
                        confirmButtonText: "Ok",
                    });
                }
            });
        } else {
            Swal.fire({
                title: "Ajouter au panier",
                text: `Êtes-vous sûr de vouloir ajouter "${article.title}" au panier ?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Oui, ajouter",
                cancelButtonText: "Annuler",
            }).then((result) => {
                if (result.isConfirmed) {
                    setCartItems((prevItems) => [...prevItems, { ...articleWithQuantity }]);
                    Swal.fire({
                        icon: "success",
                        title: "Article ajouté",
                        text: `"${article.title}" a été ajouté au panier avec succès.`,
                        confirmButtonText: "Ok",
                    });
                }
            });
        }
    };

    // Fonction pour augmenter la quantité
    const increaseQuantity = (title: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.title === title && (item.quantity ?? 0) < 10
                    ? { ...item, quantity: (item.quantity ?? 0) + 1 }
                    : item
            )
        );
    };

    // Fonction pour diminuer la quantité
    const decreaseQuantity = (title: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.title === title && item.quantity && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    // Fonction pour supprimer un article
    const removeItem = (title: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.title !== title));
    };

    return (
        <div>
            {/* Popover pour afficher le panier */}
            <Popover>
                <PopoverTrigger>
                    <Button
                        className="relative"
                        color="primary"
                        style={{
                            padding: "24px 24px",
                            borderRadius: "30px",
                            backgroundColor: "#2D3748",
                            color: "#FFF",
                            position: "fixed",
                            right: "30px",
                            bottom: "20px",
                            zIndex: 50,
                            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                            transition: "box-shadow 0.3s ease",
                        }}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: "8px" }} />
                        {calculateTotalItems() > 0 && (
                            <Badge
                                color="danger"
                                style={{
                                    position: "absolute",
                                    top: "-10px",
                                    right: "-6px",
                                    transform: "translate(50%, -50%)",
                                }}
                            >
                                {calculateTotalItems()}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent>
                    <div className="dark:bg-gray-800 dark:text-white" style={{ padding: "10px", width: "340px", backgroundColor: "#fff", color: "#000", borderRadius: "10px" }}>
                        <h3 className="text-lg font-semibold">Votre Panier</h3>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300">Votre panier est vide.</p>
                        ) : (
                            <div>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {cartItems.map((item, index) => (
                                        <li key={index} className="py-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">
                                                    {item.title} ({item.quantity})
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-800">
                                                    {(item.price * (item.quantity ?? 1)).toFixed(2)} €
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <Button
                                                    color="secondary"
                                                    disabled={item.quantity === 1}
                                                    size="sm"
                                                    onPress={() => decreaseQuantity(item.title)}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    disabled={item.quantity === 10}
                                                    size="sm"
                                                    onPress={() => increaseQuantity(item.title)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onPress={() => removeItem(item.title)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 font-bold text-lg">
                                    Poids total : {calculateTotalWeight()} kg
                                </div>
                                <div className="mt-4 font-bold text-lg">
                                    Sous-total : {calculateTotal()} €
                                </div>
                                <Button
                                    className="w-full mt-4"
                                    color="primary"
                                    onClick={handleCheckout}
                                >
                                    Passer au paiement
                                </Button>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Page des articles */}
            <ArticlesPage onAddToCart={addToCart} />
        </div>
    );
}












