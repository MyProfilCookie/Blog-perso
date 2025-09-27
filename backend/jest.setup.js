// Configuration globale pour les tests
require('dotenv').config({ path: '.env.test' });

// Mock de console pour éviter les logs pendant les tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configuration des timeouts
jest.setTimeout(10000);

// Mock de process.env pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/autistudy-test';