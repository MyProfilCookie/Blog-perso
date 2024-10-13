/* eslint-disable prettier/prettier */
"use client";
import { useState } from "react";
import { Modal, Badge, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

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

    // Fonction pour ajouter des articles au panier
    const handleAddToCart = (article: Article) => {
        setCartItems((prevItems) => [...prevItems, article]);
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
                    padding: '12px 24px',
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
                        style={{
                            backgroundColor: '#F56565', // Rouge avec contraste élevé
                            color: '#FFFFFF', // Texte blanc pour bonne lisibilité
                            fontSize: '14px', // Taille du texte dans le badge
                            padding: '10px', // Correction du padding
                            textAlign: 'center',
                            borderRadius: '50%',
                            border: '2px solid white',
                            top: '10px', // Ajustement de la position du badge
                            right: '8px', // Ajustement de la position du badge
                            position: 'absolute',
                            boxShadow: '0px 2px 4px rgba(0,0,0,0.25)', // Ombre plus douce
                            zIndex: -50,
                        }}
                    >
                        {cartItems.length}
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
        </div>
    );
}






