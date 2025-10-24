// scripts/transpose-button.js

const transposeButtonHTML = `
<div class="transposebutton">
    <a>Chords</a>
    <button class="button" id="transposeminus">
        <img src="https://gtabs.vercel.app/images/minus-solid.svg" alt="Minus">
    </button>
    <button class="button" id="transposeplus">
        <img src="https://gtabs.vercel.app/images/plus-solid.svg" alt="Plus">
    </button>
    <a>Tabs</a>
    <button class="button" data-action="decreaseTab">
        <img src="https://gtabs.vercel.app/images/minus-solid.svg" alt="Minus">
    </button>
    <button class="button" data-action="increaseTab">
        <img src="https://gtabs.vercel.app/images/plus-solid.svg" alt="Plus">
    </button>
    <a>Lyrics</a>
    <label class="toggle-container">
        <input type="checkbox" id="lyrics" />
        <span class="toggle-slider"></span>
    </label>
    <a>Lyrics Tab</a>
    <label class="toggle-container">
        <input type="checkbox" id="lyricsTabs" />
        <span class="toggle-slider"></span>
    </label>
</div>
<div class="transposebutton" id="tabs-nav">
    <button class="button" data-target="onC">C</button>
    <button class="button" data-target="onC#">C#</button>
    <button class="button" data-target="onD">D</button>
    <button class="button" data-target="onD#">D#</button>
    <button class="button" data-target="onE">E</button>
    <button class="button" data-target="onF">F</button>
    <button class="button" data-target="onF#">F#</button>
    <button class="button" data-target="onG">G</button>
    <button class="button" data-target="onG#">G#</button>
    <button class="button" data-target="onA">A</button>
    <button class="button" data-target="onBb">Bb</button>
    <button class="button" data-target="onB">B</button>
</div>
`;

function injectTransposeButton(targetElementId) {
  const targetElement = document.getElementById(targetElementId);
  if (targetElement) {
    targetElement.innerHTML = transposeButtonHTML;
  } else {
    console.error(`Element with ID '${targetElementId}' not found.`);
  }
}

// ========================== Transpose Logic =====================================
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function transposeChords(step) {
  document.querySelectorAll('span[data-name]').forEach((span) => {
    const chord = span.getAttribute('data-name');
    if (!chord) return; // Skip jika data-name kosong

    // Pisahkan chord utama dan suffix (contoh: F#m7, G/B)
    const match = chord.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return; // Skip jika tidak valid

    const baseChord = match[1]; // Misal: F#
    const suffix = match[2]; // Misal: m7 atau /B

    let noteIndex = notes.indexOf(baseChord);
    if (noteIndex === -1) {
      noteIndex = flatNotes.indexOf(baseChord);
      if (noteIndex === -1) return;
    }

    const transposedIndex = (noteIndex + step + 12) % 12;
    const transposedNote = notes[transposedIndex];

    // Jika ada bass note (slash chord)
    const bassMatch = suffix.match(/\/([A-G][#b]?)/);
    if (bassMatch) {
      const bassNote = bassMatch[1];
      let bassIndex = notes.indexOf(bassNote);
      if (bassIndex === -1) {
        bassIndex = flatNotes.indexOf(bassNote);
        if (bassIndex === -1) return;
      }

      const transposedBassIndex = (bassIndex + step + 12) % 12;
      const transposedBassNote = notes[transposedBassIndex];

      // Update isi dan atribut data-name
      const newChord = `${transposedNote}${suffix.replace(bassNote, transposedBassNote)}`;
      span.textContent = newChord;
      span.setAttribute('data-name', newChord);
    } else {
      const newChord = transposedNote + suffix;
      span.textContent = newChord;
      span.setAttribute('data-name', newChord);
    }
  });
}

// Fungsi untuk transpose tabs juga berlaku untuk lyricsTabs
function transposeTabs(step) {
  document.querySelectorAll('.tabs, .lyricsTabs').forEach((element) => {
    element.textContent = element.textContent.replace(/\d+/g, (number) => Math.max(0, parseInt(number, 10) + step));
  });
}
