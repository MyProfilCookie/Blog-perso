const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index');
const User = require('../../api/models/User');
const jwt = require('jsonwebtoken');

// Configuration de la base de données de test
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/siteblog_test';

describe('API Integration Tests', () => {
  let testUser;
  let adminUser;
  let userToken;
  let adminToken;

  beforeAll(async () => {
    // Vérifier si une connexion existe déjà
    if (mongoose.connection.readyState === 0) {
      // Connexion à la base de données de test seulement si pas déjà connecté
      await mongoose.connect(MONGODB_TEST_URI);
    } else {
      // Si déjà connecté, s'assurer qu'on utilise la bonne base de données
      console.log('Connexion MongoDB déjà active, utilisation de la connexion existante');
    }
  });

  afterAll(async () => {
    // Ne fermer la connexion que si nous l'avons ouverte dans ce test
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await User.deleteMany({});

    // Créer un utilisateur de test avec tous les champs requis
    testUser = new User({
      pseudo: 'testuser123',
      nom: 'Test',
      prenom: 'User',
      age: 25,
      email: 'test@example.com',
      password: '$2a$10$hashedpassword', // Mot de passe haché pour 'password123'
      role: 'user'
    });
    await testUser.save();

    // Créer un utilisateur admin de test avec tous les champs requis
    adminUser = new User({
      pseudo: 'adminuser123',
      nom: 'Admin',
      prenom: 'User',
      age: 30,
      email: 'admin@example.com',
      password: '$2a$10$hashedpassword',
      role: 'admin',
      isAdmin: true
    });
    await adminUser.save();

    // Générer des tokens JWT
    userToken = jwt.sign(
      { id: testUser._id, email: testUser.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { id: adminUser._id, email: adminUser.email, isAdmin: true },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  describe('User Authentication Endpoints', () => {
    describe('POST /api/users/signup', () => {
      it('devrait créer un nouvel utilisateur avec succès', async () => {
        const newUserData = {
          pseudo: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/users/signup')
          .send(newUserData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Inscription réussie!');
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();

        // Vérifier que l'utilisateur a été créé en base
        const createdUser = await User.findOne({ email: newUserData.email });
        expect(createdUser).toBeTruthy();
        expect(createdUser.pseudo).toBe(newUserData.pseudo);
      });

      it('devrait retourner une erreur si l\'email existe déjà', async () => {
        const existingUserData = {
          pseudo: 'anotheruser',
          email: 'test@example.com', // Email déjà utilisé
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/users/signup')
          .send(existingUserData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Cet email est déjà utilisé.');
      });

      it('devrait retourner une erreur si des champs sont manquants', async () => {
        const incompleteData = {
          pseudo: 'testuser'
          // email et password manquants
        };

        const response = await request(app)
          .post('/api/users/signup')
          .send(incompleteData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Tous les champs obligatoires doivent être remplis.');
      });
    });

    describe('POST /api/users/login', () => {
      it('devrait connecter un utilisateur avec des identifiants valides', async () => {
        // Utiliser bcrypt pour hasher le mot de passe de test
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Mettre à jour l'utilisateur de test avec le bon mot de passe haché
        await User.findByIdAndUpdate(testUser._id, { password: hashedPassword });

        const loginData = {
          email: 'test@example.com',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/users/login')
          .send(loginData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Connexion réussie!');
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(loginData.email);
      });

      it('devrait retourner une erreur pour un email inexistant', async () => {
        const loginData = {
          email: 'nonexistent@example.com',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/users/login')
          .send(loginData);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Utilisateur non trouvé.');
      });

      it('devrait retourner une erreur pour un mot de passe incorrect', async () => {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.findByIdAndUpdate(testUser._id, { password: hashedPassword });

        const loginData = {
          email: 'test@example.com',
          password: 'wrongpassword'
        };

        const response = await request(app)
          .post('/api/users/login')
          .send(loginData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Mot de passe incorrect.');
      });
    });

    describe('GET /api/users/me', () => {
      it('devrait retourner les informations de l\'utilisateur connecté', async () => {
        const response = await request(app)
          .get('/api/users/me')
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(testUser.email);
        expect(response.body.user.pseudo).toBe(testUser.pseudo);
      });

      it('devrait retourner une erreur sans token d\'authentification', async () => {
        const response = await request(app)
          .get('/api/users/me');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token invalide ou expiré.');
      });

      it('devrait retourner une erreur avec un token invalide', async () => {
        const response = await request(app)
          .get('/api/users/me')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token invalide ou expiré.');
      });
    });
  });

  describe('Admin Endpoints', () => {
    describe('POST /api/users/promote/:userId', () => {
      it('devrait permettre à un admin de promouvoir un utilisateur', async () => {
        const response = await request(app)
          .post(`/api/users/promote/${testUser._id}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Utilisateur promu administrateur avec succès.');

        // Vérifier que l'utilisateur a été promu en base
        const updatedUser = await User.findById(testUser._id);
        expect(updatedUser.role).toBe('admin');
      });

      it('devrait refuser l\'accès à un utilisateur non-admin', async () => {
        const response = await request(app)
          .post(`/api/users/promote/${testUser._id}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Accès refusé. Droits administrateur requis.');
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('devrait permettre de supprimer un utilisateur', async () => {
        const response = await request(app)
          .delete(`/api/users/${testUser._id}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Utilisateur supprimé avec succès.');

        // Vérifier que l'utilisateur a été supprimé de la base
        const deletedUser = await User.findById(testUser._id);
        expect(deletedUser).toBeNull();
      });

      it('devrait retourner une erreur pour un utilisateur inexistant', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .delete(`/api/users/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Utilisateur non trouvé.');
      });
    });
  });

  describe('Public Endpoints', () => {
    describe('GET /api/users', () => {
      it('devrait retourner la liste des utilisateurs', async () => {
        const response = await request(app)
          .get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body.users).toBeDefined();
        expect(Array.isArray(response.body.users)).toBe(true);
        expect(response.body.users.length).toBeGreaterThan(0);
      });
    });

    describe('GET /api/users/:id', () => {
      it('devrait retourner un utilisateur par son ID', async () => {
        const response = await request(app)
          .get(`/api/users/${testUser._id}`);

        expect(response.status).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(testUser.email);
        expect(response.body.user.pseudo).toBe(testUser.pseudo);
      });

      it('devrait retourner une erreur pour un ID inexistant', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .get(`/api/users/${fakeId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Utilisateur non trouvé.');
      });
    });
  });
});