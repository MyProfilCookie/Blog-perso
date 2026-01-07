/**
 * Hook personnalisé pour gérer le formulaire de contact
 */

import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ContactFormData } from "@/types/contact";
import { validateContactForm } from "@/lib/validators/contactValidator";
import { saveContactMessage } from "@/lib/services/contactService";

const MySwal = withReactContent(Swal);

interface UseContactFormReturn {
  loading: boolean;
  submitContactForm: (data: ContactFormData) => Promise<{ success: boolean }>;
}

/**
 * Hook pour gérer la soumission du formulaire de contact
 * @returns Objet contenant l'état loading et la fonction de soumission
 */
export const useContactForm = (): UseContactFormReturn => {
  const [loading, setLoading] = useState(false);

  const submitContactForm = async (
    data: ContactFormData
  ): Promise<{ success: boolean }> => {
    // Validation des données
    const validation = validateContactForm(data);
    
    if (!validation.isValid) {
      MySwal.fire({
        title: "Champs manquants",
        text: validation.error,
        icon: "warning",
        confirmButtonColor: "#F59E0B",
      });
      return { success: false };
    }

    setLoading(true);

    try {
      // Sauvegarder le message
      await saveContactMessage(data);

      // Afficher le message de succès
      MySwal.fire({
        title: "Message envoyé !",
        text: "Nous vous répondrons sous 24 à 48h.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      
      MySwal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de l'envoi. Réessayez plus tard.",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitContactForm,
  };
};
