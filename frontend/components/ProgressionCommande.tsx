import React, { useEffect, useState } from "react";

/**
 * Composant de suivi de progression des commandes avec thème crème
 * @param {Object} props
 * @param {string} props.statut - Statut actuel de la commande
 */
const ProgressionCommande = ({ statut }: { statut: string }) => {
  // Définition des statuts avec palette de couleurs crème
  const statutsCommande = [
    {
      cle: "Pending",
      libelle: "Enregistrement",
      valeur: 25,
      couleur: "#6366F1", // Indigo plus doux
      couleurDark: "#818CF8",
      bgLight: "#EEF2FF",
      bgDark: "#4338CA",
    },
    {
      cle: "Processing",
      libelle: "Préparation",
      valeur: 50,
      couleur: "#8B5CF6", // Violet
      couleurDark: "#A78BFA",
      bgLight: "#F3F0FF",
      bgDark: "#6D28D9",
    },
    {
      cle: "Shipped",
      libelle: "Expédition",
      valeur: 75,
      couleur: "#DB2777", // Rose plus foncé
      couleurDark: "#EC4899",
      bgLight: "#FCE7F3",
      bgDark: "#BE185D",
    },
    {
      cle: "Delivered",
      libelle: "Livraison",
      valeur: 100,
      couleur: "#059669", // Émeraude plus foncé
      couleurDark: "#10B981",
      bgLight: "#ECFDF5",
      bgDark: "#065F46",
    },
  ];

  // Map status strings to standardized keys (both frontend and backend formats)
  const mapStatuts = {
    // Frontend to backend
    Enregistree: "Pending",
    Validee: "Processing",
    Preparation: "Processing",
    Expedition: "Shipped",
    Livree: "Delivered",

    // Backend values (no mapping needed)
    Pending: "Pending",
    Processing: "Processing",
    Shipped: "Shipped",
    Delivered: "Delivered",

    // Aliases in English/French
    "En cours": "Processing",
    Processed: "Processing",
    Expédiée: "Shipped",
    Livrée: "Delivered",
    Enregistrée: "Pending",
    Validée: "Processing",
    Validated: "Processing",
  };

  // Get normalized status key
  const statutNormalise =
    mapStatuts[statut as keyof typeof mapStatuts] || "Pending";

  // Find corresponding status object
  const statutActuel =
    statutsCommande.find((s) => s.cle === statutNormalise) ||
    statutsCommande[0];

  // Calculate current progression value
  const valeurProgression = statutActuel.valeur;

  // Find the current stage color
  const currentColor = statutActuel.couleur;
  const currentColorDark = statutActuel.couleurDark;

  // State for animated progress value
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress on mount and when it changes
  useEffect(() => {
    setAnimatedProgress(0);
    const timer = setTimeout(() => {
      setAnimatedProgress(valeurProgression);
    }, 300);

    return () => clearTimeout(timer);
  }, [valeurProgression]);

  // Get all stage colors up to the current stage
  const getStageColors = () => {
    const currentIndex = statutsCommande.findIndex(
      (s) => s.cle === statutNormalise,
    );

    return statutsCommande.filter((_, index) => index <= currentIndex);
  };

  const activeStages = getStageColors();

  return (
    <div className="w-full my-4">
      <div className="flex justify-between mb-2 text-sm">
        {statutsCommande.map((s, index) => {
          // Dynamic status styling based on completion
          const isActive = valeurProgression >= s.valeur;
          const isCurrentStage = s.cle === statutNormalise;

          return (
            <div
              key={s.cle}
              className="relative transition-all duration-300 px-1 text-center"
            >
              {/* Circle indicator */}
              <div
                className={`w-5 h-5 rounded-full mx-auto mb-1 transition-all duration-500 ${
                  isActive
                    ? "transform scale-110"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: s.couleur,
                        boxShadow: `0 0 0 3px ${s.bgLight}`,
                      }
                    : {}
                }
              >
                {isActive && (
                  <div className="flex items-center justify-center w-full h-full">
                    <svg
                      className="h-3 w-3 text-white dark:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Status label */}
              <div
                className={`transition-all duration-300 ${
                  isActive
                    ? "font-medium dark:font-semibold"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                style={
                  isActive
                    ? {
                        color: s.couleur,
                      }
                    : {}
                }
              >
                {s.libelle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar container */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#F5EEE1] dark:bg-[#4A3F2C] mt-4">
        {/* Segmented progress bar */}
        <div className="flex h-full">
          {activeStages.map((stage, index) => {
            const previousValue =
              index === 0 ? 0 : statutsCommande[index - 1].valeur;
            const segmentWidth = stage.valeur - previousValue;

            // Only show segments up to the animated progress
            if (previousValue >= animatedProgress) return null;

            // Calculate how much of this segment to show
            const segmentProgress =
              index === activeStages.length - 1
                ? Math.min(animatedProgress - previousValue, segmentWidth)
                : segmentWidth;

            const percentWidth = (segmentProgress / segmentWidth) * 100;

            return (
              <div
                key={stage.cle}
                className="h-full transition-all duration-1000 ease-out relative"
                style={{
                  width: `${(segmentWidth / 100) * 100}%`,
                  backgroundColor: stage.couleur,
                  clipPath: `inset(0 ${100 - percentWidth}% 0 0)`,
                }}
              >
                {/* Only add pulsing effect to current stage */}
                {index === activeStages.length - 1 && percentWidth < 100 && (
                  <div
                    className="absolute top-0 right-0 h-full w-8 animate-pulse-slow"
                    style={{
                      background: `linear-gradient(to right, transparent, ${stage.couleur})`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <p className="text-xs font-medium" style={{ color: currentColor }}>
          {statutActuel.libelle}
        </p>
        <p className="text-xs font-medium" style={{ color: currentColor }}>
          {animatedProgress}%
        </p>
      </div>

      {/* Add custom animation keyframes */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProgressionCommande;
