// scripts/navigation-section.js

// --- Section Navigation Functions ---
function updateButtonStyles(activeSectionId) {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach((button) => {
    const targetId = button.getAttribute('data-target');
    if (targetId === activeSectionId) {
      button.classList.add('active'); // Add active class to the button
    } else {
      button.classList.remove('active'); // Remove active class from the button
    }
  });
}

function showActiveSection(activeSectionId) {
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    if (section.id === activeSectionId) {
      section.classList.add('active');
      section.style.display = 'block'; // Show the active section
    } else {
      section.classList.remove('active');
      section.style.display = 'none'; // Hide other sections
    }
  });
}

function activateSection(id) {
  showActiveSection(id);
  updateButtonStyles(id);
}
