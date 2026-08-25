/**
 * GURULINGAPPA PORTFOLIO - MAIN CONTROLLER & GLOBAL UTILITIES
 */

// Safety measure: Unregister any orphaned Service Workers (e.g., from old Nexora project)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

function runMainInit() {
  initLoader();
  initScrollProgress();
  initBackToTop();
  initFormValidation();
  initSkillTabs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runMainInit);
} else {
  runMainInit();
}

// Hide Page Loader Screen
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('loaded');
  }
}

// Top Scroll Progress Bar
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

// Back To Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'all';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Global Toast Notification Helper
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size: 1.2rem; color: var(--accent-cyan);">${type === 'success' ? '✓' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Contact Form Validation Helper
function initFormValidation() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const subject = document.getElementById('form-subject')?.value.trim();
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast(`Thank you ${name}! Your message has been sent successfully.`);
    contactForm.reset();
  });
}

// Skill Category Tab Switcher
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (tabBtns.length === 0 || skillCards.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      skillCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Generic Fetch JSON Data Utility
async function fetchJSONData(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Local fetch fallback for ${filePath}:`, error);
    return null;
  }
}

// Certificate Modal Lightbox Functions
function openModal(imgSrc) {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  if(modal && modalImg) {
    modal.style.display = 'block';
    modalImg.src = imgSrc;
  }
}

function closeModal() {
  const modal = document.getElementById('certModal');
  if(modal) {
    modal.style.display = 'none';
  }
}

// Close modal when clicking outside the image
document.addEventListener('click', function(event) {
  const modal = document.getElementById('certModal');
  if (event.target == modal) {
    closeModal();
  }
});
