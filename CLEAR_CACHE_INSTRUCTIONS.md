# 🗑️ Comment vider le cache de la boutique

## Problème
Vous ne voyez que 6 produits au lieu de 37 car votre navigateur utilise des **données en cache**.

## Solution rapide ✅

### Option 1 : Utiliser l'outil automatique
1. Allez sur : **https://autistudy.vercel.app/clear-cache.html**
2. Cliquez sur le bouton "Vider le cache"
3. Rafraîchissez la page shop

### Option 2 : Vider manuellement le cache
1. Ouvrez la page : **https://autistudy.vercel.app/shop**
2. Ouvrez la console du navigateur :
   - **Mac** : `Cmd + Option + J` (Chrome/Edge) ou `Cmd + Option + C` (Safari)
   - **Windows** : `Ctrl + Shift + J`
3. Tapez cette commande :
   ```javascript
   localStorage.removeItem('shop-products');
   localStorage.removeItem('shop-products-timestamp');
   location.reload();
   ```
4. Appuyez sur **Entrée**

### Option 3 : Rafraîchissement forcé
1. Sur la page shop, faites un **rafraîchissement forcé** :
   - **Mac** : `Cmd + Shift + R`
   - **Windows** : `Ctrl + Shift + R`

## Vérification
Après avoir vidé le cache, vous devriez voir **37 produits** au lieu de 6 ! 🎉

---

**Note** : Le cache se vide automatiquement toutes les 15 minutes, mais ces méthodes permettent un nettoyage immédiat.

