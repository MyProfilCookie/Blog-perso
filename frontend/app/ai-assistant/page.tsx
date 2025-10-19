"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Stars,
  Brain,
  Lightbulb,
  Rocket,
  Heart,
  TrendingUp,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AIAssistantPremium from "@/components/AIAssistantPremium";
import { AutismLogo } from "@/components/icons";

export default function AIAssistantPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showStats, setShowStats] = useState(false);

  // Suivre la position de la souris pour les effets interactifs
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Afficher les stats après 1 seconde
    setTimeout(() => setShowStats(true), 1000);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Particules flottantes animées
  const floatingParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  // Stats IA
  const stats = [
    {
      icon: Brain,
      label: "Questions répondues",
      value: "10K+",
      color: "text-violet-600",
    },
    {
      icon: Heart,
      label: "Satisfaction",
      value: "98%",
      color: "text-pink-600",
    },
    {
      icon: TrendingUp,
      label: "Temps de réponse",
      value: "<2s",
      color: "text-purple-600",
    },
    { icon: Award, label: "Précision", value: "95%", color: "text-indigo-600" },
  ];

  // Messages d'encouragement rotatifs
  const encouragements = [
    "🎓 Pose-moi toutes tes questions !",
    "✨ Je suis là pour t'aider à apprendre",
    "🚀 Ensemble, rendons l'apprentissage fun !",
    "💡 Pas de question bête, seulement des réponses !",
    "🌟 Chaque question est une opportunité d'apprendre",
  ];

  const [currentEncouragement, setCurrentEncouragement] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEncouragement((prev) => (prev + 1) % encouragements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [encouragements.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Effet de gradient qui suit la souris */}
      <motion.div
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.2), transparent 80%)`,
        }}
        className="pointer-events-none fixed inset-0 opacity-30"
        transition={{ duration: 0.3 }}
      />

      {/* Particules flottantes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {floatingParticles.map((particle) => (
          <motion.div
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"
            key={particle.id}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header avec animations */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-violet-50 dark:hover:bg-violet-900/50 shadow-lg text-sm sm:text-base"
                  onPress={() => router.back()}
                  size="sm"
                  startContent={<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                  variant="flat"
                >
                  <span className="hidden sm:inline">Retour</span>
                  <span className="sm:hidden">←</span>
                </Button>
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600" />
              </motion.div>
            </div>

            {/* Titre principal avec animation */}
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-4 sm:mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 sm:mb-3">
                <AutismLogo
                  className="w-8 h-8 md:w-12 md:h-12 object-contain"
                  size={40}
                />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 tracking-tight">
                  Rencontre Alia
                </h1>
              </div>

              {/* Logo Autistudy */}
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center mb-3 sm:mb-4"
                initial={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
              >
                <motion.img
                  alt="Autistudy Logo"
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-2xl"
                  src="/uploads/logo.webp"
                  transition={{ type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium px-2"
                  exit={{ opacity: 0, y: -20 }}
                  initial={{ opacity: 0, y: 20 }}
                  key={currentEncouragement}
                  transition={{ duration: 0.5 }}
                >
                  {encouragements[currentEncouragement]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Stats interactives */}
            <AnimatePresence>
              {showStats && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"
                  exit={{ opacity: 0, y: -20 }}
                  initial={{ opacity: 0, y: 20 }}
                >
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        animate={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        key={stat.label}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-violet-200 dark:border-violet-800 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                          <CardBody className="text-center p-3 sm:p-4">
                            <Icon
                              className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 ${stat.color}`}
                            />
                            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                              {stat.value}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">
                              {stat.label}
                            </p>
                          </CardBody>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Badges interactifs */}
            <motion.div
              animate={{ opacity: 1 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 px-2"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: Brain, text: "IA Intelligente", color: "primary" },
                { icon: Zap, text: "Réponses rapides", color: "warning" },
                {
                  icon: Stars,
                  text: "Toujours disponible",
                  color: "secondary",
                },
                { icon: Lightbulb, text: "Pédagogique", color: "success" },
                { icon: Rocket, text: "Innovante", color: "danger" },
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0 }}
                    key={badge.text}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Chip
                      className="font-semibold shadow-md cursor-pointer text-xs sm:text-sm"
                      color={badge.color as any}
                      size="sm"
                      startContent={<Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                      variant="flat"
                    >
                      {badge.text}
                    </Chip>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Composant AI Assistant avec animation d'entrée */}
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
          >
            <AIAssistantPremium />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
