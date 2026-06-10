const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/users/me — profil utilisateur connecté
router.get('/me', authMiddleware, getMe);

module.exports = router;
