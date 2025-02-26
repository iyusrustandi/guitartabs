//scripts/tabs-script.js
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
  document.querySelectorAll('.chords.showTip').forEach((element) => {
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

// --- Page Title Functions ---
function updatePageTitle(artist, song) {
  const safeArtist = artist ? artist.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Unknown Artist';
  const safeSong = song ? song.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Unknown Song';

  document.title = `${safeArtist} - ${safeSong} | Guitar Tabs`;
}

function initializeArtistAndSong(params) {
  const artist = params.get('artist') || 'Unknown Artist';
  const song = params.get('song') || 'Unknown Song';

  document.getElementById('artist').textContent = artist;
  document.getElementById('song').textContent = song;
  updatePageTitle(artist, song);
}

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

function loadTabs(tabsPath) {
  const tabsContent = document.getElementById('tabs-content');

  // Menampilkan animasi loading
  tabsContent.innerHTML = `
    <div class="loading-animation">
      <img src="https://gtabs.vercel.app/images/loading.png" alt="Loading..." />
    </div>
  `;

  fetch(tabsPath)
    .then((response) => {
      if (!response.ok) throw new Error('Tabs file not found');
      return response.text();
    })
    .then((html) => {
      tabsContent.innerHTML = html;
      const initialActiveSection = document.querySelector('.active')?.id;
      if (initialActiveSection) updateButtonStyles(initialActiveSection);
    })
    .catch((error) => {
      console.error(error);
      tabsContent.innerHTML = '<p style="color: red;">Error: Unable to load guitar tabs.</p>';
    });
}
