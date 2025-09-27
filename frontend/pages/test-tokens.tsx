/**
 * Page de test pour le système de gestion des tokens
 * Accessible uniquement en développement
 */

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTokenManager } from '@/hooks/useTokenManager';
import { useRouter } from 'next/router';

export default function TestTokensPage() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [logs, setLogs] = useState([]);
  const { checkTokenExpiration, refreshToken, handleExpiredToken, isTokenExpired } = useTokenManager();
  const router = useRouter();

  // Ne pas afficher en production
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p>Cette page n'est accessible qu'en mode développement.</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const checkToken = () => {
    const token = localStorage.getItem('userToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const isExpired = isTokenExpired(token);
    
    setTokenInfo({
      token: token ? `${token.substring(0, 20)}...` : 'Aucun token',
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Aucun refresh token',
      isExpired,
      timestamp: new Date().toLocaleString()
    });

    addLog(`Token vérifié - Expiré: ${isExpired ? 'Oui' : 'Non'}`, isExpired ? 'error' : 'success');
  };

  const testRefresh = async () => {
    addLog('Tentative de rafraîchissement du token...', 'info');
    const success = await refreshToken(true);
    addLog(`Refresh ${success ? 'réussi' : 'échoué'}`, success ? 'success' : 'error');
  };

  const testExpiration = async () => {
    addLog('Test d\'expiration de token...', 'warning');
    await handleExpiredToken(true);
  };

  const simulateExpiredToken = () => {
    // Simuler un token expiré en modifiant le localStorage
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        payload.exp = Math.floor(Date.now() / 1000) - 3600; // Expiré il y a 1 heure
        const newToken = btoa(JSON.stringify(payload));
        localStorage.setItem('userToken', newToken);
        addLog('Token simulé comme expiré', 'warning');
        checkToken();
      } catch (error) {
        addLog('Erreur lors de la simulation: ' + error.message, 'error');
      }
    } else {
      addLog('Aucun token à simuler', 'error');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔧 Test du Système de Tokens
              <Badge variant="secondary">Développement</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Cette page permet de tester le système de gestion des tokens et des notifications d'expiration.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations sur le token */}
          <Card>
            <CardHeader>
              <CardTitle>État du Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tokenInfo && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Token:</span>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {tokenInfo.token}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Refresh Token:</span>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {tokenInfo.refreshToken}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Expiré:</span>
                    <Badge variant={tokenInfo.isExpired ? 'destructive' : 'default'}>
                      {tokenInfo.isExpired ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Vérifié:</span>
                    <span className="text-sm text-gray-500">{tokenInfo.timestamp}</span>
                  </div>
                </div>
              )}
              
              <Button onClick={checkToken} className="w-full">
                Vérifier Token
              </Button>
            </CardContent>
          </Card>

          {/* Actions de test */}
          <Card>
            <CardHeader>
              <CardTitle>Actions de Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={testRefresh} className="w-full">
                Tester Refresh
              </Button>
              <Button onClick={simulateExpiredToken} variant="outline" className="w-full">
                Simuler Token Expiré
              </Button>
              <Button onClick={testExpiration} variant="destructive" className="w-full">
                Tester Expiration
              </Button>
              <Button onClick={() => router.push('/')} variant="secondary" className="w-full">
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Logs */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Logs</CardTitle>
            <Button onClick={clearLogs} size="sm" variant="outline">
              Effacer
            </Button>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun log pour le moment</p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`text-xs p-2 rounded ${
                      log.type === 'error'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        : log.type === 'success'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : log.type === 'warning'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span className="font-mono text-xs text-gray-500">{log.timestamp}</span>
                    <span className="ml-2">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
