import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc,
  serverTimestamp,
  query,
  orderBy 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnPysAHewJAo6dZsQ7c3Llq5HHev423OM",
  authDomain: "portofolio-sapar-fb224.firebaseapp.com",
  projectId: "portofolio-sapar-fb224",
  storageBucket: "portofolio-sapar-fb224.appspot.com",
  messagingSenderId: "715228360811",
  appId: "1:715228360811:web:87a62c2c6524b9ffd9c12e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const navLinks = document.querySelectorAll('.sidebar-menu a[data-section]');
const sections = document.querySelectorAll('.section');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initLogout();
  initForms();
  loadInitialData();
  initImagePreview();
});

// Initialize Image Preview
function initImagePreview() {
  const imageInput = document.getElementById('projectImage');
  const imagePreview = document.getElementById('imagePreview');

  if (imageInput && imagePreview) {
    imageInput.addEventListener('input', () => {
      const url = imageInput.value;
      if (url) {
        imagePreview.src = url;
        imagePreview.style.display = 'block';
      } else {
        imagePreview.style.display = 'none';
      }
    });
  }
}

// Navigation Handler
function initNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = e.currentTarget.dataset.section;
      
      // Update active nav link
      navLinks.forEach(link => link.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      // Show corresponding section
      sections.forEach(section => section.classList.remove('active'));
      document.getElementById(target).classList.add('active');

      // Load data for the section
      loadSectionData(target);
    });
  });
}

// Logout Handler
function initLogout() {
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = 'login.html';
    }
  });
}

// Form Initialization
function initForms() {
  initSkillForm();
  initEducationForm();
  initOrganizationForm();
  initActivityForm();
  initProjectForm();
  initArticleForm();
  initGalleryForm();
  initServiceFeeForm();
}

// ==============================================
// SKILLS SECTION
// ==============================================
function initSkillForm() {
  const form = document.getElementById('skillForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('skillId').value;
    const name = document.getElementById('skillName').value;
    const icon = document.getElementById('skillIcon').value;
    
    if (!name || !icon) {
      showToast('Skill name and icon are required', true);
      return;
    }

    try {
      const skillData = {
        name: name,
        icon: icon,
        updatedAt: serverTimestamp()
      };
      
      if (id) {
        await updateDoc(doc(db, 'skills', id), skillData);
        showToast('Skill updated successfully');
      } else {
        await addDoc(collection(db, 'skills'), {
          ...skillData,
          createdAt: serverTimestamp()
        });
        showToast('Skill added successfully');
      }
      
      form.reset();
      document.getElementById('skillId').value = '';
      loadSkills();
    } catch (err) {
      showToast('Error saving skill: ' + err.message, true);
      console.error('Error saving skill:', err);
    }
  });
}

async function loadSkills() {
  const list = document.getElementById('skillsList');
  if (!list) return;

  list.innerHTML = '<li class="loading">Loading skills...</li>';

  try {
    const q = query(collection(db, 'skills'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    list.innerHTML = '';
    
    if (querySnapshot.empty) {
      list.innerHTML = '<li class="empty">No skills found</li>';
      return;
    }
    
    querySnapshot.forEach(docSnap => {
      const skill = docSnap.data();
      const li = document.createElement('li');
      li.className = 'data-list-item';
      li.innerHTML = `
        <div class="data-list-content">
          <img src="${skill.icon}" alt="${skill.name}" width="24" height="24">
          <span>${skill.name}</span>
        </div>
        <div class="data-list-actions">
          <button class="btn btn-edit" onclick="editSkill('${docSnap.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteSkill('${docSnap.id}')">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    list.innerHTML = '<li class="error">Failed to load skills</li>';
    console.error('Error loading skills:', error);
  }
}

window.editSkill = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, 'skills', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('skillId').value = id;
      document.getElementById('skillName').value = data.name || '';
      document.getElementById('skillIcon').value = data.icon || '';
      
      document.getElementById('skillForm').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    showToast('Failed to load skill for editing', true);
    console.error('Error loading skill:', err);
  }
};

window.deleteSkill = async function(id) {
  if (confirm('Are you sure you want to delete this skill?')) {
    try {
      await deleteDoc(doc(db, 'skills', id));
      showToast('Skill deleted successfully');
      loadSkills();
    } catch (err) {
      showToast('Failed to delete skill', true);
      console.error('Error deleting skill:', err);
    }
  }
};

// ==============================================
// EDUCATION SECTION
// ==============================================
function initEducationForm() {
  const form = document.getElementById('educationForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('eduId').value;
    const year = document.getElementById('eduYear').value;
    const school = document.getElementById('eduSchool').value;
    
    if (!year || !school) {
      showToast('Year and school name are required', true);
      return;
    }

    try {
      const eduData = {
        year: year,
        school: school,
        updatedAt: serverTimestamp()
      };
      
      if (id) {
        await updateDoc(doc(db, 'education', id), eduData);
        showToast('Education updated successfully');
      } else {
        await addDoc(collection(db, 'education'), {
          ...eduData,
          createdAt: serverTimestamp()
        });
        showToast('Education added successfully');
      }
      
      form.reset();
      document.getElementById('eduId').value = '';
      loadEducation();
    } catch (err) {
      showToast('Error saving education: ' + err.message, true);
      console.error('Error saving education:', err);
    }
  });
}

async function loadEducation() {
  const list = document.getElementById('educationList');
  if (!list) return;

  list.innerHTML = '<li class="loading">Loading education...</li>';

  try {
    const q = query(collection(db, 'education'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    list.innerHTML = '';
    
    if (querySnapshot.empty) {
      list.innerHTML = '<li class="empty">No education found</li>';
      return;
    }
    
    querySnapshot.forEach(docSnap => {
      const edu = docSnap.data();
      const li = document.createElement('li');
      li.className = 'data-list-item';
      li.innerHTML = `
        <div class="data-list-content">
          <span>${edu.year}</span> - <strong>${edu.school}</strong>
        </div>
        <div class="data-list-actions">
          <button class="btn btn-edit" onclick="editEducation('${docSnap.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteEducation('${docSnap.id}')">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    list.innerHTML = '<li class="error">Failed to load education</li>';
    console.error('Error loading education:', error);
  }
}

window.editEducation = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, 'education', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('eduId').value = id;
      document.getElementById('eduYear').value = data.year || '';
      document.getElementById('eduSchool').value = data.school || '';
      
      document.getElementById('educationForm').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    showToast('Failed to load education for editing', true);
    console.error('Error loading education:', err);
  }
};

window.deleteEducation = async function(id) {
  if (confirm('Are you sure you want to delete this education?')) {
    try {
      await deleteDoc(doc(db, 'education', id));
      showToast('Education deleted successfully');
      loadEducation();
    } catch (err) {
      showToast('Failed to delete education', true);
      console.error('Error deleting education:', err);
    }
  }
};

// ==============================================
// ORGANIZATION SECTION
// ==============================================
function initOrganizationForm() {
  const form = document.getElementById('organizationForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('orgId').value;
    const year = document.getElementById('orgYear').value;
    const name = document.getElementById('orgName').value;
    
    if (!year || !name) {
      showToast('Year and organization name are required', true);
      return;
    }

    try {
      const orgData = {
        year: year,
        name: name,
        updatedAt: serverTimestamp()
      };
      
      if (id) {
        await updateDoc(doc(db, 'organization', id), orgData);
        showToast('Organization updated successfully');
      } else {
        await addDoc(collection(db, 'organization'), {
          ...orgData,
          createdAt: serverTimestamp()
        });
        showToast('Organization added successfully');
      }
      
      form.reset();
      document.getElementById('orgId').value = '';
      loadOrganization();
    } catch (err) {
      showToast('Error saving organization: ' + err.message, true);
      console.error('Error saving organization:', err);
    }
  });
}

async function loadOrganization() {
  const list = document.getElementById('organizationList');
  if (!list) return;

  list.innerHTML = '<li class="loading">Loading organizations...</li>';

  try {
    const q = query(collection(db, 'organization'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    list.innerHTML = '';
    
    if (querySnapshot.empty) {
      list.innerHTML = '<li class="empty">No organizations found</li>';
      return;
    }
    
    querySnapshot.forEach(docSnap => {
      const org = docSnap.data();
      const li = document.createElement('li');
      li.className = 'data-list-item';
      li.innerHTML = `
        <div class="data-list-content">
          <span>${org.year}</span> - <strong>${org.name}</strong>
        </div>
        <div class="data-list-actions">
          <button class="btn btn-edit" onclick="editOrganization('${docSnap.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteOrganization('${docSnap.id}')">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    list.innerHTML = '<li class="error">Failed to load organizations</li>';
    console.error('Error loading organizations:', error);
  }
}

window.editOrganization = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, 'organization', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('orgId').value = id;
      document.getElementById('orgYear').value = data.year || '';
      document.getElementById('orgName').value = data.name || '';
      
      document.getElementById('organizationForm').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    showToast('Failed to load organization for editing', true);
    console.error('Error loading organization:', err);
  }
};

window.deleteOrganization = async function(id) {
  if (confirm('Are you sure you want to delete this organization?')) {
    try {
      await deleteDoc(doc(db, 'organization', id));
      showToast('Organization deleted successfully');
      loadOrganization();
    } catch (err) {
      showToast('Failed to delete organization', true);
      console.error('Error deleting organization:', err);
    }
  }
};

// ==============================================
// ACTIVITY SECTION
// ==============================================
function initActivityForm() {
  const form = document.getElementById('activityForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('activityId').value;
    const name = document.getElementById('activityName').value;
    const date = document.getElementById('activityDate').value;
    const desc = document.getElementById('activityDesc').value;
    
    if (!name || !date || !desc) {
      showToast('All fields are required', true);
      return;
    }

    try {
      const activityData = {
        name: name,
        date: date,
        desc: desc,
        updatedAt: serverTimestamp()
      };
      
      if (id) {
        await updateDoc(doc(db, 'activity', id), activityData);
        showToast('Activity updated successfully');
      } else {
        await addDoc(collection(db, 'activity'), {
          ...activityData,
          createdAt: serverTimestamp()
        });
        showToast('Activity added successfully');
      }
      
      form.reset();
      document.getElementById('activityId').value = '';
      loadActivity();
    } catch (err) {
      showToast('Error saving activity: ' + err.message, true);
      console.error('Error saving activity:', err);
    }
  });
}

async function loadActivity() {
  const list = document.getElementById('activityList');
  if (!list) return;

  list.innerHTML = '<li class="loading">Loading activities...</li>';

  try {
    const q = query(collection(db, 'activity'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    list.innerHTML = '';
    
    if (querySnapshot.empty) {
      list.innerHTML = '<li class="empty">No activities found</li>';
      return;
    }
    
    querySnapshot.forEach(docSnap => {
      const activity = docSnap.data();
      const li = document.createElement('li');
      li.className = 'data-list-item';
      li.innerHTML = `
        <div class="data-list-content">
          <strong>${activity.name}</strong>
          <small>${activity.date}</small>
          <p>${activity.desc}</p>
        </div>
        <div class="data-list-actions">
          <button class="btn btn-edit" onclick="editActivity('${docSnap.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteActivity('${docSnap.id}')">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    list.innerHTML = '<li class="error">Failed to load activities</li>';
    console.error('Error loading activities:', error);
  }
}

window.editActivity = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, 'activity', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('activityId').value = id;
      document.getElementById('activityName').value = data.name || '';
      document.getElementById('activityDate').value = data.date || '';
      document.getElementById('activityDesc').value = data.desc || '';
      
      document.getElementById('activityForm').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    showToast('Failed to load activity for editing', true);
    console.error('Error loading activity:', err);
  }
};

window.deleteActivity = async function(id) {
  if (confirm('Are you sure you want to delete this activity?')) {
    try {
      await deleteDoc(doc(db, 'activity', id));
      showToast('Activity deleted successfully');
      loadActivity();
    } catch (err) {
      showToast('Failed to delete activity', true);
      console.error('Error deleting activity:', err);
    }
  }
};

// ==============================================
// PROJECT SECTION (Updated with Image Preview and Display)
// ==============================================
function initProjectForm() {
  const form = document.getElementById('projectForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('projectId').value;
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const link = document.getElementById('projectLink').value;
    const image = document.getElementById('projectImage').value;

    if (!title || !description || !link || !image) {
      showToast('All fields are required', true);
      return;
    }

    try {
      const projectData = {
        title,
        description,
        link,
        image,
        updatedAt: serverTimestamp()
      };
      
      if (id) {
        await updateDoc(doc(db, 'projects', id), projectData);
        showToast('Project updated successfully');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: serverTimestamp()
        });
        showToast('Project added successfully');
      }

      form.reset();
      document.getElementById('projectId').value = '';
      document.getElementById('imagePreview').style.display = 'none';
      loadProjects();
    } catch (err) {
      showToast('Error saving project: ' + err.message, true);
      console.error('Error saving project:', err);
    }
  });
}

async function loadProjects() {
  const list = document.getElementById('projectList');
  if (!list) return;

  list.innerHTML = '<li class="loading">Loading projects...</li>';

  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    list.innerHTML = '';
    
    if (querySnapshot.empty) {
      list.innerHTML = '<li class="empty">No projects found</li>';
      return;
    }
    
    querySnapshot.forEach(docSnap => {
      const project = docSnap.data();
      const li = document.createElement('li');
      li.className = 'data-list-item with-image';
      li.innerHTML = `
        <img src="${project.image || 'https://via.placeholder.com/100'}" class="project-list-image" alt="${project.title}">
        <div class="data-list-content">
          <strong>${project.title}</strong>
          <p>${project.description}</p>
          <a href="${project.link}" target="_blank">View Project</a>
        </div>
        <div class="data-list-actions">
          <button class="btn btn-edit" onclick="editProject('${docSnap.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteProject('${docSnap.id}')">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    list.innerHTML = '<li class="error">Failed to load projects</li>';
    console.error('Error loading projects:', error);
  }
}

window.editProject = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, 'projects', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('projectId').value = id;
      document.getElementById('projectTitle').value = data.title || '';
      document.getElementById('projectDescription').value = data.description || '';
      document.getElementById('projectLink').value = data.link || '';
      document.getElementById('projectImage').value = data.image || '';
      
      // Show preview if image exists
      const imagePreview = document.getElementById('imagePreview');
      if (data.image) {
        imagePreview.src = data.image;
        imagePreview.style.display = 'block';
      } else {
        imagePreview.style.display = 'none';
      }
      
      document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    showToast('Failed to load project for editing', true);
    console.error('Error loading project:', err);
  }
};

window.deleteProject = async function(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await deleteDoc(doc(db, 'projects', id));
      showToast('Project deleted successfully');
      loadProjects();
    } catch (err) {
      showToast('Failed to delete project', true);
      console.error('Error deleting project:', err);
    }
  }
};

// ==============================================
// ARTICLE SECTION
// ==============================================
function initArticleForm() {
  const form = document.getElementById('articleForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('articleId').value;
    const title = document.getElementById('articleTitle').value;
    const desc = document.getElementById('articleDesc').value;
    
    if (!title || !desc) {
      showToast('Title and content are required', true);
      return;
    }

    try {
      const articleData = {
        title: title,
        desc: desc,
        updatedAt: serverTimestamp()
      };
      
      if (id) {
        await updateDoc(doc(db, 'articles', id), articleData);
        showToast('Article updated successfully');
      } else {
        await addDoc(collection(db, 'articles'), {
          ...articleData,
          createdAt: serverTimestamp()
        });
        showToast('Article added successfully');
      }
      
      form.reset();
      document.getElementById('articleId').value = '';
      loadArticles();
    } catch (err) {
      showToast('Error saving article: ' + err.message, true);
      console.error('Error saving article:', err);
    }
  });
}

async function loadArticles() {
  const list = document.getElementById('articleList');
  if (!list) return;

  list.innerHTML = '<li class="loading">Loading articles...</li>';

  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    list.innerHTML = '';
    
    if (querySnapshot.empty) {
      list.innerHTML = '<li class="empty">No articles found</li>';
      return;
    }
    
    querySnapshot.forEach(docSnap => {
      const article = docSnap.data();
      const li = document.createElement('li');
      li.className = 'data-list-item';
      li.innerHTML = `
        <div class="data-list-content">
          <strong>${article.title}</strong>
          <p>${article.desc}</p>
        </div>
        <div class="data-list-actions">
          <button class="btn btn-edit" onclick="editArticle('${docSnap.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteArticle('${docSnap.id}')">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    list.innerHTML = '<li class="error">Failed to load articles</li>';
    console.error('Error loading articles:', error);
  }
}

window.editArticle = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, 'articles', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('articleId').value = id;
      document.getElementById('articleTitle').value = data.title || '';
      document.getElementById('articleDesc').value = data.desc || '';
      
      document.getElementById('articleForm').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    showToast('Failed to load article for editing', true);
    console.error('Error loading article:', err);
  }
};

window.deleteArticle = async function(id) {
  if (confirm('Are you sure you want to delete this article?')) {
    try {
      await deleteDoc(doc(db, 'articles', id));
      showToast('Article deleted successfully');
      loadArticles();
    } catch (err) {
      showToast('Failed to delete article', true);
      console.error('Error deleting article:', err);
    }
  }
};

// ==============================================
// GALLERY SECTION
// ==============================================
function initGalleryForm() {
  const form = document.getElementById('galleryForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('galleryId').value;
    const image = document.getElementById('galleryImage').value;
    const caption = document.getElementById('galleryCaption').value;
    
    if (!image || !caption) {
      showToast('Image path and caption are required', true);
      return;
    }

    try {
      const galleryData = {
        image: image,
        caption: caption,
        updatedAt: serverTimestamp()
      };
      
      if (id) {
        await updateDoc(doc(db, 'gallery', id), galleryData);
        showToast('Gallery item updated successfully');
      } else {
        await addDoc(collection(db, 'gallery'), {
          ...galleryData,
          createdAt: serverTimestamp()
        });
        showToast('Gallery item added successfully');
      }
      
      form.reset();
      document.getElementById('galleryId').value = '';
      loadGallery();
    } catch (err) {
      showToast('Error saving gallery item: ' + err.message, true);
      console.error('Error saving gallery item:', err);
    }
  });
}

async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = '<div class="loading">Loading gallery...</div>';

  try {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    grid.innerHTML = '';
    
    if (querySnapshot.empty) {
      grid.innerHTML = '<div class="empty">No gallery items found</div>';
      return;
    }
    
    querySnapshot.forEach(docSnap => {
      const item = docSnap.data();
      const itemElement = document.createElement('div');
      itemElement.className = 'gallery-item';
      itemElement.innerHTML = `
        <div class="gallery-image-container">
          <img src="${item.image}" alt="${item.caption || 'Gallery image'}" class="gallery-image">
        </div>
        <div class="gallery-info">
          <p class="gallery-caption">${item.caption || 'No caption'}</p>
          <div class="gallery-actions">
            <button class="btn btn-edit" onclick="editGalleryItem('${docSnap.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteGalleryItem('${docSnap.id}')">Delete</button>
          </div>
        </div>
      `;
      grid.appendChild(itemElement);
    });
  } catch (error) {
    grid.innerHTML = '<div class="error">Failed to load gallery</div>';
    console.error('Error loading gallery:', error);
  }
}

window.editGalleryItem = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, 'gallery', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('galleryId').value = id;
      document.getElementById('galleryImage').value = data.image || '';
      document.getElementById('galleryCaption').value = data.caption || '';
      
      document.getElementById('galleryForm').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    showToast('Failed to load gallery item for editing', true);
    console.error('Error loading gallery item:', err);
  }
};

window.deleteGalleryItem = async function(id) {
  if (confirm('Are you sure you want to delete this gallery item?')) {
    try {
      await deleteDoc(doc(db, 'gallery', id));
      showToast('Gallery item deleted successfully');
      loadGallery();
    } catch (err) {
      showToast('Failed to delete gallery item', true);
      console.error('Error deleting gallery item:', err);
    }
  }
};

// ==============================================
// SERVICE FEE SECTION
// ==============================================
function initServiceFeeForm() {
  const form = document.getElementById('serviceFeeForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('serviceId').value;
    const name = document.getElementById('serviceName').value;
    const description = document.getElementById('serviceDescription').value;
    const price = parseInt(document.getElementById('servicePrice').value);
    const duration = document.getElementById('serviceDuration').value;
    
    if (!name || !description || !price || !duration) {
      showToast('All fields are required', true);
      return;
    }

    try {
      const serviceData = {
        name: name,
        description: description,
        price: price,
        duration: duration,
        updatedAt: serverTimestamp()
      };
      
      if (id) {
        await updateDoc(doc(db, 'services', id), serviceData);
        showToast('Service updated successfully');
      } else {
        await addDoc(collection(db, 'services'), {
          ...serviceData,
          createdAt: serverTimestamp()
        });
        showToast('Service added successfully');
      }
      
      form.reset();
      document.getElementById('serviceId').value = '';
      loadServiceFee();
    } catch (err) {
      showToast('Error saving service: ' + err.message, true);
      console.error('Error saving service:', err);
    }
  });
}

async function loadServiceFee() {
  const tbody = document.getElementById('serviceList');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading services...</td></tr>';

  try {
    const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    tbody.innerHTML = '';
    
    if (querySnapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">No services found</td></tr>';
      return;
    }
    
    querySnapshot.forEach(docSnap => {
      const service = docSnap.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${service.name}</td>
        <td>${service.description}</td>
        <td class="price-cell">${formatPrice(service.price)}</td>
        <td>${formatDuration(service.duration)}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-edit" onclick="editService('${docSnap.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteService('${docSnap.id}')">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="5" class="error">Failed to load services</td></tr>';
    console.error('Error loading services:', error);
  }
}

window.editService = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, 'services', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('serviceId').value = id;
      document.getElementById('serviceName').value = data.name || '';
      document.getElementById('serviceDescription').value = data.description || '';
      document.getElementById('servicePrice').value = data.price || '';
      document.getElementById('serviceDuration').value = data.duration || '';
      
      document.getElementById('serviceFeeForm').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    showToast('Failed to load service for editing', true);
    console.error('Error loading service:', err);
  }
};

window.deleteService = async function(id) {
  if (confirm('Are you sure you want to delete this service?')) {
    try {
      await deleteDoc(doc(db, 'services', id));
      showToast('Service deleted successfully');
      loadServiceFee();
    } catch (err) {
      showToast('Failed to delete service', true);
      console.error('Error deleting service:', err);
    }
  }
};

// ==============================================
// HELPER FUNCTIONS
// ==============================================
function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : 'success'}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}

function formatDuration(duration) {
  const durations = {
    hourly: 'Per Hour',
    daily: 'Per Day',
    weekly: 'Per Week',
    project: 'Per Project'
  };
  return durations[duration] || duration;
}

// Load Initial Data
function loadInitialData() {
  if (window.location.pathname.includes('admin.html')) {
    loadSectionData('dashboard');
  }
}

// Load Data for Specific Section
function loadSectionData(section) {
  switch(section) {
    case 'skills':
      loadSkills();
      break;
    case 'education':
      loadEducation();
      break;
    case 'organization':
      loadOrganization();
      break;
    case 'activity':
      loadActivity();
      break;
    case 'project':
      loadProjects();
      break;
    case 'article':
      loadArticles();
      break;
    case 'gallery':
      loadGallery();
      break;
    case 'servicefee':
      loadServiceFee();
      break;
    default:
      break;
  }
}