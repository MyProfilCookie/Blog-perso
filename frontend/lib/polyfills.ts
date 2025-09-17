// Polyfills pour la compatibilité des navigateurs

// Polyfill pour requestIdleCallback
if (typeof window !== 'undefined' && !window.requestIdleCallback) {
  window.requestIdleCallback = function(callback: IdleRequestCallback, options?: IdleRequestOptions): number {
    const start = Date.now();
    return window.setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      });
    }, 1);
  };
}

// Polyfill pour cancelIdleCallback
if (typeof window !== 'undefined' && !window.cancelIdleCallback) {
  window.cancelIdleCallback = function(id: number): void {
    window.clearTimeout(id);
  };
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
