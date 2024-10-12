/* eslint-disable prettier/prettier */
import React from "react";
import { motion } from "framer-motion";

// Couleurs chaudes pour l'animation
const warmColors = ["#FF6F61", "#FFB74D", "#FFD54F", "#FF8A65", "#FFA726"];

const LoadingAnimation: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center justify-center space-x-4"
                initial={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                {warmColors.map((color, index) => (
                    <motion.div
                        key={index}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 0.5,
                            delay: index * 0.2,
                        }}
                    />
                ))}
            </motion.div>
            <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="ml-4"
                initial={{ opacity: 0, x: -20 }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                }}
            >
                <p className="text-2xl font-bold text-orange-600">
                    Chargement en cours...
                </p>
            </motion.div>
        </div>
    );
};

export default LoadingAnimation;
