/* eslint-disable no-console */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";
import { getCurrentToken } from "@/utils/axiosConfig";

/**
 * Composant de test pour démontrer la fonctionnalité de reconnexion automatique
 * Ce composant permet de tester le système de refresh des tokens
 */
const TokenTestComponent = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authenticatedGet, authenticatedPost } = useAuthenticatedApi();

  const addTestResult = (test, success, message, details = null) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      details,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTestResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testCurrentToken = () => {
    const token = getCurrentToken();
    if (token) {
      addTestResult(
        "Vérification Token",
        true,
        "Token trouvé",
        `Token: ${token.substring(0, 20)}...`
      );
    } else {
      addTestResult(
        "Vérification Token",
        false,
        "Aucun token trouvé",
        "L'utilisateur n'est pas authentifié"
      );
    }
  };

  const testApiCall = async () => {
    setLoading(true);
    try {
      const response = await authenticatedGet("/users/me");
      addTestResult(
        "Appel API /users/me",
        true,
        "Succès",
        `Utilisateur: ${response.data.user?.email || response.data.user?.pseudo || "Inconnu"}`
      );
    } catch (error) {
      addTestResult(
        "Appel API /users/me",
        false,
        "Échec",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const testSubscriptionCall = async () => {
    setLoading(true);
    try {
      const response = await authenticatedGet("/subscriptions/info");
      addTestResult(
        "Appel API /subscriptions/info",
        true,
        "Succès",
        `Type: ${response.data.subscription?.type || "Inconnu"}`
      );
    } catch (error) {
      addTestResult(
        "Appel API /subscriptions/info",
        false,
        "Échec",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const simulateExpiredToken = () => {
    // Simuler un token expiré en modifiant le token actuel
    const currentToken = getCurrentToken();
    if (currentToken) {
      // Créer un token invalide en modifiant quelques caractères
      const expiredToken = currentToken.slice(0, -10) + "EXPIRED123";
      localStorage.setItem("userToken", expiredToken);
      localStorage.setItem("accessToken", expiredToken);
      
      addTestResult(
        "Simulation Token Expiré",
        true,
        "Token modifié pour simuler l'expiration",
        "Le prochain appel API devrait déclencher le refresh automatique"
      );
    } else {
      addTestResult(
        "Simulation Token Expiré",
        false,
        "Aucun token à modifier",
        "L'utilisateur n'est pas authentifié"
      );
    }
  };

  const testRefreshFlow = async () => {
    setLoading(true);
    addTestResult(
      "Test Flux Complet",
      true,
      "Début du test de reconnexion automatique",
      "1. Simulation d'un token expiré, 2. Appel API, 3. Refresh automatique"
    );

    // Étape 1: Simuler un token expiré
    simulateExpiredToken();

    // Étape 2: Faire un appel API qui devrait déclencher le refresh
    setTimeout(async () => {
      try {
        const response = await authenticatedGet("/users/me");
        addTestResult(
          "Test Flux Complet",
          true,
          "Reconnexion automatique réussie !",
          `L'appel API a réussi après refresh automatique. Utilisateur: ${response.data.user?.email || "Inconnu"}`
        );
      } catch (error) {
        addTestResult(
          "Test Flux Complet",
          false,
          "Échec de la reconnexion automatique",
          error.message
        );
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Test de Reconnexion Automatique
          <Badge variant="outline">Développement</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Boutons de test */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            onClick={testCurrentToken}
            variant="outline"
            size="sm"
          >
            Vérifier Token
          </Button>
          
          <Button
            onClick={testApiCall}
            disabled={loading}
            size="sm"
          >
            Test API Simple
          </Button>
          
          <Button
            onClick={testSubscriptionCall}
            disabled={loading}
            size="sm"
          >
            Test Subscription
          </Button>
          
          <Button
            onClick={simulateExpiredToken}
            variant="destructive"
            size="sm"
          >
            Simuler Expiration
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={testRefreshFlow}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Test en cours..." : "🔄 Test Complet de Reconnexion"}
          </Button>
          
          <Button
            onClick={clearResults}
            variant="outline"
          >
            Effacer
          </Button>
        </div>

        {/* Résultats des tests */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.map((result) => (
            <div
              key={result.id}
              className={`p-3 rounded-lg border ${
                result.success
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {result.success ? "✅" : "❌"} {result.test}
                </span>
                <span className="text-sm text-muted-foreground">
                  {result.timestamp}
                </span>
              </div>
              <p className="text-sm mt-1">{result.message}</p>
              {result.details && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {result.details}
                </p>
              )}
            </div>
          ))}
        </div>

        {testResults.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Aucun test effectué. Cliquez sur un bouton pour commencer.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenTestComponent;
