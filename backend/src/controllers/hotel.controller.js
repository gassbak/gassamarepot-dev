const Hotel = require("../models/hotel.model");

// ============================
// GET TOUS LES HÔTELS
// ============================
exports.getHotels = async (req, res) => {
    try {

        const hotels = await Hotel.find().populate("createdBy", "name email");

        res.status(200).json({
            hotels,
            pagination: {
                total: hotels.length
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });

    }
};

// ============================
// GET UN HÔTEL
// ============================
exports.getHotelById = async (req, res) => {

    try {

        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                message: "Hôtel introuvable"
            });
        }

        res.status(200).json(hotel);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ============================
// CRÉER UN HÔTEL
// ============================
exports.createHotel = async (req, res) => {

    try {

        const {
            name,
            address,
            email,
            phone,
            pricePerNight,
            currency
        } = req.body;

        const image = req.file
            ? `/uploads/hotels/${req.file.filename}`
            : "";

        const hotel = await Hotel.create({

            name,
            address,
            email,
            phone,
            pricePerNight,
            currency,
            image,
            createdBy: req.user._id

        });

        res.status(201).json({

            message: "Hôtel créé avec succès",
            hotel

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ============================
// MODIFIER UN HÔTEL
// ============================
exports.updateHotel = async (req, res) => {

    try {

        const updateData = {

            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            pricePerNight: req.body.pricePerNight,
            currency: req.body.currency

        };

        if (req.file) {

            updateData.image = `/uploads/hotels/${req.file.filename}`;

        }

        const hotel = await Hotel.findByIdAndUpdate(

            req.params.id,

            updateData,

            { new: true }

        );

        if (!hotel) {

            return res.status(404).json({

                message: "Hôtel introuvable"

            });

        }

        res.status(200).json({

            message: "Hôtel modifié avec succès",
            hotel

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ============================
// SUPPRIMER UN HÔTEL
// ============================
exports.deleteHotel = async (req, res) => {

    try {

        const hotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!hotel) {

            return res.status(404).json({

                message: "Hôtel introuvable"

            });

        }

        res.status(200).json({

            message: "Hôtel supprimé avec succès"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};