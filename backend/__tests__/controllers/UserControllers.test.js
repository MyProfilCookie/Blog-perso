const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../api/models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  signup,
  login,
  getUsers,
  deleteUser,
  makeAdmin,
  updateUser,
  getCurrentUser,
  getUserById,
  refreshToken
} = require('../../api/controllers/UserControllers');

// Mock des dépendances
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../api/models/User');

describe('UserControllers', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {},
      cookies: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('devrait générer un access token valide', () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockToken = 'mock-access-token';
      
      jwt.sign.mockReturnValue(mockToken);
      
      const token = generateAccessToken(userId);
      
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      expect(token).toBe(mockToken);
    });

    it('devrait convertir l\'ID en string', () => {
      const userId = new mongoose.Types.ObjectId();
      const mockToken = 'mock-access-token';
      
      jwt.sign.mockReturnValue(mockToken);
      
      generateAccessToken(userId);
      
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('devrait générer un refresh token valide', () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockToken = 'mock-refresh-token';
      
      process.env.JWT_REFRESH_SECRET = 'refresh-secret';
      jwt.sign.mockReturnValue(mockToken);
      
      const token = generateRefreshToken(userId);
      
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
      expect(token).toBe(mockToken);
    });

    it('devrait utiliser un fallback si JWT_REFRESH_SECRET n\'est pas défini', () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockToken = 'mock-refresh-token';
      
      delete process.env.JWT_REFRESH_SECRET;
      jwt.sign.mockReturnValue(mockToken);
      
      generateRefreshToken(userId);
      
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId },
        process.env.JWT_SECRET || 'refresh_fallback_secret',
        { expiresIn: '7d' }
      );
    });
  });

  describe('signup', () => {
    it('devrait créer un nouvel utilisateur avec succès', async () => {
      const userData = {
        pseudo: 'testuser',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        deliveryAddress: '123 Test St'
      };

      const mockSavedUser = {
        _id: '507f1f77bcf86cd799439011',
        ...userData,
        password: 'hashedPassword',
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          pseudo: userData.pseudo,
          nom: userData.nom,
          prenom: userData.prenom,
          age: userData.age,
          email: userData.email,
          phone: userData.phone,
          deliveryAddress: userData.deliveryAddress
        })
      };

      req.body = userData;
      User.findOne.mockResolvedValue(null); // Aucun utilisateur existant
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue(mockSavedUser);
      jwt.sign.mockReturnValue('mock-token');

      await signup(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Inscription réussie!',
          user: expect.any(Object),
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        })
      );
    });

    it('devrait retourner une erreur si l\'utilisateur existe déjà', async () => {
      const userData = {
        pseudo: 'testuser',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'existing@example.com',
        password: 'password123'
      };

      req.body = userData;
      User.findOne.mockResolvedValue({ email: userData.email }); // Utilisateur existant

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cet email est déjà utilisé.'
      });
    });

    it('devrait gérer les erreurs de base de données', async () => {
      const userData = {
        pseudo: 'testuser',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      req.body = userData;
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur serveur lors de l\'inscription'
      });
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: userData.email,
        password: 'hashedPassword',
        pseudo: 'testuser',
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          email: userData.email,
          pseudo: 'testuser'
        })
      };

      req.body = userData;
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(userData.password, mockUser.password);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Connexion réussie!',
          user: expect.any(Object),
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        })
      );
    });

    it('devrait retourner une erreur pour un email inexistant', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email ou mot de passe incorrect'
      });
    });

    it('devrait retourner une erreur pour un mot de passe incorrect', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        pseudo: 'testuser'
      };

      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email ou mot de passe incorrect'
      });
    });
  });

  describe('getCurrentUser', () => {
    it('devrait retourner les informations de l\'utilisateur connecté', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        pseudo: 'testuser',
        nom: 'Test',
        prenom: 'User'
      };

      req.user = { id: mockUser._id };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await getCurrentUser(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: mockUser
      });
    });

    it('devrait retourner une erreur si l\'utilisateur n\'est pas trouvé', async () => {
      req.user = { id: '507f1f77bcf86cd799439011' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur non trouvé.'
      });
    });

    it('devrait retourner une erreur si req.user est absent', async () => {
      req.user = null;

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Non autorisé.'
      });
    });
  });

  describe('refreshToken', () => {
    it('devrait générer un nouveau token avec un refresh token valide', async () => {
      const mockUserId = '507f1f77bcf86cd799439011';
      const mockRefreshToken = 'valid.refresh.token';
      const mockNewAccessToken = 'new.access.token';

      req.body = { refreshToken: mockRefreshToken };
      
      jwt.verify.mockReturnValue({ id: mockUserId });
      User.findById.mockResolvedValue({ _id: mockUserId });
      jwt.sign.mockReturnValue(mockNewAccessToken);

      await refreshToken(req, res);

      expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: mockNewAccessToken
      });
    });

    it('devrait retourner une erreur si le refresh token est manquant', async () => {
      req.body = {};

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Refresh token requis'
      });
    });

    it('devrait retourner une erreur si le refresh token est invalide', async () => {
      req.body = { refreshToken: 'invalid.token' };
      
      const error = new Error('JsonWebTokenError');
      error.name = 'JsonWebTokenError';
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token invalide ou expiré'
      });
    });
  });

  describe('deleteUser', () => {
    it('devrait supprimer un utilisateur avec succès', async () => {
      const userId = '507f1f77bcf86cd799439011';
      req.params.id = userId;

      const mockUser = {
        _id: userId,
        pseudo: 'testuser',
        email: 'test@example.com'
      };

      User.findByIdAndDelete.mockResolvedValue(mockUser);

      await deleteUser(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur supprimé avec succès.'
      });
    });

    it('devrait retourner une erreur si l\'utilisateur n\'est pas trouvé', async () => {
      const userId = '507f1f77bcf86cd799439011';
      req.params.id = userId;

      User.findByIdAndDelete.mockResolvedValue(null);

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur non trouvé.'
      });
    });
  });

  describe('makeAdmin', () => {
    it('devrait promouvoir un utilisateur en admin', async () => {
      const userId = '507f1f77bcf86cd799439011';
      req.params = { userId };

      const mockUser = {
        _id: userId,
        pseudo: 'testuser',
        email: 'test@example.com',
        role: 'user',
        isAdmin: false,
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById.mockResolvedValue(mockUser);

      await makeAdmin(req, res);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.role).toBe('admin');
      expect(mockUser.isAdmin).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'L\'utilisateur a été promu administrateur avec succès.',
        user: expect.objectContaining({
          id: userId,
          role: 'admin',
          isAdmin: true
        })
      });
    });

    it('devrait retourner une erreur si l\'utilisateur n\'est pas trouvé', async () => {
      const userId = '507f1f77bcf86cd799439011';
      req.params = { userId };

      User.findById.mockResolvedValue(null);

      await makeAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur non trouvé.'
      });
    });

    it('devrait gérer les erreurs serveur', async () => {
      req.params = { userId: '507f1f77bcf86cd799439011' };
      
      // Simuler une erreur lors de la recherche de l'utilisateur
      User.findById.mockImplementation(() => {
        throw new Error('Database connection error');
      });

      await makeAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur serveur'
      });
    });
  });
});