const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Routes publiques
router.post('/register',        register);
router.post('/login',           login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

// Route protégée
router.post('/logout', authMiddleware, logout);

module.exports = router;
