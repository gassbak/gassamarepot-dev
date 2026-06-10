// ── GET /api/users/me ──────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    // req.user est injecté par authMiddleware
    const user = req.user;
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
