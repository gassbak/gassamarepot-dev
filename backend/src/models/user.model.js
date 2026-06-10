const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: 6,
    select: false  // Ne jamais retourner le password par défaut
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  // Reset password
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ── Hash du mot de passe avant sauvegarde ─────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Méthode de comparaison mot de passe ───────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
