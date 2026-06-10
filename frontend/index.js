const API_URL = 'http://localhost:5000/api';

// ── Elements modaux ────────────────────────────────────────────────────────
const openModal    = document.getElementById('openModal');
const modalContent = document.getElementById('modalContent');
const closeModal   = document.getElementById('closeModal');
const modalBox     = document.getElementById('modalBox');

if (openModal && modalContent) {
  openModal.addEventListener('click', () => modalContent.classList.remove('hidden'));
}
if (closeModal && modalContent) {
  closeModal.addEventListener('click', () => modalContent.classList.add('hidden'));
}
if (modalContent && modalBox) {
  modalContent.addEventListener('click', (e) => {
    if (!modalBox.contains(e.target)) modalContent.classList.add('hidden');
  });
}

// ── Sidebar / hamburger ────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');

if (hamburger && sidebar) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    sidebar.classList.toggle('translate-x-0');
    if (overlay) {
      overlay.classList.toggle('hidden');
      overlay.classList.toggle('opacity-100');
    }
  });
}
if (overlay && sidebar) {
  overlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full', 'opacity-0');
    sidebar.classList.remove('translate-x-0', 'opacity-100');
    overlay.classList.add('hidden');
  });
}

// ── Formulaire de connexion ────────────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res  = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'dasboard.html';
      } else {
        alert('❌ ' + (data.message || 'Identifiants incorrects'));
      }
    } catch (err) {
      alert('Impossible de contacter le serveur');
    }
  });
}

// ── Déconnexion ────────────────────────────────────────────────────────────
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (_) {}

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });
}

// ── Protection des pages (redirection si non connecté) ────────────────────
const protectedPages = ['dasboard.html', 'listes.html'];
const currentPage    = window.location.pathname.split('/').pop();
if (protectedPages.includes(currentPage)) {
  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'index.html';
}

// ── Formulaire création hôtel ──────────────────────────────────────────────
const createHotelForm = document.getElementById('createHotelForm');
if (createHotelForm) {
  createHotelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const name = document.getElementById('hotelName').value;
    const address = document.getElementById('hotelAddress').value;
    const email = document.getElementById('hotelEmail').value;
    const phone = document.getElementById('hotelPhone').value;
    const pricePerNight = document.getElementById('hotelPrice').value;
    const currency = document.getElementById('hotelCurrency').value;
    const imageFile = document.getElementById('hotelImage').files[0];

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address', address);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('pricePerNight', pricePerNight);
      formData.append('currency', currency);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch(`${API_URL}/hotels`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Hôtel créé avec succès!');
        createHotelForm.reset();
        document.getElementById('modalContent').classList.add('hidden');
        // Recharger la page pour voir le nouvel hôtel
        location.reload();
      } else {
        alert('❌ ' + (data.message || 'Erreur lors de la création'));
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert('❌ Impossible de contacter le serveur');
    }
  });
}
