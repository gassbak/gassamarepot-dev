const express = require('express');
const router = express.Router();
const { getKpis } = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/dashboard/kpis — protégé
router.get('/kpis', authMiddleware, getKpis);

module.exports = router;
