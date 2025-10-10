"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const isSyncingRef = useRef(false); // Ref pour vérifier l'état de sync sans dépendance
  const hasAutoSyncedRef = useRef(false); // Ref pour éviter les re-sync

  // Fonction pour collecter toutes les données localStorage - mémorisée avec useCallback
  const collectLocalStorageData = useCallback(() => {
    const subjects = ['math', 'french', 'sciences', 'art', 'history', 'geography', 'language', 'music', 'technology'];
    const allSubjectsData: any = {};

    console.log('🔍 Début de la collecte des données localStorage...');

    subjects.forEach(subject => {
      const data: any = {};

      // Récupérer les exercices validés
      const validatedExercises = localStorage.getItem(`${subject}_validatedExercises`);
      if (validatedExercises) {
        try {
          const parsed = JSON.parse(validatedExercises);
          data.validatedExercises = parsed;
          console.log(`✅ ${subject}_validatedExercises:`, Object.keys(parsed).length, 'exercices');
        } catch (e) {
          console.warn(`❌ Erreur parsing validatedExercises pour ${subject}:`, e);
        }
      } else {
        console.log(`⚠️  Aucune donnée validatedExercises pour ${subject}`);
      }

      // Récupérer les résultats
      const results = localStorage.getItem(`${subject}_results`);
      if (results) {
        try {
          const parsed = JSON.parse(results);
          data.results = parsed;
          console.log(`✅ ${subject}_results:`, Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length, 'résultats');
        } catch (e) {
          console.warn(`❌ Erreur parsing results pour ${subject}:`, e);
        }
      } else {
        console.log(`⚠️  Aucune donnée results pour ${subject}`);
      }

      // Récupérer les réponses utilisateur
      const userAnswers = localStorage.getItem(`${subject}_userAnswers`);
      if (userAnswers) {
        try {
          const parsed = JSON.parse(userAnswers);
          data.userAnswers = parsed;
          console.log(`✅ ${subject}_userAnswers:`, Object.keys(parsed).length, 'réponses');
        } catch (e) {
          console.warn(`❌ Erreur parsing userAnswers pour ${subject}:`, e);
        }
      } else {
        console.log(`⚠️  Aucune donnée userAnswers pour ${subject}`);
      }

      // Récupérer les scores sauvegardés
      const scores = localStorage.getItem(`${subject}_scores`);
      if (scores) {
        try {
          const parsed = JSON.parse(scores);
          data.scores = parsed;
          console.log(`✅ ${subject}_scores:`, parsed);
        } catch (e) {
          console.warn(`❌ Erreur parsing scores pour ${subject}:`, e);
        }
      } else {
        console.log(`⚠️  Aucune donnée scores pour ${subject}`);
      }

      // Ajouter seulement si on a des données
      if (Object.keys(data).length > 0) {
        allSubjectsData[subject] = data;
        console.log(`📊 Données collectées pour ${subject}:`, Object.keys(data));
      } else {
        console.log(`❌ Aucune donnée trouvée pour ${subject}`);
      }
    });

    console.log('📈 Résumé de la collecte:', {
      totalSubjects: Object.keys(allSubjectsData).length,
      subjects: Object.keys(allSubjectsData)
    });

    return allSubjectsData;
  }, []); // Pas de dépendances car utilise uniquement localStorage

  // Fonction de synchronisation avec useCallback pour éviter les re-créations
  const syncStats = useCallback(async () => {
    if (isSyncingRef.current) {
      console.log('⏸️ Synchronisation déjà en cours, annulation');
      return;
    }
    
    try {
      isSyncingRef.current = true;
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
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [userId, onSyncComplete, collectLocalStorageData]); // Dépendances du useCallback (pas isSyncing)

  // Synchronisation automatique au chargement - UNE SEULE FOIS
  useEffect(() => {
    // Si on a déjà fait la synchronisation automatique, ne rien faire
    if (hasAutoSyncedRef.current) {
      console.log('✅ Synchronisation automatique déjà effectuée, skip');
      return;
    }

    const autoSync = async () => {
      console.log('🚀 useEffect StatsSync déclenché pour userId:', userId);
      
      if (!userId) {
        console.log('❌ Pas d\'userId, synchronisation annulée');
        hasAutoSyncedRef.current = true;
        return;
      }

      const lastSync = localStorage.getItem('lastStatsSync');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 heure

      console.log('⏰ Vérification de la synchronisation:', {
        lastSync,
        now,
        timeDiff: lastSync ? now - parseInt(lastSync) : 'N/A',
        shouldSync: !lastSync || (now - parseInt(lastSync)) > oneHour
      });

      // Synchroniser si c'est la première fois ou si plus d'1h s'est écoulée
      if (!lastSync || (now - parseInt(lastSync)) > oneHour) {
        console.log('🔄 Synchronisation automatique des statistiques...');
        await syncStats();
        localStorage.setItem('lastStatsSync', now.toString());
      } else {
        console.log('⏸️ Synchronisation non nécessaire (dernière sync récente)');
      }
      
      hasAutoSyncedRef.current = true; // Marquer comme vérifié dans tous les cas
    };

    autoSync();
  }, [userId, syncStats]); // userId et syncStats (syncStats est stable grâce à useCallback)

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
