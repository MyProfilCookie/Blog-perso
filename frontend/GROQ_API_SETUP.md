# Configuration de l'API Groq pour l'Assistant IA

## Pourquoi Groq ?

Groq offre une API **100% GRATUITE** avec des modèles IA puissants et ultra-rapides (comme Llama 3.1).

## Étapes pour obtenir une clé API Groq

1. **Créer un compte Groq** :
   - Allez sur : https://console.groq.com/
   - Cliquez sur "Sign Up" et créez un compte (gratuit)

2. **Obtenir votre clé API** :
   - Une fois connecté, allez dans "API Keys"
   - Cliquez sur "Create API Key"
   - Donnez-lui un nom (par exemple : "AutiStudy")
   - Copiez la clé générée

3. **Configurer la clé dans votre projet** :

   ### Pour le développement local :
   Ajoutez cette ligne dans votre fichier `.env.local` :
   ```
   GROQ_API_KEY=votre_cle_api_ici
   ```

   ### Pour Vercel (production) :
   - Allez sur votre dashboard Vercel : https://vercel.com/
   - Sélectionnez votre projet "autistudy"
   - Allez dans "Settings" > "Environment Variables"
   - Ajoutez une nouvelle variable :
     - **Name** : `GROQ_API_KEY`
     - **Value** : Collez votre clé API Groq
     - **Environnement** : Cochez "Production", "Preview", et "Development"
   - Cliquez sur "Save"
   - **Redéployez** votre application pour appliquer les changements

4. **Redémarrer votre application** :
   - Localement : Redémarrez votre serveur Next.js
   - Sur Vercel : L'application se redéploiera automatiquement

## Vérification

Une fois configuré, l'assistant IA utilisera Groq au lieu des réponses simulées. Vous verrez dans les réponses que l'IA est beaucoup plus intelligente et capable de répondre à n'importe quelle question !

## Limites gratuites de Groq

- **30 requêtes par minute**
- **14 400 requêtes par jour**
- **Plus que suffisant pour AutiStudy !** 🎉

## Fallback

Si la clé API n'est pas configurée ou si Groq est indisponible, l'assistant utilisera automatiquement des réponses simulées intelligentes.

## Support

En cas de problème, consultez la documentation Groq : https://console.groq.com/docs

