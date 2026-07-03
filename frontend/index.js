const API_URL = "http://localhost:5000/api";

// ======================================================
// AUTHENTIFICATION
// ======================================================

const token = localStorage.getItem("token");

// Protection des pages
const protectedPages = ["dasboard.html", "listes.html"];
const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage) && !token) {
    window.location.href = "index.html";
}

// ======================================================
// CONNEXION
// ======================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(`${API_URL}/auth/login`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email,
                    password

                })

            });

            const data = await response.json();

            if (!response.ok) {

                return alert(data.message);

            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "dasboard.html";

        } catch (error) {

            console.log(error);

            alert("Impossible de contacter le serveur");

        }

    });

}

// ======================================================
// DECONNEXION
// ======================================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "index.html";

    });

}

// ======================================================
// MODAL
// ======================================================

const openModal = document.getElementById("openModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
const modalBox = document.getElementById("modalBox");

if (openModal) {

    openModal.addEventListener("click", () => {

        modalContent.classList.remove("hidden");

    });

}

if (closeModal) {

    closeModal.addEventListener("click", () => {

        modalContent.classList.add("hidden");

    });

}

if (modalContent) {

    modalContent.addEventListener("click", (e) => {

        if (!modalBox.contains(e.target)) {

            modalContent.classList.add("hidden");

        }

    });

}

// ======================================================
// VARIABLE D'EDITION
// ======================================================

let editingHotelId = null;

// ======================================================
// CREATION HOTEL
// ======================================================

const createHotelForm = document.getElementById("createHotelForm");

if (createHotelForm) {

    createHotelForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("name", document.getElementById("hotelName").value);
        formData.append("address", document.getElementById("hotelAddress").value);
        formData.append("email", document.getElementById("hotelEmail").value);
        formData.append("phone", document.getElementById("hotelPhone").value);
        formData.append("pricePerNight", document.getElementById("hotelPrice").value);
        formData.append("currency", document.getElementById("hotelCurrency").value);

        const image = document.getElementById("hotelImage");

        if (image && image.files.length > 0) {

            formData.append("image", image.files[0]);

        }

        try {

            let url = `${API_URL}/hotels`;
            let method = "POST";

            if (editingHotelId) {

                url = `${API_URL}/hotels/${editingHotelId}`;
                method = "PUT";

            }

            const response = await fetch(url, {

                method,

                headers: {

                    Authorization: `Bearer ${localStorage.getItem("token")}`

                },

                body: formData

            });

            const data = await response.json();

            if (!response.ok) {

                return alert(data.message);

            }

            alert(data.message);

            editingHotelId = null;

            createHotelForm.reset();

            modalContent.classList.add("hidden");

            loadHotels();

        } catch (error) {

            console.log(error);

            alert("Erreur serveur");

        }

    });

}

// ======================================================
// AFFICHER LES HOTELS
// ======================================================

async function loadHotels() {

    const grid = document.getElementById("hotelsGrid");

    const counter = document.getElementById("hotelsCount");

    if (!grid) return;

    try {

        const response = await fetch(`${API_URL}/hotels`, {

            headers: {

                Authorization: `Bearer ${localStorage.getItem("token")}`

            }

        });

        const data = await response.json();

        if (!response.ok) {

            return;

        }

        counter.textContent = data.pagination.total;

        grid.innerHTML = data.hotels.map(hotel => `

<div class="bg-white shadow rounded-lg overflow-hidden">

<img src="${hotel.image ? 'http://localhost:5000' + hotel.image : 'images/image.svg'}"

class="w-full h-48 object-cover">

<div class="p-4">

<p class="text-xs text-gray-500">${hotel.address}</p>

<h2 class="text-xl font-bold mt-2">${hotel.name}</h2>

<p class="mt-2">

${hotel.pricePerNight} ${hotel.currency}

</p>

<div class="flex gap-3 mt-4">

<button

onclick="editHotel('${hotel._id}')"

class="bg-blue-600 text-white px-3 py-2 rounded">

Modifier

</button>

<button

onclick="deleteHotel('${hotel._id}')"

class="bg-red-600 text-white px-3 py-2 rounded">

Supprimer

</button>

</div>

</div>

</div>

`).join("");

    } catch (error) {

        console.log(error);

    }

}

loadHotels();

// ======================================================
// MODIFIER UN HÔTEL
// ======================================================

async function editHotel(id) {

    try {

        const response = await fetch(`${API_URL}/hotels`, {

            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }

        });

        const data = await response.json();

        const hotel = data.hotels.find(h => h._id === id);

        if (!hotel) {

            return alert("Hôtel introuvable");

        }

        // Remplir le formulaire

        document.getElementById("hotelName").value = hotel.name;
        document.getElementById("hotelAddress").value = hotel.address;
        document.getElementById("hotelEmail").value = hotel.email;
        document.getElementById("hotelPhone").value = hotel.phone;
        document.getElementById("hotelPrice").value = hotel.pricePerNight;
        document.getElementById("hotelCurrency").value = hotel.currency;

        // Passer en mode édition

        editingHotelId = hotel._id;

        // Ouvrir le modal

        modalContent.classList.remove("hidden");

    } catch (error) {

        console.error(error);

        alert("Erreur lors du chargement de l'hôtel");

    }

}

// ======================================================
// SUPPRIMER UN HÔTEL
// ======================================================

async function deleteHotel(id) {

    const confirmation = confirm("Voulez-vous vraiment supprimer cet hôtel ?");

    if (!confirmation) return;

    try {

        const response = await fetch(`${API_URL}/hotels/${id}`, {

            method: "DELETE",

            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            return alert(data.message);

        }

        alert(data.message);

        loadHotels();

    } catch (error) {

        console.error(error);

        alert("Erreur serveur");

    }

}

// ======================================================
// RENDRE LES FONCTIONS ACCESSIBLES AUX BOUTONS
// ======================================================

window.editHotel = editHotel;
window.deleteHotel = deleteHotel;
// const API_URL = 'http://localhost:5000/api';

// // ── Elements modaux ────────────────────────────────────────────────────────
// const openModal    = document.getElementById('openModal');
// const modalContent = document.getElementById('modalContent');
// const closeModal   = document.getElementById('closeModal');
// const modalBox     = document.getElementById('modalBox');

// if (openModal && modalContent) {
//   openModal.addEventListener('click', () => modalContent.classList.remove('hidden'));
// }
// if (closeModal && modalContent) {
//   closeModal.addEventListener('click', () => modalContent.classList.add('hidden'));
// }
// if (modalContent && modalBox) {
//   modalContent.addEventListener('click', (e) => {
//     if (!modalBox.contains(e.target)) modalContent.classList.add('hidden');
//   });
// }

// // ── Sidebar / hamburger ────────────────────────────────────────────────────
// const hamburger = document.getElementById('hamburger');
// const sidebar   = document.getElementById('sidebar');
// const overlay   = document.getElementById('overlay');

// if (hamburger && sidebar) {
//   hamburger.addEventListener('click', () => {
//     sidebar.classList.toggle('-translate-x-full');
//     sidebar.classList.toggle('translate-x-0');
//     if (overlay) {
//       overlay.classList.toggle('hidden');
//       overlay.classList.toggle('opacity-100');
//     }
//   });
// }
// if (overlay && sidebar) {
//   overlay.addEventListener('click', () => {
//     sidebar.classList.add('-translate-x-full', 'opacity-0');
//     sidebar.classList.remove('translate-x-0', 'opacity-100');
//     overlay.classList.add('hidden');
//   });
// }

// // ── Formulaire de connexion ────────────────────────────────────────────────
// const loginForm = document.getElementById('loginForm');
// if (loginForm) {
//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email    = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     try {
//       const res  = await fetch(`${API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         window.location.href = 'dasboard.html';
//       } else {
//         alert('❌ ' + (data.message || 'Identifiants incorrects'));
//       }
//     } catch (err) {
//       alert('Impossible de contacter le serveur');
//     }
//   });
// }

// // ── Déconnexion ────────────────────────────────────────────────────────────
// const logoutBtn = document.getElementById('logoutBtn');
// if (logoutBtn) {
//   logoutBtn.addEventListener('click', async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');

//     try {
//       await fetch(`${API_URL}/auth/logout`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//     } catch (_) {}

//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     window.location.href = 'index.html';
//   });
// }

// // ── Protection des pages (redirection si non connecté) ────────────────────
// const protectedPages = ['dasboard.html', 'listes.html'];
// const currentPage    = window.location.pathname.split('/').pop();
// if (protectedPages.includes(currentPage)) {
//   const token = localStorage.getItem('token');
//   if (!token) window.location.href = 'index.html';
// }

//     // Modal ouverture/fermeture
//     const openModal    = document.getElementById('openModal');
//     const modalContent = document.getElementById('modalContent');
//     const closeModal   = document.getElementById('closeModal');
//     const modalBox     = document.getElementById('modalBox');
//     if (openModal)    openModal.addEventListener('click', () => modalContent.classList.remove('hidden'));
//     if (closeModal)   closeModal.addEventListener('click', () => modalContent.classList.add('hidden'));
//     if (modalContent) modalContent.addEventListener('click', (e) => {
//       if (!modalBox.contains(e.target)) modalContent.classList.add('hidden');
//     });

//     // Soumission du formulaire hôtel (modal)
//     const hotelForm = document.querySelector('#modalBox form');
//     if (hotelForm) {
//       hotelForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const inputs  = hotelForm.querySelectorAll('input, select');
//         const formData = new FormData();
//         formData.append('name',          inputs[0].value);
//         formData.append('address',       inputs[1].value);
//         formData.append('email',         inputs[2].value);
//         formData.append('phone',         inputs[3].value);
//         formData.append('pricePerNight', inputs[4].value);
//         formData.append('currency',      hotelForm.querySelector('select').value);
//         const imgInput = hotelForm.querySelector('input[type="file"]');
//         if (imgInput && imgInput.files[0]) formData.append('image', imgInput.files[0]);

//         try {
//           const res  = await fetch(`${API_URL}/hotels`, {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${token}` },
//             body: formData
//           });
//           const data = await res.json();
//           if (res.ok) {
//             alert('✅ Hôtel créé avec succès !');
//             modalContent.classList.add('hidden');
//             loadHotels();
//           } else {
//             alert('❌ ' + (data.message || 'Erreur'));
//           }
//         } catch(err) {
//           alert('❌ Erreur de connexion au serveur');
//         }
//       });
//     } 

// // ── Formulaire création hôtel ──────────────────────────────────────────────
// const createHotelForm = document.getElementById('createHotelForm');
// if (createHotelForm) {
//   createHotelForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const token = localStorage.getItem('token');
//     const name = document.getElementById('hotelName').value;
//     const address = document.getElementById('hotelAddress').value;
//     const email = document.getElementById('hotelEmail').value;
//     const phone = document.getElementById('hotelPhone').value;
//     const pricePerNight = document.getElementById('hotelPrice').value;
//     const currency = document.getElementById('hotelCurrency').value;
//     const imageFile = document.getElementById('hotelImage').files[0];

//     try {
//       const formData = new FormData();
//       formData.append('name', name);
//       formData.append('address', address);
//       formData.append('email', email);
//       formData.append('phone', phone);
//       formData.append('pricePerNight', pricePerNight);
//       formData.append('currency', currency);
//       if (imageFile) {
//         formData.append('image', imageFile);
//       }

//       const res = await fetch(`${API_URL}/hotels`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body: formData
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert('✅ Hôtel créé avec succès!');
//         createHotelForm.reset();
//         document.getElementById('modalContent').classList.add('hidden');
//         // Recharger la page pour voir le nouvel hôtel
//         location.reload();
//       } else {
//         alert('❌ ' + (data.message || 'Erreur lors de la création'));
//       }
//     } catch (err) {
//       console.error('Erreur:', err);
//       alert('❌ Impossible de contacter le serveur');
//     }
//   });
// }

// // ============================
// // SUPPRIMER UN HÔTEL
// // ============================

// async function deleteHotel(id) {
//     console.log("Suppression :", id);

//     const confirmation = confirm("Voulez-vous vraiment supprimer cet hôtel ?");
    


//     if (!confirmation) return;

//     const token = localStorage.getItem("token");

//     try {

//         const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {

//             method: "DELETE",

//             headers: {
//                 Authorization: `Bearer ${token}`
//             }

//         });

//         const data = await response.json();

//         if (response.ok) {

//             alert(data.message);

//             location.reload();

//         } else {

//             alert(data.message);

//         }

//     } catch (error) {

//         console.error(error);

//         alert("Erreur serveur");

//     }

// }
// // ============================
// // MODIFIER UN HÔTEL
// // ============================

// async function editHotel(id) {
//     console.log("Modification :", id);



//     try {

//         const response = await fetch("http://localhost:5000/api/hotels", {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });

//         const data = await response.json();

//         const hotel = data.hotels.find(h => h._id === id);

//         if (!hotel) {
//             alert("Hôtel introuvable");
//             return;
//         }

//         // Remplir le formulaire
//         document.getElementById("hotelName").value = hotel.name;
//         document.getElementById("hotelAddress").value = hotel.address;
//         document.getElementById("hotelEmail").value = hotel.email;
//         document.getElementById("hotelPhone").value = hotel.phone;
//         document.getElementById("hotelPrice").value = hotel.pricePerNight;
//         document.getElementById("hotelCurrency").value = hotel.currency;

//         // Ouvrir le modal
       
//         modalContent.classList.remove("hidden");
//         modalContent.classList.add("flex");

//         // Sauvegarder l'id à modifier
//         saveBtn.dataset.id = hotel._id;

//     } catch (error) {

//         console.log(error);

//     }

// }

//     // Charger les hôtels depuis l'API
//     async function loadHotels() {
//       const grid    = document.getElementById('hotelsGrid');
//       const counter = document.getElementById('hotelsCount');
//       if (!grid) return;

//       try {
//         const res  = await fetch(`${API_URL}/hotels`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await res.json();

//         if (!res.ok || data.hotels.length === 0) {
//           // Aucun hôtel en DB → garder les cartes statiques
//           return;
//         }

//         // Mettre à jour le compteur
//         if (counter) counter.textContent = data.pagination.total;

//         // Remplacer les cartes par les données de l'API
// grid.innerHTML = data.hotels.map(h => `
// <div class="bg-white shadow rounded-lg overflow-hidden">
//     <img src="${h.image ? 'http://localhost:5000' + h.image : 'images/image.svg'}"
//          class="w-full h-40 object-cover">

//     <div class="p-4">
//         <p class="text-xs text-[#8D4B38]">${h.address}</p>

//         <h2 class="text-lg font-semibold">${h.name}</h2>

//         <p class="text-xs mt-2">
//             ${Number(h.pricePerNight).toLocaleString("fr-FR")} ${h.currency} par nuit
//         </p>

//         <div class="flex gap-2 mt-4">
//             <button
//                 onclick="editHotel('${h._id}')"
//                 class="bg-blue-600 text-white px-3 py-1 rounded">
//                 Modifier
//             </button>

//             <button
//                 onclick="deleteHotel('${h._id}')"
//                 class="bg-red-600 text-white px-3 py-1 rounded">
//                 Supprimer
//             </button>

//         </div>

//     </div>
// </div>
// `).join('');


//       } catch(err) {
//         console.error('Erreur chargement hôtels :', err);
//         // En cas d'erreur réseau → garder les cartes statiques
//       }
//     }
//     loadHotels();
//         window.deleteHotel = deleteHotel;
//         window.editHotel = editHotel;
