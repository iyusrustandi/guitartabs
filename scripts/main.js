//scripts/main.js
// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', function () {
  injectTransposeButton('transpose-container');

  document.getElementById('transposeminus')?.addEventListener('click', () => transposeChords(-1));
  document.getElementById('transposeplus')?.addEventListener('click', () => transposeChords(1));

  document.querySelectorAll('.button[data-action="decreaseTab"]').forEach((button) => {
    button.addEventListener('click', () => transposeTabs(-1));
  });

  document.querySelectorAll('.button[data-action="increaseTab"]').forEach((button) => {
    button.addEventListener('click', () => transposeTabs(1));
  });

  const buttons = document.querySelectorAll('#tabs-nav .button');
  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      const targetId = button.getAttribute('data-target');
      activateSection(targetId); // Show the selected section
    });
  });

  const params = new URLSearchParams(window.location.search);
  initializeArtistAndSong(params);

  const tabs = params.get('tabs');
  if (tabs) loadTabs(tabs);

  // Initialize the page by showing the active section and updating button styles
  const initialActiveSection = document.querySelector('.active');
  if (initialActiveSection) {
    activateSection(initialActiveSection.id);
  }

  // Setup toggle untuk lyrics dan lyricsTabs
  setupToggleCheckbox('lyrics', 'lyrics');
  setupToggleCheckbox('lyricsTabs', 'lyricsTabs');

  // Default: Lyrics dan LyricsTabs tetap tersembunyi
  document.querySelectorAll('.lyrics, .lyricsTabs').forEach((element) => {
    element.classList.remove('show');
  });
});
