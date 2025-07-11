// scripts/lyrics-toggle.js
// Fungsi untuk toggle lyrics dan lyricsTabs
// function toggleLyrics(id) {
//   document.querySelectorAll(`.${id}`).forEach((element) => {
//     element.classList.toggle('show');
//   });
// }

// // Fungsi untuk menangani checkbox lyrics dan lyricsTabs
// function setupToggleCheckbox(checkboxId, className) {
//   const checkbox = document.getElementById(checkboxId);
//   if (!checkbox) {
//     console.error(`Checkbox with ID '${checkboxId}' not found.`);
//     return;
//   }
//   checkbox.addEventListener('change', function () {
//     toggleLyrics(className);
//   });
// }

//============== update script for hide class chords when class lyrics showed ===================

function toggleLyrics(id) {
  document.querySelectorAll(`.${id}`).forEach((element) => {
    element.classList.toggle('show');
  });
}

function setupToggleCheckbox(checkboxId, className) {
  const checkbox = document.getElementById(checkboxId);
  if (!checkbox) {
    console.error(`Checkbox with ID '${checkboxId}' not found.`);
    return;
  }

  checkbox.addEventListener('change', function () {
    const show = checkbox.checked;

    // Toggle visibility untuk target class (lyrics / lyricsTabs)
    document.querySelectorAll(`.${className}`).forEach((element) => {
      element.classList.toggle('show', show);
    });

    // Toggle visibility .chords hanya jika className === 'lyrics'
    if (className === 'lyrics') {
      document.querySelectorAll('.chords').forEach((element) => {
        element.classList.toggle('hide', show);
      });
    }
  });
}
