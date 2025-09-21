import { z } from 'zod';

// Schéma de validation pour les variables d'environnement
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  DATABASE_URL: z.string().url().optional(),
  MONGODB_URI: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

// Type inféré du schéma
export type Env = z.infer<typeof envSchema>;

// Validation des variables d'environnement
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err: any) => err.path.join('.')).join(', ');
      throw new Error(`Variables d'environnement invalides ou manquantes: ${missingVars}`);
    }
    throw error as Error;
  }
}

// Fonction pour vérifier la sécurité des variables sensibles
export function checkSecurityVars(): void {
  const sensitiveVars = [
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'NEXTAUTH_SECRET',
    'DATABASE_URL',
    'MONGODB_URI'
  ];

  const warnings: string[] = [];

  sensitiveVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      // Vérifier si la variable contient des valeurs par défaut non sécurisées
      const unsafeDefaults = [
        'your-secret-key',
        'change-me',
        'default',
        'test',
        'secret',
        '123456'
      ];

      if (unsafeDefaults.some(unsafe => value.toLowerCase().includes(unsafe))) {
        warnings.push(`${varName} contient une valeur par défaut non sécurisée`);
      }

      // Vérifier la longueur minimale pour les secrets
      if (['JWT_SECRET', 'NEXTAUTH_SECRET'].includes(varName) && value.length < 32) {
        warnings.push(`${varName} devrait faire au moins 32 caractères`);
      }
    }
  });

  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Avertissements de sécurité:', warnings.join(', '));
  }
}

// Fonction pour masquer les variables sensibles dans les logs
export function sanitizeEnvForLogging(env: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ['JWT_SECRET', 'STRIPE_SECRET_KEY', 'NEXTAUTH_SECRET', 'DATABASE_URL', 'MONGODB_URI'];
  const sanitized = { ...env };

  sensitiveKeys.forEach(key => {
    if (sanitized[key]) {
      sanitized[key] = '***MASKED***';
    }
  });

  return sanitized;
}

// Export de l'environnement validé
export const env = validateEnv();