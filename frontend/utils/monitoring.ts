/**
 * Système de monitoring et logging pour la production
 * Intègre Sentry, analytics personnalisés et métriques de performance
 */

// Types pour le monitoring
export interface ErrorContext {
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: number;
  sessionId?: string;
  buildVersion?: string;
  environment?: string;
  additionalData?: Record<string, any>;
  line?: number;
  column?: number;
  type?: string;
  resourceType?: string;
  metric?: string;
  threshold?: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count" | "percentage";
  timestamp: number;
  context?: Record<string, any>;
}

export interface UserAction {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Configuration du monitoring
const MONITORING_CONFIG = {
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
  apiEndpoint: process.env.NEXT_PUBLIC_API_URL,
  enableConsoleLogging: process.env.NODE_ENV === "development",
  enableSentry: process.env.NODE_ENV === "production",
  enableAnalytics: true,
  maxErrorsPerSession: 50,
  performanceThresholds: {
    pageLoad: 3000, // 3 secondes
    apiCall: 5000, // 5 secondes
    render: 100, // 100ms
  },
};

// Classe principale de monitoring
export class MonitoringService {
  private static instance: MonitoringService;
  private sessionId: string;
  private errorCount: number = 0;
  private performanceObserver?: PerformanceObserver;
  private isInitialized: boolean = false;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeMonitoring(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialiser Sentry en production
      if (MONITORING_CONFIG.enableSentry && MONITORING_CONFIG.sentryDsn) {
        await this.initializeSentry();
      }

      // Configurer l'observateur de performance
      this.setupPerformanceMonitoring();

      // Configurer les listeners d'erreurs globales
      this.setupGlobalErrorHandlers();

      // Configurer le monitoring des ressources
      this.setupResourceMonitoring();

      this.isInitialized = true;
      this.logInfo("Monitoring service initialized", {
        sessionId: this.sessionId,
      });
    } catch (error) {
      // console.error("Failed to initialize monitoring:", error);
    }
  }

  private async initializeSentry(): Promise<void> {
    try {
      // Import dynamique de Sentry pour éviter les erreurs SSR
      const Sentry = await import("@sentry/nextjs");

      Sentry.init({
        dsn: MONITORING_CONFIG.sentryDsn,
        environment: MONITORING_CONFIG.environment,
        tracesSampleRate:
          MONITORING_CONFIG.environment === "production" ? 0.1 : 1.0,
        beforeSend: (event) => {
          // Filtrer les erreurs non critiques
          if (this.shouldIgnoreError(event.exception?.values?.[0]?.value)) {
            return null;
          }
          return event;
        },
      });
    } catch (error) {
      // console.warn("Sentry initialization failed:", error);
    }
  }

  private setupPerformanceMonitoring(): void {
    if (typeof window === "undefined") return;

    try {
      // Observer les métriques de performance
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.handlePerformanceEntry(entry);
        });
      });

      this.performanceObserver.observe({
        entryTypes: ["navigation", "resource", "measure", "paint"],
      });

      // Mesurer les Core Web Vitals
      this.measureWebVitals();
    } catch (error) {
      // console.warn("Performance monitoring setup failed:", error);
    }
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === "undefined") return;

    // Erreurs JavaScript non capturées
    window.addEventListener("error", (event) => {
      this.captureError(event.error, {
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        type: "javascript_error",
      });
    });

    // Promesses rejetées non capturées
    window.addEventListener("unhandledrejection", (event) => {
      this.captureError(new Error(event.reason), {
        type: "unhandled_promise_rejection",
      });
    });
  }

  private setupResourceMonitoring(): void {
    if (typeof window === "undefined") return;

    // Surveiller les erreurs de chargement de ressources
    window.addEventListener(
      "error",
      (event) => {
        if (event.target !== window) {
          this.captureError(
            new Error(
              `Resource loading failed: ${(event.target as any)?.src || "unknown"}`,
            ),
            {
              type: "resource_error",
              resourceType: (event.target as any)?.tagName,
            },
          );
        }
      },
      true,
    );
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      name: entry.name,
      value: entry.duration || (entry as any).value || 0,
      unit: "ms",
      timestamp: Date.now(),
      context: {
        entryType: entry.entryType,
        startTime: entry.startTime,
      },
    };

    // Vérifier les seuils de performance
    this.checkPerformanceThresholds(metric);

    // Envoyer la métrique
    this.sendPerformanceMetric(metric);
  }

  private async measureWebVitals(): Promise<void> {
    try {
      const { onCLS, onFCP, onLCP, onTTFB } = await import("web-vitals");

      onCLS((metric: any) => this.sendWebVital("CLS", metric.value, metric));
      onFCP((metric: any) => this.sendWebVital("FCP", metric.value, metric));
      onLCP((metric: any) => this.sendWebVital("LCP", metric.value, metric));
      onTTFB((metric: any) => this.sendWebVital("TTFB", metric.value, metric));
    } catch (error) {
      // console.warn("Web Vitals measurement failed:", error);
    }
  }

  private sendWebVital(name: string, value: number, metric: any): void {
    const performanceMetric: PerformanceMetric = {
      name: `web_vital_${name.toLowerCase()}`,
      value,
      unit: name === "CLS" ? "count" : "ms",
      timestamp: Date.now(),
      context: {
        id: metric.id,
        rating: this.getWebVitalRating(name, value),
      },
    };

    this.sendPerformanceMetric(performanceMetric);
  }

  private getWebVitalRating(
    name: string,
    value: number,
  ): "good" | "needs-improvement" | "poor" {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return "good";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  }

  private checkPerformanceThresholds(metric: PerformanceMetric): void {
    const { performanceThresholds } = MONITORING_CONFIG;

    if (
      metric.name.includes("navigation") &&
      metric.value > performanceThresholds.pageLoad
    ) {
      this.captureError(new Error(`Slow page load: ${metric.value}ms`), {
        type: "performance_issue",
        metric: metric.name,
        threshold: performanceThresholds.pageLoad,
      });
    }
  }

  private shouldIgnoreError(errorMessage?: string): boolean {
    if (!errorMessage) return false;

    const ignoredErrors = [
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
      "Network request failed",
      "Loading chunk",
      "Script error",
    ];

    return ignoredErrors.some((ignored) => errorMessage.includes(ignored));
  }

  // API publique
  public captureError(error: Error, context: Partial<ErrorContext> = {}): void {
    if (this.errorCount >= MONITORING_CONFIG.maxErrorsPerSession) {
      return; // Éviter le spam d'erreurs
    }

    this.errorCount++;

    const errorContext: ErrorContext = {
      userId: this.getCurrentUserId(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
      environment: MONITORING_CONFIG.environment,
      ...context,
    };

    // Log en console en développement
    if (MONITORING_CONFIG.enableConsoleLogging) {
      // console.error("Error captured:", error, errorContext);
    }

    // Envoyer à Sentry
    if (MONITORING_CONFIG.enableSentry) {
      this.sendToSentry(error, errorContext);
    }

    // Envoyer à notre API
    this.sendErrorToAPI(error, errorContext);
  }

  public trackUserAction(action: UserAction): void {
    const enrichedAction: UserAction = {
      ...action,
      userId: action.userId || this.getCurrentUserId(),
      timestamp: action.timestamp || Date.now(),
      metadata: {
        ...action.metadata,
        sessionId: this.sessionId,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined,
      },
    };

    if (MONITORING_CONFIG.enableConsoleLogging) {
      // console.log("User action tracked:", enrichedAction);
    }

    this.sendActionToAPI(enrichedAction);
  }

  public sendPerformanceMetric(metric: PerformanceMetric): void {
    const enrichedMetric: PerformanceMetric = {
      ...metric,
      context: {
        ...metric.context,
        sessionId: this.sessionId,
        userId: this.getCurrentUserId(),
      },
    };

    if (MONITORING_CONFIG.enableConsoleLogging) {
      // console.log("Performance metric:", enrichedMetric);
    }

    this.sendMetricToAPI(enrichedMetric);
  }

  public logInfo(message: string, data?: Record<string, any>): void {
    if (MONITORING_CONFIG.enableConsoleLogging) {
      // console.log(`[INFO] ${message}`, data);
    }

    this.sendLogToAPI("info", message, data);
  }

  public logWarning(message: string, data?: Record<string, any>): void {
    if (MONITORING_CONFIG.enableConsoleLogging) {
      // console.warn(`[WARNING] ${message}`, data);
    }

    this.sendLogToAPI("warning", message, data);
  }

  // Méthodes privées d'envoi
  private async sendToSentry(
    error: Error,
    context: ErrorContext,
  ): Promise<void> {
    try {
      const Sentry = await import("@sentry/nextjs");

      Sentry.withScope((scope) => {
        scope.setUser({ id: context.userId });
        scope.setTag("sessionId", context.sessionId);
        scope.setContext("errorContext", context as any);
        Sentry.captureException(error);
      });
    } catch (err) {
      // console.warn("Failed to send error to Sentry:", err);
    }
  }

  private async sendErrorToAPI(
    error: Error,
    context: ErrorContext,
  ): Promise<void> {
    try {
      await fetch(`${MONITORING_CONFIG.apiEndpoint}/api/monitoring/errors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
        }),
      });
    } catch (err) {
      // console.warn("Failed to send error to API:", err);
    }
  }

  private async sendActionToAPI(action: UserAction): Promise<void> {
    try {
      await fetch(`${MONITORING_CONFIG.apiEndpoint}/api/monitoring/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });
    } catch (err) {
      // console.warn("Failed to send action to API:", err);
    }
  }

  private async sendMetricToAPI(metric: PerformanceMetric): Promise<void> {
    try {
      await fetch(`${MONITORING_CONFIG.apiEndpoint}/api/monitoring/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
      });
    } catch (err) {
      // console.warn("Failed to send metric to API:", err);
    }
  }

  private async sendLogToAPI(
    level: string,
    message: string,
    data?: Record<string, any>,
  ): Promise<void> {
    try {
      await fetch(`${MONITORING_CONFIG.apiEndpoint}/api/monitoring/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          message,
          data,
          timestamp: Date.now(),
          sessionId: this.sessionId,
          userId: this.getCurrentUserId(),
        }),
      });
    } catch (err) {
      // console.warn("Failed to send log to API:", err);
    }
  }

  private getCurrentUserId(): string | undefined {
    if (typeof window === "undefined") return undefined;

    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData).id : undefined;
    } catch {
      return undefined;
    }
  }
}

// Instance singleton
export const monitoring = MonitoringService.getInstance();

// Hooks React pour le monitoring
export const useMonitoring = () => {
  const trackError = (error: Error, context?: Partial<ErrorContext>) => {
    monitoring.captureError(error, context);
  };

  const trackAction = (
    action: string,
    category: string,
    label?: string,
    value?: number,
  ) => {
    monitoring.trackUserAction({
      action,
      category,
      label,
      value,
      timestamp: Date.now(),
    });
  };

  const trackPerformance = (
    name: string,
    value: number,
    unit: PerformanceMetric["unit"] = "ms",
  ) => {
    monitoring.sendPerformanceMetric({
      name,
      value,
      unit,
      timestamp: Date.now(),
    });
  };

  return {
    trackError,
    trackAction,
    trackPerformance,
    logInfo: monitoring.logInfo.bind(monitoring),
    logWarning: monitoring.logWarning.bind(monitoring),
  };
};

// Utilitaires pour mesurer les performances
export const measureAsync = async <T>(
  name: string,
  asyncFn: () => Promise<T>,
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await asyncFn();
    const duration = performance.now() - start;
    monitoring.sendPerformanceMetric({
      name,
      value: duration,
      unit: "ms",
      timestamp: Date.now(),
    });
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    monitoring.captureError(error as Error, {
      type: "async_operation_error",
      additionalData: { operationName: name, duration },
    });
    throw error;
  }
};

export const measureSync = <T>(name: string, syncFn: () => T): T => {
  const start = performance.now();
  try {
    const result = syncFn();
    const duration = performance.now() - start;
    monitoring.sendPerformanceMetric({
      name,
      value: duration,
      unit: "ms",
      timestamp: Date.now(),
    });
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    monitoring.captureError(error as Error, {
      type: "sync_operation_error",
      additionalData: { operationName: name, duration },
    });
    throw error;
  }
};

// Export par défaut
export default monitoring;
