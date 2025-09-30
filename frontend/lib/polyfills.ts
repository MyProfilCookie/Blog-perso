// Polyfills pour la compatibilité des navigateurs

// Polyfill robuste pour requestIdleCallback (Safari)
if (typeof window !== 'undefined') {
  // Vérification plus robuste pour Safari
  if (!window.requestIdleCallback || typeof window.requestIdleCallback !== 'function') {
    let lastTime = 0;
    
    window.requestIdleCallback = function(callback: IdleRequestCallback, options?: IdleRequestOptions): number {
      const now = Date.now();
      const timeout = options?.timeout || 0;
      const timeToCall = Math.max(0, 16 - (now - lastTime));
      
      const id = window.setTimeout(() => {
        const start = Date.now();
        callback({
          didTimeout: timeout > 0 && (Date.now() - now) >= timeout,
          timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
        });
      }, timeToCall);
      
      lastTime = now + timeToCall;
      return id;
    };
  }

  // Polyfill pour cancelIdleCallback
  if (!window.cancelIdleCallback || typeof window.cancelIdleCallback !== 'function') {
    window.cancelIdleCallback = function(id: number): void {
      window.clearTimeout(id);
    };
  }
}

// Polyfill pour ResizeObserver si nécessaire
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  // Polyfill simple pour ResizeObserver
  (window as any).ResizeObserver = class ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      // Implémentation basique
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

export {};
