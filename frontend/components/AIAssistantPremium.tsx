"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Button, Chip, Avatar } from "@nextui-org/react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  Zap, 
  Stars, 
  MessageCircle,
  Loader2,
  Brain,
  Lightbulb,
  Rocket
} from "lucide-react";
import { toast } from "sonner";
import AICharacter from "./AICharacter";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIAssistantPremium: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Salut ! Je suis Alia, ton assistante IA personnelle AutiStudy. Je suis là pour t'aider avec tes leçons, répondre à tes questions et t'accompagner dans ton apprentissage. Ensemble, on va rendre l'éducation plus fun et accessible ! 🚀",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      // Utiliser setTimeout pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: smooth ? "smooth" : "auto",
          block: "end"
        });
      }, 100);
    }
  };

  useEffect(() => {
    // Scroller uniquement si un nouveau message a été ajouté
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages]);

  // Forcer le scroll après chaque rendu
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Gérer le scroll du conteneur lors du focus sur mobile
  useEffect(() => {
    const handleFocus = () => {
      // Attendre que le clavier s'ouvre
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        }
      }, 300);
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
      }
    };
  }, []);

  const getAIResponse = async (userMessage: string) => {
    try {
      const context = `Tu es Alia, une assistante IA bienveillante et encourageante pour AutiStudy, une plateforme d'apprentissage pour enfants autistes. 
      Tu es enthousiaste, patiente et utilises parfois des emojis pour rendre la conversation plus chaleureuse.
      Réponds de manière claire, simple et structurée. Utilise des listes à puces si nécessaire.
      Sois toujours positive et encourage l'utilisateur.
      Question de l'utilisateur: ${userMessage}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: context }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la communication avec l'IA");
      }

      const data = await response.json();

      if (!data.reply || data.reply.trim() === "") {
        return "🤔 Hmm, je ne suis pas sûre d'avoir bien compris. Peux-tu reformuler ta question d'une autre manière ?";
      }

      return data.reply;
    } catch (error) {
      console.error("Erreur IA:", error);
      toast.error("Oups ! Je n'ai pas pu traiter ta demande. Réessaie dans un instant ! 😊");
      return "😔 Désolée, j'ai rencontré un petit problème technique. Peux-tu réessayer ?";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Empêcher le scroll lors de la soumission
    if (inputRef.current) {
      inputRef.current.blur();
    }

    // Ajouter le message utilisateur
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setIsTyping(true);
    
    // Scroller immédiatement après l'ajout du message utilisateur
    setTimeout(() => scrollToBottom(), 100);

    try {
      // Simuler un délai de "réflexion"
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const aiResponse = await getAIResponse(userMessage);
      
      // Simuler un délai de "frappe"
      await new Promise(resolve => setTimeout(resolve, 300));

      const newAIMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAIMessage]);
      
      // Scroller après l'ajout de la réponse de l'IA
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      toast.error("Une erreur est survenue 😔");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const suggestedQuestions = [
    { text: "Comment puis-je mieux apprendre ?", icon: Brain },
    { text: "Donne-moi des astuces d'étude", icon: Lightbulb },
    { text: "Parle-moi d'AutiStudy", icon: Rocket },
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="w-full bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-violet-950 dark:to-purple-950 border-2 border-violet-200 dark:border-violet-800 shadow-2xl overflow-hidden">
        <CardBody className="p-0 flex flex-col">
          {/* Header avec animation */}
          <motion.div
            className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Effet de particules animées */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                  animate={{
                    x: [Math.random() * 100, Math.random() * 100],
                    y: [Math.random() * 100, Math.random() * 100],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <AICharacter
                    size="medium"
                    isTyping={isLoading}
                    isHappy={!isLoading && messages.length > 1}
                    className="drop-shadow-lg w-12 h-12 sm:w-16 sm:h-16"
                  />
                </motion.div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-1 sm:gap-2">
                    Alia
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                    </motion.div>
                  </h2>
                  <p className="text-violet-100 font-light flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    Assistante IA AutiStudy
                  </p>
                </div>
              </div>
              <Chip
                startContent={<Stars className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="bg-white/20 text-white font-semibold backdrop-blur-sm text-xs sm:text-sm"
                size="sm"
              >
                <span className="hidden sm:inline">En ligne</span>
                <span className="sm:hidden">●</span>
              </Chip>
            </div>
          </motion.div>

          {/* Zone de messages */}
          <div className="h-[500px] sm:h-[600px] md:h-[600px] lg:h-[700px] overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {message.role === "assistant" && (
                      <Avatar
                        icon={<Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                        className="bg-gradient-to-br from-violet-600 to-purple-600 text-white w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                        size="sm"
                      />
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 sm:p-4 rounded-2xl shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-violet-200 dark:border-violet-800"
                      }`}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 ${message.role === "user" ? "text-violet-100" : "text-gray-500 dark:text-gray-400"}`}>
                        {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </motion.div>
                    {message.role === "user" && (
                      <Avatar
                        className="bg-gradient-to-br from-pink-500 to-purple-500 text-white w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                        size="sm"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Indicateur de frappe */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 sm:gap-3"
              >
                <Avatar
                  icon={<Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="bg-gradient-to-br from-violet-600 to-purple-600 text-white w-8 h-8 sm:w-10 sm:h-10"
                  size="sm"
                />
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-lg border border-violet-200 dark:border-violet-800">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-violet-600 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Questions suggérées */}
          {messages.length === 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-violet-50/50 dark:bg-gray-800/50 border-t border-violet-200 dark:border-violet-800"
            >
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 font-medium flex items-center gap-2">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-violet-600" />
                Questions suggérées :
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => {
                  const Icon = question.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuggestedQuestion(question.text)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-800 rounded-full text-xs sm:text-sm text-violet-600 dark:text-violet-400 border border-violet-300 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950 transition-colors flex items-center gap-1.5 sm:gap-2 font-medium"
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">{question.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Zone de saisie */}
          <div className="sticky bottom-0 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-violet-100/50 via-purple-100/50 to-pink-100/50 dark:from-gray-800/50 dark:via-violet-900/50 dark:to-purple-900/50 border-t border-violet-200 dark:border-violet-800 backdrop-blur-md">
            <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pose-moi une question..."
                disabled={isLoading}
                className="flex-1 px-3 sm:px-4 md:px-5 py-3 sm:py-3.5 md:py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-violet-300 dark:border-violet-700 focus:border-violet-600 dark:focus:border-violet-500 focus:outline-none text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-lg transition-all disabled:opacity-50"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-12 sm:h-13 md:h-14 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg disabled:opacity-50 text-sm sm:text-base"
                  startContent={
                    isLoading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    )
                  }
                >
                  <span className="hidden sm:inline">Envoyer</span>
                  <span className="sm:hidden">OK</span>
                </Button>
              </motion.div>
            </form>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AIAssistantPremium;

