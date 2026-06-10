const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendResetPasswordEmail } = require('../services/email.service');

// ── Générer un JWT ─────────────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// ── POST /api/auth/register ────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Vérifier email unique
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Compte créé avec succès.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // Récupérer le user avec le password (select: false par défaut)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ── POST /api/auth/logout ──────────────────────────────────────────────────
exports.logout = (req, res) => {
  // Le token est côté client → le frontend le supprime
  // Côté backend on confirme juste la déconnexion
  res.status(200).json({ message: 'Déconnexion réussie. Supprimez le token côté client.' });
};

// ── POST /api/auth/forgot-password ────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "L'email est obligatoire." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Sécurité : ne pas révéler si l'email existe ou non
      return res.status(200).json({ message: 'Si cet email existe, un lien a été envoyé.' });
    }

    // Générer un token temporaire sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + (process.env.RESET_TOKEN_EXPIRES || 3600000); // 1h
    await user.save({ validateBeforeSave: false });

    // Envoyer l'email
    const resetLink = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;
    await sendResetPasswordEmail(user.email, resetLink);

    res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.', error: err.message });
  }
};

// ── POST /api/auth/reset-password ─────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token et nouveau mot de passe requis.' });
    }

    // Hasher le token reçu pour comparaison
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    // Mettre à jour le mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
