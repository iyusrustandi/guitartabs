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

    // Toggle class on lyrics / lyricsTabs
    document.querySelectorAll(`.${className}`).forEach((element) => {
      element.classList.toggle('show', show);
    });

    // Toggle visibility of .chords
    document.querySelectorAll('.chords').forEach((element) => {
      element.classList.toggle('hide', show);
    });
  });
}
