# 🚀 RED PRODUCT — Backend API

## 📁 Structure du projet

```
backend/
├── src/
│   ├── app.js                    ← Point d'entrée Express
│   ├── controllers/
│   │   ├── auth.controller.js    ← Register, login, logout, forgot/reset password
│   │   ├── user.controller.js    ← Profil utilisateur connecté
│   │   ├── dashboard.controller.js ← KPIs dashboard
│   │   └── hotel.controller.js   ← Liste & création hôtels
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── dashboard.routes.js
│   │   └── hotel.routes.js
│   ├── models/
│   │   ├── user.model.js         ← Modèle User (name, email, password hashé, role)
│   │   └── hotel.model.js        ← Modèle Hôtel (name, address, email, phone, price...)
│   ├── middlewares/
│   │   ├── auth.middleware.js    ← Vérification JWT + injection req.user
│   │   └── upload.middleware.js  ← Multer pour l'upload d'images
│   ├── services/
│   │   └── email.service.js      ← Nodemailer (email de reset password)
│   └── utils/
│       └── db.js                 ← Connexion MongoDB
├── .env.example                  ← Variables d'environnement à copier
├── package.json
└── README.md
```

---

## ⚙️ Installation

```bash
cd backend
npm install
cp .env.example .env
# Remplir les variables dans .env
npm run dev
```

---

## 🔑 Variables d'environnement (.env)

| Variable              | Description                       |
|-----------------------|-----------------------------------|
| `PORT`                | Port du serveur (défaut: 5000)    |
| `DB_URI`              | URL MongoDB Atlas                 |
| `JWT_SECRET`          | Clé secrète pour les tokens JWT   |
| `JWT_EXPIRES_IN`      | Durée du token (ex: 7d)           |
| `EMAIL_HOST`          | SMTP host (ex: smtp.gmail.com)    |
| `EMAIL_PORT`          | SMTP port (587)                   |
| `EMAIL_USER`          | Adresse email expéditeur          |
| `EMAIL_PASS`          | Mot de passe app Gmail            |
| `CLIENT_URL`          | URL du frontend                   |

---

## 📡 Endpoints API

### Auth (publiques)
| Méthode | Route                        | Description                  |
|---------|------------------------------|------------------------------|
| POST    | /api/auth/register           | Inscription admin            |
| POST    | /api/auth/login              | Connexion → retourne JWT     |
| POST    | /api/auth/logout             | Déconnexion (protégé)        |
| POST    | /api/auth/forgot-password    | Envoi email de réinitialisation |
| POST    | /api/auth/reset-password     | Nouveau mot de passe         |

### Utilisateur (protégé)
| Méthode | Route           | Description                       |
|---------|-----------------|-----------------------------------|
| GET     | /api/users/me   | Profil de l'utilisateur connecté  |

### Dashboard (protégé)
| Méthode | Route                  | Description   |
|---------|------------------------|---------------|
| GET     | /api/dashboard/kpis    | KPIs globaux  |

### Hôtels (protégé)
| Méthode | Route          | Description                          |
|---------|----------------|--------------------------------------|
| GET     | /api/hotels    | Liste paginée (?page=1&limit=8)      |
| POST    | /api/hotels    | Créer un hôtel (multipart/form-data) |

---

## 🔐 Authentification

Toutes les routes protégées nécessitent le header :
```
Authorization: Bearer <votre_token_jwt>
```

Le token est retourné lors du login/register et doit être stocké en `localStorage`.

---

## 🌐 Déploiement Render

1. Push sur GitHub
2. Créer un service Web sur [render.com](https://render.com)
3. Build command : `npm install`
4. Start command : `node src/app.js`
5. Ajouter les variables d'environnement dans le dashboard Render
