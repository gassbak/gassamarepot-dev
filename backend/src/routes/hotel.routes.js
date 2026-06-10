const express = require('express');
const router = express.Router();
const { getHotels, createHotel } = require('../controllers/hotel.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Toutes les routes hôtel sont protégées
router.get('/',  authMiddleware, getHotels);
router.post('/', authMiddleware, upload.single('image'), createHotel);

module.exports = router;
