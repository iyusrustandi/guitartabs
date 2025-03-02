// scripts/lyrics-toggle.js
// Fungsi untuk toggle lyrics dan lyricsTabs
function toggleLyrics(id) {
  document.querySelectorAll(`.${id}`).forEach((element) => {
    element.classList.toggle('show');
  });
}

// Fungsi untuk menangani checkbox lyrics dan lyricsTabs
function setupToggleCheckbox(checkboxId, className) {
  const checkbox = document.getElementById(checkboxId);
  if (!checkbox) {
    console.error(`Checkbox with ID '${checkboxId}' not found.`);
    return;
  }
  checkbox.addEventListener('change', function () {
    toggleLyrics(className);
  });
}
