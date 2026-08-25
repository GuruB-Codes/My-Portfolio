/**
 * GURULINGAPPA PORTFOLIO - NAVIGATION CONTROLLER
 * Handles Sticky Nav Blur, Shrink on Scroll, Active Link Highlight, Mobile Menu
 */

function runNavInit() {
  initNavbarScroll();
  initMobileNav();
  initActiveLinkHighlight();
  initThemeToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runNavInit);
} else {
  runNavInit();
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    mobileToggle.innerHTML = isOpen ? '✕' : '☰';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileToggle.innerHTML = '☰';
    });
  });
}

function initActiveLinkHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length === 0 || navLinks.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    });
  });
}
