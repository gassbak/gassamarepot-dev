const express = require("express");
const router = express.Router();

const {
    getHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel
} = require("../controllers/hotel.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// Toutes les routes sont protégées
router.get("/", authMiddleware, getHotels);

router.get("/:id", authMiddleware, getHotelById);

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    createHotel
);

router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    updateHotel
);

router.delete("/:id", authMiddleware, deleteHotel);

module.exports = router;