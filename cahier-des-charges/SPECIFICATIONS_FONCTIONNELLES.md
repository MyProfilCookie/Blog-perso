# SPÉCIFICATIONS FONCTIONNELLES - SITEBLOG

## 👤 GESTION DES UTILISATEURS

### 1.1 Authentification
**Inscription d'un nouvel utilisateur**
- **Acteur** : Visiteur
- **Prérequis** : Aucun
- **Scénario principal** :
  1. L'utilisateur accède à la page d'inscription
  2. Il saisit : email, mot de passe, confirmation mot de passe, prénom, nom
  3. Le système valide les données (email unique, mot de passe fort)
  4. Un compte est créé avec le rôle "étudiant" par défaut
  5. Un email de confirmation est envoyé
- **Scénarios alternatifs** :
  - Email déjà utilisé → Message d'erreur
  - Mot de passe faible → Suggestions d'amélioration
- **Postconditions** : Compte créé, utilisateur connecté

**Connexion utilisateur**
- **Acteur** : Utilisateur enregistré
- **Prérequis** : Compte existant
- **Scénario principal** :
  1. L'utilisateur saisit email et mot de passe
  2. Le système vérifie les identifiants
  3. Un token JWT est généré
  4. L'utilisateur est redirigé vers son dashboard
- **Scénarios alternatifs** :
  - Identifiants incorrects → Message d'erreur
  - Compte non confirmé → Lien de renvoi d'email
- **Postconditions** : Utilisateur connecté, session active

### 1.2 Gestion des profils
**Modification du profil**
- **Acteur** : Utilisateur connecté
- **Fonctionnalités** :
  - Modification des informations personnelles
  - Upload d'avatar (formats : JPG, PNG, max 2MB)
  - Préférences d'apprentissage
  - Paramètres de notification
  - Changement de mot de passe

### 1.3 Système de rôles
**Rôles disponibles** :
- **Étudiant** : Accès aux cours, quiz, suivi de progression
- **Enseignant** : Création de contenu, suivi des élèves, analytics
- **Administrateur** : Gestion globale, modération, configuration

---

## 📚 SYSTÈME ÉDUCATIF

### 2.1 Quiz interactifs
**Création d'un quiz (Enseignant/Admin)**
- **Acteur** : Enseignant ou Administrateur
- **Prérequis** : Rôle approprié
- **Scénario principal** :
  1. Accès à l'interface de création
  2. Saisie des métadonnées : titre, description, catégorie, difficulté
  3. Ajout des questions (min 5, max 50)
  4. Pour chaque question :
     - Énoncé de la question
     - 2 à 6 options de réponse
     - Sélection de la bonne réponse
     - Explication optionnelle
  5. Prévisualisation du quiz
  6. Publication ou sauvegarde en brouillon

**Types de questions supportés** :
- Questions à choix multiples (QCM)
- Vrai/Faux
- Questions à réponse courte
- Questions d'association
- Questions à trous

**Passage d'un quiz (Étudiant)**
- **Acteur** : Étudiant
- **Prérequis** : Quiz publié
- **Scénario principal** :
  1. Sélection d'un quiz depuis la bibliothèque
  2. Affichage des informations (durée, difficulté, nombre de questions)
  3. Démarrage du quiz avec timer
  4. Réponse aux questions une par une
  5. Possibilité de revenir aux questions précédentes
  6. Soumission du quiz
  7. Affichage des résultats et corrections
  8. Sauvegarde du score et des statistiques

### 2.2 Système de révision
**Révision espacée**
- **Algorithme** : Basé sur la courbe d'oubli d'Ebbinghaus
- **Fonctionnement** :
  - Questions mal répondues → Révision dans 1 jour
  - Questions moyennement réussies → Révision dans 3 jours
  - Questions bien réussies → Révision dans 7 jours
- **Interface** : Calendrier de révision personnalisé

**Mode révision rapide**
- Sessions de 5-10 questions
- Focus sur les points faibles
- Révision avant examens

### 2.3 Suivi de progression
**Statistiques individuelles**
- Score moyen par matière
- Évolution temporelle des performances
- Temps passé par session
- Streak de jours consécutifs
- Points forts et points faibles identifiés

**Badges et récompenses**
- Badge "Première connexion"
- Badge "Streak 7 jours"
- Badge "100 quiz complétés"
- Badge "Score parfait"
- Système de points et niveaux

---

## 📝 SYSTÈME DE CONTENU (BLOG)

### 3.1 Gestion des articles
**Création d'un article (Enseignant/Admin)**
- **Acteur** : Enseignant ou Administrateur
- **Fonctionnalités** :
  - Éditeur WYSIWYG (What You See Is What You Get)
  - Support Markdown
  - Upload d'images et médias
  - Catégorisation et tags
  - Programmation de publication
  - SEO : méta-description, slug personnalisé

**Structure d'un article** :
- Titre et sous-titre
- Image de couverture
- Contenu principal avec formatage riche
- Catégorie (Mathématiques, Sciences, Langues, etc.)
- Tags pour la recherche
- Statut : Brouillon, Publié, Archivé

### 3.2 Système de commentaires
**Commentaires sur les articles**
- **Acteurs** : Utilisateurs connectés
- **Fonctionnalités** :
  - Ajout de commentaires
  - Réponses aux commentaires (threading)
  - Système de likes/dislikes
  - Modération par les enseignants
  - Signalement de contenu inapproprié

### 3.3 Recherche et navigation
**Recherche avancée**
- Recherche textuelle dans le contenu
- Filtres par catégorie, auteur, date
- Recherche par tags
- Suggestions de recherche
- Historique des recherches

**Navigation**
- Menu par catégories
- Articles populaires
- Articles récents
- Articles recommandés basés sur l'historique

---

## 📊 TABLEAUX DE BORD

### 4.1 Dashboard Étudiant
**Vue d'ensemble**
- Progression générale (pourcentage de complétion)
- Prochaines révisions programmées
- Statistiques de la semaine
- Objectifs personnels et progression

**Sections principales** :
- **Mes Quiz** : Historique et résultats
- **Révisions** : Planning personnalisé
- **Statistiques** : Graphiques de progression
- **Badges** : Récompenses obtenues
- **Recommandations** : Contenu suggéré

### 4.2 Dashboard Enseignant
**Gestion des classes**
- Liste des étudiants assignés
- Progression individuelle et collective
- Identification des élèves en difficulté
- Statistiques de participation

**Création de contenu**
- Interface de création de quiz
- Gestion des articles de blog
- Bibliothèque de ressources
- Planification des cours

**Analytics avancés**
- Taux de réussite par question
- Temps moyen de réponse
- Analyse des erreurs communes
- Rapports d'activité

### 4.3 Dashboard Administrateur
**Gestion globale**
- Vue d'ensemble de la plateforme
- Statistiques d'utilisation
- Gestion des utilisateurs et rôles
- Modération du contenu

**Configuration système**
- Paramètres de la plateforme
- Gestion des catégories
- Configuration des notifications
- Maintenance et mises à jour

---

## 🛒 COMMERCE ÉLECTRONIQUE

### 5.1 Boutique en ligne
**Catalogue de produits**
- **Types de produits** :
  - Cours premium
  - Livres numériques
  - Abonnements mensuels/annuels
  - Sessions de tutorat
  - Certificats de réussite

**Fiche produit**
- Description détaillée
- Prix et options de paiement
- Aperçu du contenu
- Avis et évaluations
- Produits similaires

### 5.2 Panier et commandes
**Gestion du panier**
- Ajout/suppression de produits
- Modification des quantités
- Calcul automatique des totaux
- Codes de réduction
- Sauvegarde du panier (utilisateurs connectés)

**Processus de commande**
1. Révision du panier
2. Informations de livraison (si applicable)
3. Choix du mode de paiement
4. Confirmation et paiement
5. Email de confirmation
6. Accès immédiat aux produits numériques

### 5.3 Système de paiement
**Intégration Stripe**
- Paiements par carte bancaire
- Paiements récurrents (abonnements)
- Gestion des remboursements
- Facturation automatique
- Conformité PCI DSS

**Modes de paiement supportés** :
- Cartes de crédit/débit
- PayPal (intégration future)
- Virements bancaires (pour les institutions)

---

## 🔔 SYSTÈME DE NOTIFICATIONS

### 6.1 Notifications in-app
**Types de notifications** :
- Nouveau quiz disponible
- Révision programmée
- Réponse à un commentaire
- Nouveau badge obtenu
- Rappel de connexion

### 6.2 Notifications email
**Emails automatiques** :
- Confirmation d'inscription
- Récapitulatif hebdomadaire de progression
- Rappels de révision
- Notifications de nouveaux contenus
- Factures et confirmations d'achat

### 6.3 Préférences utilisateur
**Paramètres de notification** :
- Fréquence des emails
- Types de notifications souhaitées
- Horaires de réception préférés
- Désactivation complète possible

---

## 🔍 RECHERCHE ET FILTRAGE

### 7.1 Recherche globale
**Fonctionnalités** :
- Recherche unifiée (quiz, articles, utilisateurs)
- Autocomplétion intelligente
- Correction automatique des fautes
- Recherche vocale (future)
- Historique des recherches

### 7.2 Filtres avancés
**Critères de filtrage** :
- **Quiz** : Difficulté, catégorie, durée, auteur
- **Articles** : Date, popularité, catégorie, tags
- **Utilisateurs** : Rôle, niveau, activité

### 7.3 Recommandations
**Algorithme de recommandation** :
- Basé sur l'historique d'activité
- Analyse des préférences
- Recommandations collaboratives
- Contenu trending

---

## 📱 RESPONSIVE ET ACCESSIBILITÉ

### 8.1 Design responsive
**Breakpoints** :
- Mobile : < 640px
- Tablette : 640px - 1024px
- Desktop : > 1024px

**Adaptations mobiles** :
- Navigation par onglets
- Swipe gestures pour les quiz
- Interface tactile optimisée
- Chargement progressif

### 8.2 Accessibilité (WCAG 2.1)
**Fonctionnalités d'accessibilité** :
- Navigation au clavier
- Lecteurs d'écran compatibles
- Contraste élevé
- Taille de police ajustable
- Descriptions alternatives pour les images
- Sous-titres pour les vidéos

---

## 🔧 ADMINISTRATION ET MODÉRATION

### 9.1 Outils de modération
**Gestion du contenu** :
- Validation des quiz avant publication
- Modération des commentaires
- Signalement de contenu inapproprié
- Système de bannissement temporaire
- Historique des actions de modération

### 9.2 Analytics et rapports
**Rapports disponibles** :
- Rapport d'activité utilisateurs
- Statistiques de performance des quiz
- Analyse du contenu populaire
- Rapport financier (ventes)
- Métriques de performance technique

### 9.3 Maintenance
**Outils de maintenance** :
- Sauvegarde automatique des données
- Nettoyage des sessions expirées
- Optimisation de la base de données
- Monitoring des performances
- Gestion des logs d'erreur

---

## 🚀 FONCTIONNALITÉS FUTURES

### Phase 2 - Fonctionnalités avancées
- **Mode collaboratif** : Quiz en équipe
- **Visioconférence** : Cours en direct
- **Forum communautaire** : Discussions entre étudiants
- **API publique** : Intégration avec d'autres plateformes

### Phase 3 - Intelligence artificielle
- **Chatbot éducatif** : Assistant IA pour les questions
- **Génération automatique de quiz** : IA créant des questions
- **Analyse prédictive** : Prédiction des difficultés d'apprentissage
- **Personnalisation avancée** : Parcours adaptatifs

---

## 📋 RÈGLES MÉTIER

### Règles de scoring
- Quiz réussi : Score ≥ 70%
- Bonus de vitesse : +10% si terminé en moins de 50% du temps alloué
- Malus de tentatives : -5% par tentative supplémentaire
- Score maximum : 100%

### Règles de progression
- Déblocage de niveaux basé sur le score moyen
- Prérequis pour certains quiz avancés
- Système de points d'expérience (XP)
- Niveaux : Débutant (0-100 XP), Intermédiaire (101-500 XP), Avancé (501+ XP)

### Règles commerciales
- Période d'essai gratuite : 7 jours
- Remboursement possible : 30 jours après achat
- Réductions étudiants : -20% sur présentation de justificatif
- Abonnements : Engagement minimum 1 mois

---

**Date de dernière mise à jour :** Janvier 2025  
**Version du document :** 1.0