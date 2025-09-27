const jwt = require('jsonwebtoken');
const User = require('../../api/models/User');
const { authMiddleware, isAuthenticated, isAdmin } = require('../../api/middlewares/authMiddleware');

// Mock des dépendances
jest.mock('jsonwebtoken');
jest.mock('../../api/models/User');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      method: 'GET',
      path: '/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
    
    // Mock console.log pour éviter les logs pendant les tests
    console.log = jest.fn();
  });

  describe('authMiddleware', () => {
    it('devrait retourner une erreur 401 si aucun token n\'est fourni', async () => {
      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Accès refusé, token manquant.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur 401 si le format du token est incorrect', async () => {
      req.headers.authorization = 'InvalidFormat token123';

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Accès refusé, token manquant.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait authentifier avec succès un token valide', async () => {
      const mockUserId = '507f1f77bcf86cd799439011';
      const mockToken = 'valid-jwt-token';
      const mockDecodedToken = { id: mockUserId };
      const mockUser = {
        _id: mockUserId,
        email: 'test@example.com',
        pseudo: 'testuser',
        isAdmin: false,
        toObject: jest.fn().mockReturnValue({
          _id: mockUserId,
          email: 'test@example.com',
          pseudo: 'testuser',
          isAdmin: false
        })
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecodedToken);
      User.findById.mockResolvedValue(mockUser);

      await authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(req.user).toEqual(expect.objectContaining({
        id: mockUserId,
        email: 'test@example.com',
        pseudo: 'testuser'
      }));
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur 401 pour un token invalide', async () => {
      const mockToken = 'invalid-jwt-token';
      
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token invalide ou expiré.'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur 401 si l\'ID est manquant dans le token', async () => {
      const mockToken = 'valid-jwt-token';
      const mockDecodedToken = {}; // Pas d'ID
      
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecodedToken);

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token invalide, ID utilisateur absent.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur 404 si l\'utilisateur n\'est pas trouvé', async () => {
      const mockUserId = '507f1f77bcf86cd799439011';
      const mockToken = 'valid-jwt-token';
      const mockDecodedToken = { id: mockUserId };
      
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecodedToken);
      User.findById.mockResolvedValue(null);

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur introuvable.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de base de données', async () => {
      const mockUserId = '507f1f77bcf86cd799439011';
      const mockToken = 'valid-jwt-token';
      const mockDecodedToken = { id: mockUserId };
      
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecodedToken);
      User.findById.mockRejectedValue(new Error('Database error'));

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur introuvable.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait inclure des détails d\'erreur en environnement de développement', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const mockToken = 'invalid-jwt-token';
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token invalide ou expiré.',
        error: 'Token expired',
        type: 'TokenExpiredError'
      });
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('isAuthenticated', () => {
    it('devrait être un alias pour authMiddleware', () => {
      expect(isAuthenticated).toBe(authMiddleware);
    });
  });

  describe('isAdmin', () => {
    it('devrait autoriser l\'accès pour un utilisateur admin authentifié', async () => {
      req.user = {
        id: '507f1f77bcf86cd799439011',
        email: 'admin@example.com',
        isAdmin: true
      };

      await isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur 401 si l\'utilisateur n\'est pas authentifié', async () => {
      req.user = null;

      await isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Non authentifié'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur 403 si l\'utilisateur n\'est pas admin', async () => {
      req.user = {
        id: '507f1f77bcf86cd799439011',
        email: 'user@example.com',
        isAdmin: false
      };

      await isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Accès refusé, vous devez être administrateur.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait gérer les erreurs internes', async () => {
      req.user = {
        id: '507f1f77bcf86cd799439011',
        email: 'admin@example.com',
        get isAdmin() {
          throw new Error('Property access error');
        }
      };

      await isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur serveur'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});