// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/User.routes');
const subjectRoutes = require('./routes/subject.routes');
const eleveRoutes = require('./routes/eleve.routes');

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/eleves', eleveRoutes); 