"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface StatsSyncProps {
  userId: string;
  onSyncComplete?: (stats: any) => void;
}

const StatsSync: React.FC<StatsSyncProps> = ({ userId, onSyncComplete }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  // Fonction pour collecter toutes les données localStorage
  const collectLocalStorageData = () => {
    const subjects = ['math', 'french', 'sciences', 'art', 'history', 'geography'];
    const allSubjectsData: any = {};

    subjects.forEach(subject => {
      const data: any = {};

      // Récupérer les exercices validés
      const validatedExercises = localStorage.getItem(`${subject}_validatedExercises`);
      if (validatedExercises) {
        try {
          data.validatedExercises = JSON.parse(validatedExercises);
        } catch (e) {
          console.warn(`Erreur parsing validatedExercises pour ${subject}:`, e);
        }
      }

      // Récupérer les résultats
      const results = localStorage.getItem(`${subject}_results`);
      if (results) {
        try {
          data.results = JSON.parse(results);
        } catch (e) {
          console.warn(`Erreur parsing results pour ${subject}:`, e);
        }
      }

      // Récupérer les réponses utilisateur
      const userAnswers = localStorage.getItem(`${subject}_userAnswers`);
      if (userAnswers) {
        try {
          data.userAnswers = JSON.parse(userAnswers);
        } catch (e) {
          console.warn(`Erreur parsing userAnswers pour ${subject}:`, e);
        }
      }

      // Récupérer les scores sauvegardés
      const scores = localStorage.getItem(`${subject}_scores`);
      if (scores) {
        try {
          data.scores = JSON.parse(scores);
        } catch (e) {
          console.warn(`Erreur parsing scores pour ${subject}:`, e);
        }
      }

      // Ajouter seulement si on a des données
      if (Object.keys(data).length > 0) {
        allSubjectsData[subject] = data;
      }
    });

    return allSubjectsData;
  };

  // Fonction de synchronisation
  const syncStats = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus('idle');
      setSyncMessage('');

      console.log('🔄 Début de la synchronisation des statistiques...');

      // 1. Collecter les données localStorage
      const allSubjectsData = collectLocalStorageData();
      console.log('📊 Données collectées:', Object.keys(allSubjectsData));

      if (Object.keys(allSubjectsData).length === 0) {
        setSyncMessage('Aucune donnée à synchroniser');
        setSyncStatus('idle');
        setIsSyncing(false);
        return;
      }

      // 2. Récupérer le token
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      // 3. Synchroniser avec le serveur
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/eleves/sync-localStorage/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ allSubjectsData })
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Synchronisation réussie:', result);

      // 4. Récupérer les nouvelles statistiques
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/eleves/complete-stats/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const newStats = await statsResponse.json();
        console.log('📈 Nouvelles statistiques:', newStats);
        
        if (onSyncComplete) {
          onSyncComplete(newStats);
        }
      }

      setSyncMessage(`Synchronisation réussie: ${result.stats?.totalExercises || 0} exercices`);
      setSyncStatus('success');

    } catch (error: any) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      setSyncMessage(`Erreur: ${error.message}`);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Synchronisation automatique au chargement
  useEffect(() => {
    const autoSync = async () => {
      const lastSync = localStorage.getItem('lastStatsSync');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 heure

      // Synchroniser si c'est la première fois ou si plus d'1h s'est écoulée
      if (!lastSync || (now - parseInt(lastSync)) > oneHour) {
        console.log('🔄 Synchronisation automatique des statistiques...');
        await syncStats();
        localStorage.setItem('lastStatsSync', now.toString());
      }
    };

    autoSync();
  }, [userId]);

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'success':
        return <FontAwesomeIcon icon={faCheck} className="text-green-500" />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faSync} className={isSyncing ? "animate-spin" : ""} />;
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        color={getStatusColor()}
        variant="flat"
        onClick={syncStats}
        isLoading={isSyncing}
        startContent={!isSyncing ? getStatusIcon() : undefined}
      >
        {isSyncing ? 'Synchronisation...' : 'Synchroniser'}
      </Button>
      
      {syncMessage && (
        <span className={`text-sm ${
          syncStatus === 'success' ? 'text-green-600' : 
          syncStatus === 'error' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {syncMessage}
        </span>
      )}
    </div>
  );
};

export default StatsSync;
