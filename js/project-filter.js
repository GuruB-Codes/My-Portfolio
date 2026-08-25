/**
 * GURULINGAPPA PORTFOLIO - PROJECT FILTER & DYNAMIC RENDERER
 */

function runProjectFilterInit() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      const filter = button.dataset.filter;

      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      projectCards.forEach(card => {

        const categories = card.dataset.category.split(" ");

        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }

      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runProjectFilterInit);
} else {
  runProjectFilterInit();
}

function renderProjects(projects, container) {
  container.innerHTML = projects.map(p => `
    <div class="glass-card project-card reveal">
      <div class="project-thumb">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="project-tag">${p.category}</span>
      </div>
      <h3 class="project-title">${p.title}</h3>
      <div class="project-subtitle">${p.subtitle}</div>
      <p class="project-desc">${p.description}</p>
      <div class="project-tech-stack">
        ${p.technologies.map(t => `<span class="tech-pill">${t}</span>`).join('')}
      </div>
      <div class="project-actions">
        <a href="${p.github}" target="_blank" rel="noopener" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">GitHub</a>
        <a href="${p.demo}" target="_blank" rel="noopener" class="btn btn-glow" style="padding: 8px 16px; font-size: 0.85rem;">Live Demo</a>
      </div>
    </div>
  `).join('');

  // Re-trigger reveal animation and tilt effect for newly rendered cards
  if (typeof initScrollReveals === 'function') initScrollReveals();
  if (typeof initTiltCards === 'function') initTiltCards();
}
