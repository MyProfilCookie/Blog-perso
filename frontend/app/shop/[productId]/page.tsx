"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Package,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/contexts/cart-context";

type Product = {
  _id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  link: string;
  category?: string;
  weight?: number;
  dimensions?: string;
  features?: string[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Récupérer tous les produits depuis l'API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://blog-perso.onrender.com/api'}/products`,
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargement du produit");
        }

        const products = await response.json();

        // Trouver le produit correspondant au productId ou _id
        // Note: productId peut être null dans la DB, donc on utilise aussi _id
        const foundProduct = products.find((p: Product) => {
          // Si le produit a un productId valide, on le compare
          if (p.productId && p.productId === params.productId) {
            return true;
          }
          // Sinon on compare avec _id
          return p._id === params.productId;
        });

        if (!foundProduct) {
          setError("Produit introuvable");
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        setError("Impossible de charger le produit");
      } finally {
        setLoading(false);
      }
    };

    if (params.productId) {
      fetchProduct();
    }
  }, [params.productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Produit introuvable"}
          </h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push("/shop")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-white" />
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Détails du Produit
              </h1>
            </div>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto mb-6">
              Découvrez tous les détails et caractéristiques de ce produit
            </p>
            <Button
              className="text-white hover:bg-white/10 border border-white/20"
              onClick={() => router.push("/shop")}
              variant="ghost"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la boutique
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800">
              <Image
                alt={product.title}
                className="object-cover"
                fill
                priority
                src={product.imageUrl}
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md">
                <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Paiement sécurisé
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Livraison rapide
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Qualité garantie
                </p>
              </div>
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
          >
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 w-fit">
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    key={i}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                (4.8/5 - 127 avis)
              </span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {product.price.toFixed(2)}
                </span>
                <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                  €
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                TVA incluse • Frais de livraison calculés à la caisse
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Caractéristiques
                </h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                      key={index}
                    >
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Info */}
            {(product.weight || product.dimensions) && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Informations techniques
                </h3>
                {product.weight && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Poids:</span> {product.weight}
                    g
                  </p>
                )}
                {product.dimensions && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Dimensions:</span>{" "}
                    {product.dimensions}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Quantité
              </label>
              <div className="flex items-center gap-3">
                <Button
                  className="w-12 h-12 text-lg font-bold"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="outline"
                >
                  -
                </Button>
                <input
                  className="w-20 h-12 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="1"
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  type="number"
                  value={quantity}
                />
                <Button
                  className="w-12 h-12 text-lg font-bold"
                  onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ajouter au panier - {(product.price * quantity).toFixed(2)}€
              </Button>

              {product.link && (
                <Button
                  asChild
                  className="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 font-semibold py-4 text-lg rounded-xl"
                  variant="outline"
                >
                  <NextLink
                    href={product.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Voir sur Amazon
                  </NextLink>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
