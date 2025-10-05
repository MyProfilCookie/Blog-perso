"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AIAssistantPremium from "@/components/AIAssistantPremium";

export default function AIAssistantPage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-violet-950 dark:to-purple-950 py-8 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Button
            variant="flat"
            startContent={<ArrowLeft className="w-5 h-5" />}
            onPress={() => router.back()}
            className="bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/50"
          >
            Retour
          </Button>
        </motion.div>

        {/* Composant AI Assistant */}
        <AIAssistantPremium />
      </div>
    </motion.div>
  );
}

