"use client";

import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

interface StripeProviderProps {
  children: React.ReactNode;
  stripeKey: string;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children, stripeKey }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStripeWithRetry = async () => {
      let retries = 3;
      let lastError: Error | null = null;

      console.log("🔄 Tentative de chargement de Stripe...", { stripeKey: stripeKey?.substring(0, 20) + '...' });

      while (retries > 0) {
        try {
          setIsLoading(true);
          setError(null);
          
          console.log(`🔄 Tentative ${4 - retries}/3 de chargement Stripe`);
          const stripe = await loadStripe(stripeKey);
          
          if (stripe) {
            setStripePromise(Promise.resolve(stripe));
            setIsLoading(false);
            console.log("✅ Stripe chargé avec succès");
            return;
          } else {
            throw new Error("Stripe n'a pas pu être initialisé");
          }
        } catch (err) {
          lastError = err as Error;
          retries--;
          console.error(`⚠️ Tentative de chargement Stripe échouée (${3 - retries}/3):`, err);
          console.error("Détails de l'erreur:", {
            message: (err as Error).message,
            name: (err as Error).name,
            stack: (err as Error).stack
          });
          
          // Vérifier si c'est une erreur CSP
          if (err instanceof Error && (err.message.includes('Content Security Policy') || err.message.includes('CSP'))) {
            console.error("❌ Erreur CSP détectée");
            setError("Erreur de sécurité : Le chargement de Stripe est bloqué par la politique de sécurité du navigateur. Veuillez contacter l'administrateur du site.");
            setIsLoading(false);
            return;
          }
          
          if (retries > 0) {
            console.log(`⏳ Attente de 2 secondes avant la prochaine tentative...`);
            // Attendre avant de réessayer
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      // Toutes les tentatives ont échoué
      console.error("❌ Échec du chargement de Stripe après 3 tentatives:", lastError);
      setError(`Impossible de charger Stripe: ${lastError?.message || 'Erreur inconnue'}`);
      setIsLoading(false);
    };

    if (stripeKey) {
      loadStripeWithRetry();
    } else {
      console.error("❌ Clé Stripe non configurée");
      setError("Clé Stripe non configurée");
      setIsLoading(false);
    }
  }, [stripeKey]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        <span className="ml-2 text-gray-600">Chargement de Stripe...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
        <div className="flex items-center">
          <div className="text-yellow-600 mr-2">⚠️</div>
          <div>
            <h3 className="text-yellow-800 font-medium">Stripe temporairement indisponible</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Le service de paiement est temporairement indisponible. Veuillez réessayer dans quelques minutes.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-yellow-800 underline text-sm hover:text-yellow-900"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center">
          <div className="text-red-600 mr-2">❌</div>
          <div>
            <h3 className="text-red-800 font-medium">Configuration Stripe manquante</h3>
            <p className="text-red-700 text-sm mt-1">
              La clé Stripe n'est pas configurée correctement.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};
