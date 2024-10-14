/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
"use client";
import { useState, useEffect } from "react";
import { Modal, Badge, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2"; // Import de la bibliothèque pour les alertes

import ArticlesPage from "./page";

type Article = {
    title: string;
    description: string;
    price: string;
    link: string;
    imageUrl: string;
};

export default function ShopPage() {
    const [cartItems, setCartItems] = useState<Article[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Charger le panier depuis localStorage à l'initialisation
    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");

        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);

                if (Array.isArray(parsedCart)) {
                    setCartItems(parsedCart);
                }
            } catch (error) {

            }
        }
    }, []);

    // Sauvegarder le panier dans localStorage à chaque mise à jour du panier
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Fonction pour ajouter des articles au panier avec gestion des doublons
    const handleAddToCart = (article: Article) => {
        const itemExists = cartItems.find((item) => item.title === article.title);

        if (itemExists) {
            // Demander une confirmation si l'article existe déjà
            Swal.fire({
                title: "Article déjà présent",
                text: "Cet article est déjà dans votre panier. Voulez-vous vraiment l'ajouter à nouveau ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, ajouter encore",
                cancelButtonText: "Annuler",
            }).then((result) => {
                if (result.isConfirmed) {
                    setCartItems((prevItems) => [...prevItems, article]);
                    Swal.fire("Ajouté", "L'article a été ajouté à nouveau.", "success");
                }
            });
        } else {
            // Ajouter l'article et afficher un message de succès
            Swal.fire({
                title: "Ajouter cet article?",
                text: `Voulez-vous ajouter "${article.title}" à votre panier ?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, ajouter",
                cancelButtonText: "Annuler",
            }).then((result) => {
                if (result.isConfirmed) {
                    setCartItems((prevItems) => [...prevItems, article]);
                    Swal.fire("Ajouté", "L'article a été ajouté à votre panier.", "success");
                }
            });
        }
    };

    // Fonction pour ouvrir ou fermer le panier (popup)
    const toggleCart = () => {
        setIsCartOpen((prev) => !prev);
    };

    return (
        <div>
            {/* Titre de la boutique */}
            <div className="flex justify-between items-center p-4 bg-white shadow-md">
                <h1 className="text-5xl font-bold text-violet-800 text-center w-full">
                    Boutique les articles pour le quotidien
                </h1>
            </div>

            {/* Bouton flottant avec FontAwesome et badge */}
            <Button
                className="relative"
                color="primary"
                style={{
                    padding: '24px 24px',
                    borderRadius: '30px', // Bouton arrondi
                    backgroundColor: '#2D3748', // Couleur sombre avec bon contraste
                    color: '#FFF', // Texte blanc pour contraste
                    fontWeight: 'bold',
                    fontSize: '16px', // Taille de texte légèrement augmentée
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'fixed',
                    right: '30px',
                    bottom: '20px',
                    zIndex: 50,
                    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', // Amélioration de l'ombre
                    transition: 'box-shadow 0.3s ease',
                }}
                onPress={toggleCart}
            >
                <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '8px' }} />
                {cartItems.length > 0 && (
                    <Badge
                        color="danger"
                        content={cartItems.length}
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-6px',
                            transform: 'translate(50%, -50%)',
                            fontSize: '14px',
                            border: "none"
                        }}
                    >
                        {/* Ajout d'un élément enfant vide pour eviter un bug de positionnement du badge */}
                        <span></span>
                    </Badge>
                )}
            </Button>

            {/* Page des articles */}
            <ArticlesPage onAddToCart={handleAddToCart} />

            {/* Popup du panier */}
            <Modal closeButton isOpen={isCartOpen} onClose={toggleCart}>
                <div className="modal-header">
                    <h3 className="text-lg font-semibold">Votre Panier</h3>
                </div>
                <div className="modal-body">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-600">Votre panier est vide.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {cartItems.map((item, index) => (
                                <li key={index} className="py-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{item.title}</span>
                                        <span className="text-gray-500">{item.price}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="modal-footer">
                    <Button color="primary" variant="flat" onClick={toggleCart}>
                        Fermer
                    </Button>
                </div>
            </Modal>
        </div >
    );
}







