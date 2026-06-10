const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');

// ── GET /api/dashboard/kpis ────────────────────────────────────────────────
exports.getKpis = async (req, res) => {
  try {
    const [users, hotels] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments()
    ]);

    res.status(200).json({
      users,
      hotels,
      messages: 40,   // Mock — à connecter quand le modèle Message existera
      emails: 25,     // Mock — à connecter quand le modèle Email existera
      entities: 2,    // Mock
      forms: 125      // Mock
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
