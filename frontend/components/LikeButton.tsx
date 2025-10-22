"use client";

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LikeButtonProps {
  contentType: 'article' | 'publication' | 'blog';
  contentId: string;
  userId?: string;
  showCounts?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LikeButton({
  contentType,
  contentId,
  userId,
  showCounts = true,
  size = 'md'
}: LikeButtonProps) {
  const [likeType, setLikeType] = useState<'like' | 'dislike' | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Charger le statut actuel et les stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le statut de like de l'utilisateur
        if (userId) {
          const statusResponse = await fetch(
            `${apiUrl}/likes/status?userId=${userId}&contentType=${contentType}&contentId=${contentId}`
          );
          const statusData = await statusResponse.json();
          setLikeType(statusData.likeType);
        }

        // Récupérer les statistiques
        if (showCounts) {
          const statsResponse = await fetch(
            `${apiUrl}/likes/stats?contentType=${contentType}&contentId=${contentId}`
          );
          const statsData = await statsResponse.json();
          setLikes(statsData.likes);
          setDislikes(statsData.dislikes);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des likes:', error);
      }
    };

    fetchData();
  }, [userId, contentType, contentId, apiUrl, showCounts]);

  const handleToggleLike = async (type: 'like' | 'dislike') => {
    if (!userId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour liker ce contenu",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/likes/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          contentType,
          contentId,
          likeType: type
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Mettre à jour l'état local
        if (data.action === 'removed') {
          setLikeType(null);
          if (type === 'like') setLikes(prev => Math.max(0, prev - 1));
          if (type === 'dislike') setDislikes(prev => Math.max(0, prev - 1));
        } else if (data.action === 'added') {
          setLikeType(type);
          if (type === 'like') setLikes(prev => prev + 1);
          if (type === 'dislike') setDislikes(prev => prev + 1);
        } else if (data.action === 'updated') {
          // Passer de like à dislike ou vice-versa
          const oldType = likeType;
          setLikeType(type);
          if (oldType === 'like' && type === 'dislike') {
            setLikes(prev => Math.max(0, prev - 1));
            setDislikes(prev => prev + 1);
          } else if (oldType === 'dislike' && type === 'like') {
            setDislikes(prev => Math.max(0, prev - 1));
            setLikes(prev => prev + 1);
          }
        }

        toast({
          title: data.action === 'removed' ? 'Réaction retirée' : 'Réaction ajoutée',
          description: data.message,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors du toggle like:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre réaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-2">
      {/* Bouton Like */}
      <Button
        variant={likeType === 'like' ? 'default' : 'outline'}
        size="sm"
        className={`${sizeClasses[size]} transition-all ${
          likeType === 'like'
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'hover:bg-green-50 hover:text-green-600 hover:border-green-300'
        }`}
        onClick={() => handleToggleLike('like')}
        disabled={loading || !userId}
      >
        <ThumbsUp className={`${iconSizes[size]} ${likeType === 'like' ? 'fill-current' : ''}`} />
        {showCounts && <span className="ml-1.5">{likes}</span>}
      </Button>

      {/* Bouton Dislike */}
      <Button
        variant={likeType === 'dislike' ? 'default' : 'outline'}
        size="sm"
        className={`${sizeClasses[size]} transition-all ${
          likeType === 'dislike'
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
        }`}
        onClick={() => handleToggleLike('dislike')}
        disabled={loading || !userId}
      >
        <ThumbsDown className={`${iconSizes[size]} ${likeType === 'dislike' ? 'fill-current' : ''}`} />
        {showCounts && <span className="ml-1.5">{dislikes}</span>}
      </Button>
    </div>
  );
}
