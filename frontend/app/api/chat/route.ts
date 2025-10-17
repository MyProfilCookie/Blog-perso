import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Le prompt est requis et doit être une chaîne de caractères" },
        { status: 400 }
      );
    }

    // Utiliser l'API Groq (gratuite et rapide) si disponible, sinon simulation
    const apiKey = process.env.GROQ_API_KEY;
    
    // Debug logs
    console.log("GROQ_API_KEY présente:", !!apiKey);
    console.log("Longueur de la clé:", apiKey?.length || 0);
    
    if (apiKey) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "Tu es Alia, une assistante IA bienveillante et encourageante pour AutiStudy, une plateforme d'apprentissage pour enfants autistes. Tu es enthousiaste, patiente et utilises parfois des emojis pour rendre la conversation plus chaleureuse. Réponds de manière claire, simple et structurée. Utilise des listes à puces si nécessaire. Sois toujours positive et encourage l'utilisateur. Réponds en français."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const reply = data.choices?.[0]?.message?.content || "";
          
          console.log("✅ Réponse Groq réussie");
          
          return NextResponse.json({
            reply: reply,
            timestamp: new Date().toISOString(),
            source: "groq"
          });
        } else {
          console.error("❌ Groq API erreur HTTP:", groqResponse.status, await groqResponse.text());
        }
      } catch (groqError) {
        console.error("❌ Erreur Groq API:", groqError);
        // Continue avec la simulation en cas d'erreur
      }
    } else {
      console.log("⚠️ Aucune clé API Groq trouvée, utilisation de la simulation");
    }

    // Simulation de réponse IA (fallback)
    const aiResponses = [
      "🎓 Excellente question ! Pour mieux apprendre, je te conseille de diviser tes sessions d'étude en petits blocs de 25 minutes avec des pauses. C'est ce qu'on appelle la technique Pomodoro ! 🍅",
      "💡 Voici quelques astuces : \n1. Crée des fiches résumées colorées 🌈\n2. Explique ce que tu apprends à quelqu'un d'autre 👥\n3. Utilise des mnémoniques pour mémoriser 🧠\n4. Pratique régulièrement plutôt que de réviser au dernier moment ⏰",
      "🚀 AutiStudy est une plateforme éducative spécialement conçue pour rendre l'apprentissage accessible et agréable pour tous les enfants, notamment ceux avec autisme. Nous proposons des ressources, des outils et un accompagnement personnalisé !",
      "📚 C'est une super question ! L'important est de trouver la méthode qui te convient le mieux. Chaque personne apprend différemment, et c'est tout à fait normal ! 🌟",
      "✨ Je suis là pour t'aider ! N'hésite pas à me poser d'autres questions. Ensemble, on va rendre l'apprentissage plus fun et efficace ! 💪",
      "🎯 Pour mieux comprendre un concept difficile, essaie de le dessiner ou de créer un schéma. Les représentations visuelles aident énormément le cerveau à intégrer l'information ! 🎨",
      "🌟 Super initiative de vouloir améliorer tes méthodes d'apprentissage ! La clé, c'est la régularité et la patience. Chaque petit progrès compte ! 🎉",
      "🧩 Si tu rencontres des difficultés, décompose le problème en petites parties. C'est comme un puzzle : on avance pièce par pièce ! Et n'oublie pas de célébrer tes réussites ! 🎊",
    ];

    // Analyse basique du prompt pour choisir une réponse appropriée
    const lowerPrompt = prompt.toLowerCase();
    let response = "";

    if (lowerPrompt.includes("apprendre") || lowerPrompt.includes("apprentissage")) {
      response = aiResponses[0];
    } else if (lowerPrompt.includes("astuce") || lowerPrompt.includes("conseil")) {
      response = aiResponses[1];
    } else if (lowerPrompt.includes("autistudy") || lowerPrompt.includes("plateforme")) {
      response = aiResponses[2];
    } else if (lowerPrompt.includes("difficile") || lowerPrompt.includes("problème")) {
      response = aiResponses[7];
    } else if (lowerPrompt.includes("méthode") || lowerPrompt.includes("technique")) {
      response = aiResponses[6];
    } else {
      // Réponse aléatoire parmi les réponses génériques
      const genericResponses = [aiResponses[3], aiResponses[4], aiResponses[5]];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }

    // Simuler un délai de traitement pour rendre l'expérience plus réaliste
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      reply: response,
      timestamp: new Date().toISOString(),
      source: "simulation"
    });
  } catch (error) {
    console.error("Erreur dans l'API chat:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande" },
      { status: 500 }
    );
  }
}

// Méthode GET pour vérifier que l'API fonctionne
export async function GET() {
  return NextResponse.json({
    message: "API Chat AutiStudy - Utilisez POST avec un 'prompt' dans le body",
    status: "online",
    version: "1.0.0",
  });
}

