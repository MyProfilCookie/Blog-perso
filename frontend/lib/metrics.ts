// Système de métriques de performance

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'navigation' | 'resource' | 'paint' | 'layout' | 'custom';
}

interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Observer pour les métriques de navigation
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric({
              name: entry.name,
              value: entry.startTime,
              unit: 'ms',
              timestamp: Date.now(),
              category: 'navigation'
            });
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation observer non supporté:', error);
      }

      // Observer pour les métriques de peinture
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric({
              name: entry.name,
              value: entry.startTime,
              unit: 'ms',
              timestamp: Date.now(),
              category: 'paint'
            });
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('Paint observer non supporté:', error);
      }

      // Observer pour les métriques de layout
      try {
        const layoutObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric({
              name: entry.name,
              value: (entry as any).value || 0,
              unit: 'ms',
              timestamp: Date.now(),
              category: 'layout'
            });
          }
        });
        layoutObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutObserver);
      } catch (error) {
        console.warn('Layout observer non supporté:', error);
      }
    }
  }

  // Enregistrer une métrique personnalisée
  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Limiter le nombre de métriques stockées
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }

    // Envoyer à l'analytics si configuré
    this.sendToAnalytics(metric);
  }

  // Mesurer le temps d'exécution d'une fonction
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.recordMetric({
      name: `function_${name}`,
      value: end - start,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'custom'
    });

    return result;
  }

  // Mesurer le temps d'exécution d'une fonction asynchrone
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.recordMetric({
      name: `async_function_${name}`,
      value: end - start,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'custom'
    });

    return result;
  }

  // Obtenir les Core Web Vitals
  getCoreWebVitals(): CoreWebVitals | null {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    if (!navigation) return null;

    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    const lcp = this.getLCP();
    const fid = this.getFID();
    const cls = this.getCLS();
    const ttfb = navigation.responseStart - navigation.requestStart;

    return {
      lcp,
      fid,
      cls,
      ttfb,
      fcp
    };
  }

  // Obtenir le Largest Contentful Paint
  private getLCP(): number {
    if (typeof window === 'undefined') return 0;

    const entries = performance.getEntriesByType('largest-contentful-paint');
    if (entries.length === 0) return 0;

    return entries[entries.length - 1].startTime;
  }

  // Obtenir le First Input Delay
  private getFID(): number {
    if (typeof window === 'undefined') return 0;

    const entries = performance.getEntriesByType('first-input') as PerformanceEventTiming[];
    if (entries.length === 0) return 0;

    return entries[0].processingStart - entries[0].startTime;
  }

  // Obtenir le Cumulative Layout Shift
  private getCLS(): number {
    if (typeof window === 'undefined') return 0;

    let cls = 0;
    const entries = performance.getEntriesByType('layout-shift');
    
    for (const entry of entries) {
      if (!(entry as any).hadRecentInput) {
        cls += (entry as any).value;
      }
    }

    return cls;
  }

  // Obtenir toutes les métriques
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Obtenir les métriques par catégorie
  getMetricsByCategory(category: PerformanceMetric['category']): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.category === category);
  }

  // Obtenir les métriques récentes (dernières 24h)
  getRecentMetrics(): PerformanceMetric[] {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return this.metrics.filter(metric => metric.timestamp > oneDayAgo);
  }

  // Calculer la moyenne des métriques
  getAverageMetric(name: string): number {
    const metrics = this.metrics.filter(metric => metric.name === name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  // Obtenir le p95 d'une métrique
  getP95Metric(name: string): number {
    const metrics = this.metrics.filter(metric => metric.name === name);
    if (metrics.length === 0) return 0;

    const sorted = metrics.sort((a, b) => a.value - b.value);
    const index = Math.floor(metrics.length * 0.95);
    return sorted[index]?.value || 0;
  }

  // Envoyer les métriques à l'analytics
  private sendToAnalytics(metric: PerformanceMetric) {
    // Intégration avec Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
        metric_category: metric.category
      });
    }

    // Intégration avec Vercel Analytics
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', 'performance_metric', {
        name: metric.name,
        value: metric.value,
        unit: metric.unit,
        category: metric.category
      });
    }
  }

  // Générer un rapport de performance
  generateReport(): string {
    const cwv = this.getCoreWebVitals();
    const recentMetrics = this.getRecentMetrics();
    
    let report = '# Rapport de Performance\n\n';
    
    if (cwv) {
      report += '## Core Web Vitals\n\n';
      report += `- **LCP (Largest Contentful Paint)**: ${cwv.lcp.toFixed(2)}ms\n`;
      report += `- **FID (First Input Delay)**: ${cwv.fid.toFixed(2)}ms\n`;
      report += `- **CLS (Cumulative Layout Shift)**: ${cwv.cls.toFixed(3)}\n`;
      report += `- **TTFB (Time to First Byte)**: ${cwv.ttfb.toFixed(2)}ms\n`;
      report += `- **FCP (First Contentful Paint)**: ${cwv.fcp.toFixed(2)}ms\n\n`;
    }

    report += '## Métriques Récentes (24h)\n\n';
    report += `- **Total des métriques**: ${recentMetrics.length}\n`;
    
    const categories = ['navigation', 'paint', 'layout', 'custom'] as const;
    for (const category of categories) {
      const categoryMetrics = this.getMetricsByCategory(category);
      if (categoryMetrics.length > 0) {
        report += `- **${category}**: ${categoryMetrics.length} métriques\n`;
      }
    }

    return report;
  }

  // Nettoyer les métriques anciennes
  cleanup() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(metric => metric.timestamp > oneWeekAgo);
  }

  // Arrêter les observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Instance globale du moniteur de performance
export const performanceMonitor = new PerformanceMonitor();

// Fonctions utilitaires
export const measurePerformance = (name: string, fn: () => any) => {
  return performanceMonitor.measureFunction(name, fn);
};

export const measureAsyncPerformance = (name: string, fn: () => Promise<any>) => {
  return performanceMonitor.measureAsyncFunction(name, fn);
};

export const getPerformanceReport = () => {
  return performanceMonitor.generateReport();
};

export const getCoreWebVitals = () => {
  return performanceMonitor.getCoreWebVitals();
};

// Hook React pour mesurer les performances
import { useRef, useEffect } from 'react';

export const usePerformanceMeasurement = (name: string) => {
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      performanceMonitor.recordMetric({
        name: `component_${name}`,
        value: endTime - startTime.current,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'custom'
      });
    };
  }, [name]);
};
