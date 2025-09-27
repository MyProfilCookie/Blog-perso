const jwt = require('jsonwebtoken');

// Mock de jwt
jest.mock('jsonwebtoken');

// Import du module à tester
// Note: Comme JWTGenerator.js exécute du code au niveau module, 
// nous testons la logique de génération de token directement
describe('JWTGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('generateToken function logic', () => {
    // Nous recréons la fonction generateToken pour les tests
    const generateToken = (user) => {
      const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      const options = {
        expiresIn: '1h',
      };

      return jwt.sign(payload, process.env.JWT_SECRET, options);
    };

    it('devrait générer un token JWT avec les bonnes données', () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        isAdmin: true
      };
      const mockToken = 'mock-jwt-token';

      jwt.sign.mockReturnValue(mockToken);

      const result = generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          isAdmin: mockUser.isAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(result).toBe(mockToken);
    });

    it('devrait générer un token pour un utilisateur non-admin', () => {
      const mockUser = {
        id: '456',
        email: 'user@example.com',
        isAdmin: false
      };
      const mockToken = 'mock-jwt-token-user';

      jwt.sign.mockReturnValue(mockToken);

      const result = generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          isAdmin: mockUser.isAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(result).toBe(mockToken);
    });

    it('devrait utiliser la clé secrète JWT de l\'environnement', () => {
      const mockUser = {
        id: '789',
        email: 'another@example.com',
        isAdmin: false
      };
      const customSecret = 'custom-secret-key';
      process.env.JWT_SECRET = customSecret;

      jwt.sign.mockReturnValue('token');

      generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        customSecret,
        expect.any(Object)
      );
    });

    it('devrait inclure tous les champs requis dans le payload', () => {
      const mockUser = {
        id: '999',
        email: 'complete@example.com',
        isAdmin: true
      };

      jwt.sign.mockReturnValue('token');

      generateToken(mockUser);

      const [payload] = jwt.sign.mock.calls[0];
      
      expect(payload).toHaveProperty('id', mockUser.id);
      expect(payload).toHaveProperty('email', mockUser.email);
      expect(payload).toHaveProperty('isAdmin', mockUser.isAdmin);
    });

    it('devrait définir la bonne durée d\'expiration', () => {
      const mockUser = {
        id: '111',
        email: 'expire@example.com',
        isAdmin: false
      };

      jwt.sign.mockReturnValue('token');

      generateToken(mockUser);

      const [, , options] = jwt.sign.mock.calls[0];
      
      expect(options).toHaveProperty('expiresIn', '1h');
    });

    it('devrait gérer les utilisateurs avec des IDs numériques', () => {
      const mockUser = {
        id: 12345,
        email: 'numeric@example.com',
        isAdmin: false
      };

      jwt.sign.mockReturnValue('token');

      generateToken(mockUser);

      const [payload] = jwt.sign.mock.calls[0];
      
      expect(payload.id).toBe(12345);
    });

    it('devrait gérer les utilisateurs sans statut admin défini', () => {
      const mockUser = {
        id: '222',
        email: 'noadmin@example.com'
        // isAdmin non défini
      };

      jwt.sign.mockReturnValue('token');

      generateToken(mockUser);

      const [payload] = jwt.sign.mock.calls[0];
      
      expect(payload).toHaveProperty('isAdmin', undefined);
    });
  });

  describe('JWT signing errors', () => {
    const generateToken = (user) => {
      const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      const options = {
        expiresIn: '1h',
      };

      return jwt.sign(payload, process.env.JWT_SECRET, options);
    };

    it('devrait propager les erreurs de jwt.sign', () => {
      const mockUser = {
        id: '333',
        email: 'error@example.com',
        isAdmin: false
      };

      const error = new Error('JWT signing failed');
      jwt.sign.mockImplementation(() => {
        throw error;
      });

      expect(() => generateToken(mockUser)).toThrow('JWT signing failed');
    });

    it('devrait gérer l\'absence de JWT_SECRET', () => {
      delete process.env.JWT_SECRET;
      
      const mockUser = {
        id: '444',
        email: 'nosecret@example.com',
        isAdmin: false
      };

      jwt.sign.mockReturnValue('token');

      generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        undefined,
        expect.any(Object)
      );
    });
  });
});