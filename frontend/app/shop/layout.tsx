/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Badge, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
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

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);

            const userCartKey = `cartItems_${parsedUser.pseudo}`;
            const storedUserCart = localStorage.getItem(userCartKey);
            const guestCart = localStorage.getItem("guestCart");

            let mergedCart: Article[] = [];
            if (guestCart) mergedCart = JSON.parse(guestCart);
            if (storedUserCart) mergedCart = mergeCarts(mergedCart, JSON.parse(storedUserCart));

            setCartItems(mergedCart);
            localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
            localStorage.removeItem("guestCart");
        } else {
            const guestCart = localStorage.getItem("guestCart");
            if (guestCart) setCartItems(JSON.parse(guestCart));
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

    const increaseQuantity = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId && (item.quantity ?? 0) > 1
                    ? { ...item, quantity: (item.quantity ?? 1) - 1 }
                    : item
            )
        );
    };

    const confirmRemoveItem = (productId: string) => {
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Voulez-vous vraiment supprimer cet article du panier ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (result.isConfirmed) {
                setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
                Swal.fire("Supprimé !", "L'article a été supprimé du panier.", "success");
            }
        });
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
            <Popover>
                <PopoverTrigger>
                    <Button
                        className="relative bg-gray-800 text-white p-4 rounded-full fixed right-4 bottom-4"
                        color="primary"
                    >
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {calculateTotalItems() > 0 && (
                            <Badge
                                color="danger"
                                className="absolute -top-2 -right-2"
                            >
                                {calculateTotalItems()}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="p-4 w-72 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Votre Panier</h3>
                        {cartItems.length === 0 ? (
                            <p>Votre panier est vide.</p>
                        ) : (
                            <ul className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        <button
                                            aria-label={`Remove ${item.title} from cart`}
                                            className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                                            style={{
                                                backgroundImage: `url(${item.imageUrl})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                border: 'none',
                                                padding: 0,
                                                overflow: 'hidden',
                                            }}
                                            onClick={() => confirmRemoveItem(item.productId)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    confirmRemoveItem(item.productId);
                                                }
                                            }}
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                                            <p>
                                                {item.quantity} x {item.price.toFixed(2)} €
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" onClick={() => increaseQuantity(item.productId)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => decreaseQuantity(item.productId)}
                                                disabled={item.quantity === 1}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {cartItems.length > 0 && (
                            <div className="mt-4">
                                <p className="font-bold">Total: {calculateTotal()} €</p>
                                <Button className="w-full mt-2" color="success" onClick={handleCheckout}>
                                    Passer au paiement
                                </Button>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <div className="gap-6 mt-8">
                <ArticlesPage cart={cartItems} onAddToCart={addToCart} />
            </div>
        </div>
    );
}



