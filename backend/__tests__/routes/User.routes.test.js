const request = require('supertest');
const express = require('express');
const userRoutes = require('../../api/routes/User.routes');
const UserController = require('../../api/controllers/UserControllers');
const { authMiddleware, isAdmin } = require('../../api/middlewares/authMiddleware');

// Mock des dépendances
jest.mock('../../api/controllers/UserControllers');
jest.mock('../../api/middlewares/authMiddleware');

describe('User Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/users', userRoutes);
    
    jest.clearAllMocks();
    
    // Mock console.log pour éviter les logs pendant les tests
    console.log = jest.fn();
    
    // Mock des middlewares par défaut
    authMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: '507f1f77bcf86cd799439011', isAdmin: false };
      next();
    });
    
    isAdmin.mockImplementation((req, res, next) => {
      if (req.user && req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: 'Accès refusé' });
      }
    });
  });

  describe('POST /users/signup', () => {
    it('devrait appeler le contrôleur signup', async () => {
      UserController.signup.mockImplementation((req, res) => {
        res.status(201).json({ message: 'Utilisateur créé' });
      });

      const userData = {
        pseudo: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/signup')
        .send(userData);

      expect(UserController.signup).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Utilisateur créé');
    });

    it('devrait transmettre les données du body au contrôleur', async () => {
      UserController.signup.mockImplementation((req, res) => {
        res.status(201).json({ receivedData: req.body });
      });

      const userData = {
        pseudo: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/signup')
        .send(userData);

      expect(response.body.receivedData).toEqual(userData);
    });
  });

  describe('POST /users/login', () => {
    it('devrait appeler le contrôleur login', async () => {
      UserController.login.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Connexion réussie' });
      });

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      expect(UserController.login).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Connexion réussie');
    });
  });

  describe('GET /users/me', () => {
    it('devrait appeler le middleware d\'authentification', async () => {
      UserController.getCurrentUser.mockImplementation((req, res) => {
        res.status(200).json({ user: req.user });
      });

      await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer valid-token');

      expect(authMiddleware).toHaveBeenCalled();
      expect(UserController.getCurrentUser).toHaveBeenCalled();
    });

    it('devrait retourner les informations de l\'utilisateur connecté', async () => {
      const mockUser = { id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      
      authMiddleware.mockImplementation((req, res, next) => {
        req.user = mockUser;
        next();
      });
      
      UserController.getCurrentUser.mockImplementation((req, res) => {
        res.status(200).json({ user: req.user });
      });

      const response = await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);
    });

    it('devrait retourner une erreur si non authentifié', async () => {
      authMiddleware.mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Non authentifié' });
      });

      const response = await request(app)
        .get('/users/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Non authentifié');
    });
  });

  describe('GET /users', () => {
    it('devrait appeler le contrôleur getUsers', async () => {
      UserController.getUsers.mockImplementation((req, res) => {
        res.status(200).json({ users: [] });
      });

      const response = await request(app)
        .get('/users');

      expect(UserController.getUsers).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /users/:id', () => {
    it('devrait appeler le contrôleur getUserById avec le bon ID', async () => {
      const userId = '507f1f77bcf86cd799439011';
      
      UserController.getUserById.mockImplementation((req, res) => {
        res.status(200).json({ user: { id: req.params.id } });
      });

      const response = await request(app)
        .get(`/users/${userId}`);

      expect(UserController.getUserById).toHaveBeenCalled();
      expect(response.body.user.id).toBe(userId);
    });

    it('ne devrait pas confondre /me avec un ID', async () => {
      UserController.getCurrentUser.mockImplementation((req, res) => {
        res.status(200).json({ route: 'getCurrentUser' });
      });
      
      UserController.getUserById.mockImplementation((req, res) => {
        res.status(200).json({ route: 'getUserById' });
      });

      // Test que /me utilise getCurrentUser
      const meResponse = await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer valid-token');

      expect(meResponse.body.route).toBe('getCurrentUser');

      // Test qu'un vrai ID utilise getUserById
      const idResponse = await request(app)
        .get('/users/507f1f77bcf86cd799439011');

      expect(idResponse.body.route).toBe('getUserById');
    });
  });

  describe('POST /users/promote/:userId', () => {
    it('devrait appeler le contrôleur makeAdmin', async () => {
      const userId = '507f1f77bcf86cd799439011';
      
      UserController.makeAdmin.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Utilisateur promu' });
      });

      const response = await request(app)
        .post(`/users/promote/${userId}`);

      expect(UserController.makeAdmin).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /users/:id', () => {
    it('devrait appeler le contrôleur deleteUser', async () => {
      const userId = '507f1f77bcf86cd799439011';
      
      UserController.deleteUser.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Utilisateur supprimé' });
      });

      const response = await request(app)
        .delete(`/users/${userId}`);

      expect(UserController.deleteUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /users/:id', () => {
    it('devrait appeler le contrôleur updateUser', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { pseudo: 'newpseudo' };
      
      UserController.updateUser.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Utilisateur mis à jour' });
      });

      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updateData);

      expect(UserController.updateUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('devrait transmettre les données de mise à jour', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { pseudo: 'newpseudo', email: 'new@example.com' };
      
      UserController.updateUser.mockImplementation((req, res) => {
        res.status(200).json({ receivedData: req.body });
      });

      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updateData);

      expect(response.body.receivedData).toEqual(updateData);
    });
  });

  describe('Route ordering', () => {
    it('devrait prioriser /me sur /:id', async () => {
      UserController.getCurrentUser.mockImplementation((req, res) => {
        res.status(200).json({ route: 'me' });
      });
      
      UserController.getUserById.mockImplementation((req, res) => {
        res.status(200).json({ route: 'id', id: req.params.id });
      });

      // /me ne devrait pas être traité comme un ID
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer valid-token');

      expect(response.body.route).toBe('me');
      expect(UserController.getCurrentUser).toHaveBeenCalled();
      expect(UserController.getUserById).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('devrait gérer les erreurs des contrôleurs', async () => {
      UserController.getUsers.mockImplementation((req, res) => {
        res.status(500).json({ message: 'Erreur serveur' });
      });

      const response = await request(app)
        .get('/users');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erreur serveur');
    });

    it('devrait gérer les erreurs de middleware', async () => {
      authMiddleware.mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Token invalide' });
      });

      const response = await request(app)
        .get('/users/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token invalide');
    });
  });
});