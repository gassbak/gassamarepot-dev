const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Envoyer un email de réinitialisation de mot de passe
 * @param {string} to - Email du destinataire
 * @param {string} resetLink - Lien de réinitialisation
 */
const sendResetPasswordEmail = async (to, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: '🔑 Réinitialisation de votre mot de passe - RED PRODUCT',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="background:#45484B; color:white; padding:20px; text-align:center;">
          RED PRODUCT
        </h2>
        <div style="padding: 30px;">
          <h3>Réinitialisation de mot de passe</h3>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background:#45484B; color:white; padding:12px 30px; 
                      border-radius:6px; text-decoration:none; font-size:16px;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="color:#888; font-size:13px;">
            Ce lien expire dans <strong>1 heure</strong>.<br>
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
