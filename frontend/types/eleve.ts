// Types partagés pour les composants élève

export interface SubjectStats {
  subject: string;
  totalExercises: number;
  correctAnswers: number;
  averageScore: number;
  progress: number;
  lastActivity?: string;
  exercisesCompleted: number;
}

export interface DailyStats {
  date: string;
  exercisesCompleted: number;
  averageScore: number;
}

export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

export interface UserStats {
  totalExercises: number;
  totalCorrect: number;
  averageScore: number;
  subjects: SubjectStats[];
  dailyStats: DailyStats[];
  categoryStats: CategoryStats[];
  subscriptionType: string;
}

export interface UserInfo {
  _id?: string;
  id?: string;
  prenom: string;
  nom: string;
  email: string;
  avatar?: string;
}

// Configuration des matières
export const SUBJECTS_CONFIG = {
  math: {
    name: "Mathématiques",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  french: {
    name: "Français",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  sciences: {
    name: "Sciences",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  art: {
    name: "Arts Plastiques",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  history: {
    name: "Histoire",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  geography: {
    name: "Géographie",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
  },
  language: {
    name: "Langues",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  technology: {
    name: "Technologie",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  music: {
    name: "Musique",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
  rapportHebdo: {
    name: "Rapport Hebdo",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
  revision: {
    name: "Révision",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  revisionErrors: {
    name: "Erreurs de Révision",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
} as const;

// Fonctions utilitaires
export const safeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const formatScore = (score: any): string => {
  const numScore = Number(score);
  return isNaN(numScore) ? "0.0" : numScore.toFixed(1);
};

export const getScoreColor = (score: number) => {
  if (score >= 90) return "success";
  if (score >= 70) return "primary";
  if (score >= 50) return "warning";
  return "danger";
};

export const getScoreEmoji = (score: number) => {
  if (score >= 90) return "🌟";
  if (score >= 70) return "😊";
  if (score >= 50) return "😐";
  return "😢";
};