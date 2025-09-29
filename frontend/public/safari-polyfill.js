// Polyfill Safari - requestIdleCallback ULTRA AGRESSIF
// Ce script doit se charger AVANT tout le reste
(function() {
  // Définir immédiatement sur window
  window.requestIdleCallback = window.requestIdleCallback || function(callback, options) {
    var start = Date.now();
    return window.setTimeout(function() {
      callback({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };
  
  window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
    window.clearTimeout(id);
  };
  
  // Forcer la définition sur tous les contextes possibles
  if (typeof global !== 'undefined') {
    global.requestIdleCallback = window.requestIdleCallback;
    global.cancelIdleCallback = window.cancelIdleCallback;
  }
  
  if (typeof self !== 'undefined') {
    self.requestIdleCallback = window.requestIdleCallback;
    self.cancelIdleCallback = window.cancelIdleCallback;
  }
  
  if (typeof this !== 'undefined') {
    this.requestIdleCallback = window.requestIdleCallback;
    this.cancelIdleCallback = window.cancelIdleCallback;
  }
  
  // Définir sur l'objet global de manière plus agressive
  try {
    eval('requestIdleCallback = window.requestIdleCallback');
    eval('cancelIdleCallback = window.cancelIdleCallback');
  } catch(e) {}
  
  console.log('Safari polyfill externe chargé - requestIdleCallback disponible:', typeof window.requestIdleCallback);
})();
