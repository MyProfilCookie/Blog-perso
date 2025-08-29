import React from "react";
import { Button } from '@nextui-org/react';
import { motion } from "framer-motion";

interface ReportHeaderProps {
  userName: string;
  selectedWeek: string;
  showWeeks: boolean;
  weeks: string[];
  onWeekSelect: (week: string) => void;
  toggleWeekList: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  userName,
  selectedWeek,
  showWeeks,
  weeks,
  onWeekSelect,
  toggleWeekList,
}) => {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
      initial={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-4">
        📝 Mon Rapport de la Semaine
      </h1>

      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className="text-lg text-gray-600 dark:text-gray-300 mb-6"
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {userName ? (
          <>Salut {userName} ! 👋 Prêt(e) à noter tes progrès de la semaine ?</>
        ) : (
          <>Chargement de ton profil...</>
        )}
      </motion.h2>

      {/* Sélecteur de semaine */}
      <div className="relative inline-block">
        <Button
          className="px-6 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-full hover:from-violet-600 hover:to-blue-600 transition-all duration-300"
          onClick={toggleWeekList}
        >
          {selectedWeek || "Sélectionner une semaine"} 📅
        </Button>

        {showWeeks && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-50 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-violet-200 dark:border-violet-700 max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: 10 }}
          >
            {weeks.map((week) => (
              <button
                key={week}
                className="w-full text-left px-4 py-2 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/30 text-gray-700 dark:text-gray-300"
                onClick={() => onWeekSelect(week)}
              >
                {week}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportHeader;
