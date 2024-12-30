// --- Transpose Button Functions ---
const transposeButtonHTML = `
  <div class="transposebutton">
    <a>Chords</a>
    <button class="button" id="transposeminus">➖</button>
    <button class="button" id="transposeplus">➕</button>
    <a>Tabs </a>
    <button class="button" data-action="decreaseTab">➖</button>
    <button class="button" data-action="increaseTab">➕</button>
    <a>Lyrics</a>
    <label class="toggle-container">
      <input type="checkbox" id="toggleLyrics" />
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
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const scale = chord.includes('b') ? flatNotes : notes;
  const baseNote = chord[0] + (chord[1] === '#' || chord[1] === 'b' ? chord[1] : '');
  const modifier = chord.slice(baseNote.length);

  let index = scale.indexOf(baseNote);
  if (index === -1) return chord;
  index = (index + step + scale.length) % scale.length;
  return notes[index] + modifier;
}

function transposeTabs(step) {
  document.querySelectorAll('.tabs').forEach((element) => {
    element.textContent = element.textContent.replace(/\d+/g, (number) => Math.max(0, parseInt(number, 10) + step));
  });
}

// --- Lyrics Functions ---
function toggleLyrics() {
  document.querySelectorAll('.lyrics').forEach((element) => {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
  });
}

// --- Page Title Functions ---
function updatePageTitle(artist, song) {
  document.title = `${artist || 'Unknown Artist'} - ${song || 'Unknown Song'} | Guitar Tabs`;
}

function initializeArtistAndSong(params) {
  const artist = params.get('artist');
  const song = params.get('song');

  document.getElementById('artist').textContent = artist || 'Unknown Artist';
  document.getElementById('song').textContent = song || 'Unknown Song';
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
  document.getElementById('toggleLyrics')?.addEventListener('change', toggleLyrics);

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

  toggleLyrics();

  const params = new URLSearchParams(window.location.search);
  initializeArtistAndSong(params);

  const tabs = params.get('tabs');
  if (tabs) loadTabs(tabs);

  // Initialize the page by showing the active section and updating button styles
  const initialActiveSectionId = document.querySelector('.active').id;
  activateSection(initialActiveSectionId);
});

function loadTabs(tabsPath) {
  const tabsContent = document.getElementById('tabs-content');
  fetch(tabsPath)
    .then((response) => (response.ok ? response.text() : Promise.reject('File not found')))
    .then((html) => {
      tabsContent.innerHTML = html;
      const initialActiveSectionId = document.querySelector('.active').id;
      updateButtonStyles(initialActiveSectionId);
    })
    .catch(() => {
      tabsContent.innerHTML = '<p>Error: Tabs file could not be loaded.</p>';
    });
}
