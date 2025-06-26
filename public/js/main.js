// js/main.js
import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

window.addEventListener('DOMContentLoaded', () => {
  // Load Navbar & Footer
  fetch('components/navbar.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navbar-placeholder').innerHTML = data;

    // Setelah navbar dimuat, ambil elemen burger dan menu
    const burger = document.getElementById('burger');
    const navMenu = document.querySelector('.nav-menu');

    if (burger && navMenu) {
      burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }
  });


  fetch('components/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    });

  // Load Skills
  const skillsGrid = document.getElementById('skillsGrid');
  if (skillsGrid) {
    getDocs(collection(db, 'skills')).then(snapshot => {
      skillsGrid.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = 'skill-item';
        div.innerHTML = `<img src="${data.icon}" alt="${data.name}" title="${data.name}">`;
        skillsGrid.appendChild(div);
      });
    }).catch(err => {
      console.error('❌ Gagal memuat skills:', err);
    });
  }

  // Load Education
  const eduContainer = document.getElementById('educationData');
  if (eduContainer) {
    getDocs(collection(db, 'education')).then(snapshot => {
      eduContainer.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = 'edu-box';
        div.innerHTML = `
          <p class="edu-year">${data.year}</p>
          <p class="edu-school">${data.school}</p>
        `;
        eduContainer.appendChild(div);
      });
    }).catch(err => {
      console.error('❌ Gagal memuat education:', err);
    });
  }
});

// Load Organization Data
const orgContainer = document.getElementById('organizationData');
if (orgContainer) {
  getDocs(collection(db, 'organization')).then((querySnapshot) => {
    orgContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const box = document.createElement('div');
      box.className = 'edu-box';
      box.innerHTML = `
        <p class="edu-year">${data.year}</p>
        <p class="edu-school">${data.name}</p>
      `;
      orgContainer.appendChild(box);
    });
  }).catch((error) => {
    console.error('❌ Gagal mengambil data organization:', error);
  });
}

  // Load Activity
  const activityContainer = document.getElementById('activityData');
  if (activityContainer) {
    getDocs(collection(db, 'activity')).then((snapshot) => {
      activityContainer.innerHTML = '';
      snapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.innerHTML = `
          <h3 class="activity-name">${data.name}</h3>
          <p class="activity-date">${data.date}</p>
          <p class="activity-desc">${data.desc}</p>
        `;
        activityContainer.appendChild(card);
      });
    }).catch((err) => {
      console.error('❌ Gagal memuat aktivitas:', err);
    });
  }

  window.addEventListener('DOMContentLoaded', async () => {
    // Load Projects
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (projectsGrid) {
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            projectsGrid.innerHTML = '';
            
            querySnapshot.forEach(doc => {
                const project = doc.data();
                
                const projectCard = `
                    <div class="project-card">
                        <div class="project-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                        </div>
                        <a href="${project.link}" 
                           target="_blank" 
                           class="project-link"
                           aria-label="View ${project.title}">
                            View Project
                            <span class="link-icon">→</span>
                        </a>
                    </div>
                `;
                
                projectsGrid.insertAdjacentHTML('beforeend', projectCard);
            });

        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
        }
    }
});

// Load Articles
  const articlesGrid = document.querySelector('.articles-section .container');
  if (articlesGrid) {
    getDocs(collection(db, 'articles'))
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();

          const card = document.createElement('div');
          card.className = 'article-card';
          card.innerHTML = `
            <h2 class="article-title">${data.title || '(Tanpa Judul)'}</h2>
            <p class="article-desc">${data.desc || ''}</p>
          `;

          articlesGrid.appendChild(card);
        });
      })
      .catch((err) => {
        const warning = document.createElement('p');
        warning.style.color = 'crimson';
        warning.style.textAlign = 'center';
        warning.textContent = '⚠️ Gagal memuat artikel. Silakan refresh halaman.';
        articlesGrid.appendChild(warning);

        console.error('❌ Gagal memuat artikel:', err);
      });
  }

  // Load Service Fee
const servicesList = document.getElementById('servicesList');
if (servicesList) {
  getDocs(collection(db, 'services'))
    .then((snapshot) => {
      servicesList.innerHTML = ''; // Kosongkan list
      snapshot.forEach((doc) => {
        const service = doc.data();
        const li = document.createElement('li');
        li.innerHTML = `🔹 ${service.name} : Mulai dari ${formatPrice(service.price)}`;
        servicesList.appendChild(li);
      });
    })
    .catch((err) => {
      console.error('❌ Gagal memuat service fee:', err);
      servicesList.innerHTML = '<li>Service information not available</li>';
    });
}

// Fungsi format harga ke IDR
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}

// Load Gallery
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
  getDocs(collection(db, 'gallery'))
    .then((snapshot) => {
      galleryGrid.innerHTML = ''; // Kosongkan gallery
      snapshot.forEach((doc) => {
        const item = doc.data();
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
          <img src="${item.image}" alt="${item.title || 'Gallery item'}">
          <p class="caption">${item.caption || ''}${item.category ? ` (${item.category})` : ''}</p>
        `;
        galleryGrid.appendChild(galleryItem);
      });
    })
    .catch((err) => {
      console.error('❌ Gagal memuat gallery:', err);
      galleryGrid.innerHTML = '<p>Gallery content not available</p>';
    });
}

