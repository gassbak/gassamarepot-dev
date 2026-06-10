const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

dotenv.config();

const app = express();

// ── Connexion base de données ──────────────────────────────────────────────
connectDB();

// ── Middlewares globaux ────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Dossier uploads statique ───────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/users',     require('./routes/user.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/hotels',    require('./routes/hotel.routes'));

// ── Route racine ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 RED PRODUCT API is running' });
});

// ── Gestion des erreurs 404 ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// ── Gestion des erreurs globale ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur :', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur'
  });
});

// ── Lancement du serveur ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
