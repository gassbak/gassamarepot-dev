const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    const token = authHeader.split(' ')[1];

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Injecter l'utilisateur dans la requête
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré. Veuillez vous reconnecter.' });
    }
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = authMiddleware;
