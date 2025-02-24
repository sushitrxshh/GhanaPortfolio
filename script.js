// Open Modal
function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex";
}

// Close Modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Close modal if clicked outside
window.onclick = function (event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Add animations on scroll
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate__animated', 'animate__fadeInUp');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  observer.observe(section);
});

// Skill Popup
function showSkillPopup(skillName) {
  const popup = document.getElementById('skill-popup');
  const skillNameElement = document.getElementById('skill-name');

  skillNameElement.textContent = skillName;
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, 2000);
}