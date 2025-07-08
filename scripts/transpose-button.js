// scripts/transposeButton.js

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

// --- Transpose Functions ---
function transposeChords(step) {
  document.querySelectorAll('.chords, .chord').forEach((element) => {
    element.textContent = element.textContent.replace(/[A-G](#|b)?/g, (chord) => transposeChord(chord, step));
  });
}

function transposeChord(chord, step) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  if (!/^[A-G](#|b)?$/.test(chord)) return chord;

  const scale = chord.includes('b') ? flatNotes : notes;
  const baseNote = chord.slice(0, chord.length > 1 && (chord[1] === '#' || chord[1] === 'b') ? 2 : 1);
  const modifier = chord.slice(baseNote.length);

  let index = scale.indexOf(baseNote);
  if (index === -1) return chord;
  index = (index + step + scale.length) % scale.length;

  return scale[index] + modifier;
}

// Fungsi untuk transpose tabs juga berlaku untuk lyricsTabs
function transposeTabs(step) {
  document.querySelectorAll('.tabs, .lyricsTabs').forEach((element) => {
    element.textContent = element.textContent.replace(/\d+/g, (number) => Math.max(0, parseInt(number, 10) + step));
  });
}
