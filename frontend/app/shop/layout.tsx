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

            {/* Bouton flottant discret avec FontAwesome et badge */}
            <Button
                className="fixed"
                style={{
                    padding: '10px 15px',
                    borderRadius: '50px',
                    backgroundColor: '#6B46C1',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'fixed',
                    right: '20px', // Positionné à droite
                    bottom: '20px', // Positionné en bas
                    zIndex: 50,
                    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s ease',
                }}
                onPress={toggleCart}
            >
                <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '8px' }} />
                {cartItems.length > 0 && (
                    <Badge
                        style={{
                            backgroundColor: '#E53E3E',
                            color: '#FFF',
                            fontSize: '12px',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            textAlign: 'center',
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            border: '2px solid white',
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





