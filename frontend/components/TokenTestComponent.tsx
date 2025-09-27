/**
 * Composant de test pour vérifier le système de gestion des tokens
 * À utiliser uniquement en développement
 */

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTokenManager } from '@/hooks/useTokenManager';

export const TokenTestComponent = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const { checkTokenExpiration, refreshToken, handleExpiredToken, isTokenExpired } = useTokenManager();

  const checkToken = () => {
    const token = localStorage.getItem('userToken');
    const isExpired = isTokenExpired(token);
    
    setTokenInfo({
      token: token ? `${token.substring(0, 20)}...` : 'Aucun token',
      isExpired,
      timestamp: new Date().toLocaleString()
    });
  };

  const testRefresh = async () => {
    const success = await refreshToken(true);
    console.log('Refresh result:', success);
  };

  const testExpiration = async () => {
    await handleExpiredToken(true);
  };

  // Ne pas afficher en production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 shadow-lg z-50">
      <CardHeader>
        <CardTitle className="text-sm">🔧 Test Tokens (Dev)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={checkToken} size="sm" className="w-full">
          Vérifier Token
        </Button>
        <Button onClick={testRefresh} size="sm" className="w-full">
          Tester Refresh
        </Button>
        <Button onClick={testExpiration} size="sm" variant="destructive" className="w-full">
          Tester Expiration
        </Button>
        
        {tokenInfo && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            <p><strong>Token:</strong> {tokenInfo.token}</p>
            <p><strong>Expiré:</strong> {tokenInfo.isExpired ? 'Oui' : 'Non'}</p>
            <p><strong>Vérifié:</strong> {tokenInfo.timestamp}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenTestComponent;
