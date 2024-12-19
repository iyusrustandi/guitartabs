document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.button');
  const sections = document.querySelectorAll('section');

  // Add click event listener to buttons
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active class from all buttons
      buttons.forEach((btn) => btn.classList.remove('active'));

      // Add active class to the clicked button
      button.classList.add('active');

      // Get the target section ID from button's href attribute
      const targetId = button.getAttribute('href').replace('#', '');

      // Hide all sections and show the target section
      sections.forEach((section) => {
        if (section.id === targetId) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  });

  // Show the default section (with class active)
  const defaultSection = document.querySelector('section.active');
  if (!defaultSection) {
    sections[0].classList.add('active'); // Default to the first section if none is active
  }
});
