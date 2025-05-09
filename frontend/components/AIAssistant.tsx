"use client";

import React, { useState } from "react";
import { Loader2, Send, Bot } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis ton assistant d'apprentissage. Je peux t'aider à comprendre tes leçons, répondre à tes questions et t'accompagner dans ton parcours éducatif. Comment puis-je t'aider aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAIResponse = async (userMessage: string) => {
    try {
      // Préparation du contexte pour l'IA
      const context = `Tu es un assistant éducatif spécialisé dans l'aide aux enfants autistes. 
      Réponds de manière claire, simple et bienveillante. 
      Utilise des phrases courtes et évite le jargon complexe.
      Sois patient et encourageant.
      Si tu ne comprends pas une question, demande poliment des précisions.
      Question de l'utilisateur: ${userMessage}`;

      console.log("Clé API Hugging Face :", process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-small",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: context }),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la communication avec l'IA");
      }

      const data = await response.json();
      
      // Si la réponse est vide ou invalide, on renvoie un message par défaut
      if (!data.generated_text || data.generated_text.trim() === "") {
        return "Je ne suis pas sûr de comprendre ta question. Peux-tu la reformuler différemment ?";
      }

      return data.generated_text;
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Désolé, je n'ai pas pu traiter ta demande. Essaie à nouveau dans quelques instants.");
      return "Je suis désolé, je n'ai pas pu traiter ta demande. Peux-tu réessayer ?";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-violet-600" />
        <h2 className="text-xl font-semibold text-violet-600 dark:text-violet-400">
          Assistant d&apos;apprentissage
        </h2>
      </div>

      <div className="h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
          </div>
        )}
      </div>

      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          className="flex-1"
          disabled={isLoading}
          placeholder="Pose ta question ici..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className="bg-violet-600 hover:bg-violet-700"
          disabled={isLoading || !input.trim()}
          type="submit"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>
    </Card>
  );
};

export default AIAssistant;
