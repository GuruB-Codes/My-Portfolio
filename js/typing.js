/**
 * GURULINGAPPA PORTFOLIO - TYPEWRITER EFFECT ENGINE
 * Cycles through roles: Computer Science Engineering Student, Java Full Stack Developer, AI Enthusiast, IoT Developer, Hackathon Winner
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
});

function initTypewriter() {
  const targetEl = document.getElementById('typing-text');
  if (!targetEl) return;

  const roles = [
    "Computer Science Engineering Student",
    "Java Full Stack Developer",
    "AI Enthusiast",
    "IoT Developer",
    "Hackathon Winner",
    "Open Source Contributor"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 70;
  const erasingSpeed = 40;
  const delayBetweenRoles = 2000;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      targetEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      targetEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => { isDeleting = true; }, delayBetweenRoles);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }

    const currentSpeed = isDeleting ? erasingSpeed : typingSpeed;
    setTimeout(type, currentSpeed);
  }

  type();
}
