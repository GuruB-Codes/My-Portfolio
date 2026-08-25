/**
 * GURULINGAPPA PORTFOLIO - ANIMATIONS CONTROLLER
 * Custom Cursor, Scroll Reveals, 3D Tilt Cards, Animated Counters, Magnetic Buttons
 */

function runAnimationsInit() {
  // initCustomCursor();
  initScrollReveals();
  initTiltCards();
  initCounters();
  initMagneticButtons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAnimationsInit);
} else {
  runAnimationsInit();
}

// Custom Cursor Following Glow Pointer
function initCustomCursor() {
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states for interactive elements
  const hoverElements = document.querySelectorAll('a, button, .glass-card, .filter-btn');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Scroll Reveals via IntersectionObserver
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Animate skill progress bars if inside this revealed element
        const skillFills = entry.target.querySelectorAll('.skill-progress-fill');
        skillFills.forEach(fill => {
          const width = fill.getAttribute('data-width');
          if (width) fill.style.width = width;
        });
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));
}

// 3D Tilt Card Hover Effect
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card, .glass-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// Animated Stat Counters
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-value');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        let current = 0;
        const increment = Math.ceil(target / 40);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 30);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

// Magnetic Buttons
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-magnetic');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}
