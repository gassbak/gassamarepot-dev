const Hotel = require('../models/hotel.model');

// ── GET /api/hotels ────────────────────────────────────────────────────────
exports.getHotels = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip  = (page - 1) * limit;

    // Recherche optionnelle
    const search = req.query.search || '';
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    // Tri optionnel (ex: ?sort=pricePerNight ou ?sort=-pricePerNight)
    const sortField = req.query.sort || '-createdAt';

    const [hotels, total] = await Promise.all([
      Hotel.find(query)
        .sort(sortField)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
      Hotel.countDocuments(query)
    ]);

    res.status(200).json({
      hotels,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ── POST /api/hotels ───────────────────────────────────────────────────────
exports.createHotel = async (req, res) => {
  try {
    const { name, address, email, phone, pricePerNight, currency } = req.body;

    // Validation basique
    if (!name || !address || !email || !phone || !pricePerNight) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    // Image uploadée par multer
    const image = req.file ? `/uploads/hotels/${req.file.filename}` : '';

    const hotel = await Hotel.create({
      name,
      address,
      email,
      phone,
      pricePerNight: Number(pricePerNight),
      currency: currency || 'XOF',
      image,
      createdBy: req.user._id
    });

    res.status(201).json({ message: 'Hôtel créé avec succès.', hotel });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
