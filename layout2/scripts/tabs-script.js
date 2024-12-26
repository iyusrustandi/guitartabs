// tabs-script.js

// Isi HTML dari transpose-button.html sebagai string
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

// Fungsi untuk menyisipkan HTML ke dalam elemen target
function injectTransposeButton(targetElementId) {
  const targetElement = document.getElementById(targetElementId);
  if (targetElement) {
    targetElement.innerHTML = transposeButtonHTML;
  } else {
    console.error(`Element with ID '${targetElementId}' not found.`);
  }
}

// Fungsi untuk transpose chords
function transposeChords(step) {
  const chordsElements = document.querySelectorAll('.chords.showTip');
  chordsElements.forEach((element) => {
    element.textContent = element.textContent.replace(/[A-G](#|b)?/g, (chord) => {
      return transposeChord(chord, step);
    });
  });
}

// Helper function untuk transpose chord individual
function transposeChord(chord, step) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const isFlat = chord.includes('b');
  const scale = isFlat ? flatNotes : notes;
  const baseNote = chord[0] + (chord[1] === '#' || chord[1] === 'b' ? chord[1] : '');
  const modifier = chord.slice(baseNote.length);

  let index = scale.indexOf(baseNote);
  if (index === -1) return chord; // Return original if not a valid chord

  index = (index + step + scale.length) % scale.length;
  return notes[index] + modifier;
}

// Fungsi untuk transpose tab numbers
function transposeTabs(step) {
  const tabsElements = document.querySelectorAll('.tabs');
  tabsElements.forEach((element) => {
    element.textContent = element.textContent.replace(/\d+/g, (number) => {
      return Math.max(0, parseInt(number, 10) + step); // Ensure no negative numbers
    });
  });
}

// Fungsi untuk toggle visibility lirik
function toggleLyrics() {
  const lyricsElements = document.querySelectorAll('.lyrics');
  lyricsElements.forEach((element) => {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
  });
}

// Fungsi untuk update title berdasarkan artist dan lagu
function updatePageTitle(artist, song) {
  if (artist && song) {
    document.title = `${artist} - ${song} | Guitar Tabs`;
  } else if (artist) {
    document.title = `${artist} | Guitar Tabs`;
  } else if (song) {
    document.title = `${song} | Guitar Tabs`;
  } else {
    document.title = 'Guitar Tabs';
  }
}

// Fungsi untuk navigasi section
function activateSection(id) {
  // Hapus class active dari semua section
  document.querySelectorAll('section').forEach((section) => section.classList.remove('active'));

  // Tambahkan class active ke section target
  const targetSection = document.getElementById(id);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Sinkronisasi tombol
  syncActiveButton(id);
}

function syncActiveButton(activeSectionId) {
  // Hapus class active dari semua tombol
  document.querySelectorAll('#tabs-nav .button').forEach((button) => {
    button.classList.remove('active');
  });

  // Tambahkan class active ke tombol yang sesuai
  const activeButton = document.querySelector(`#tabs-nav .button[data-target="${activeSectionId}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

// Event listener untuk tombol
document.querySelectorAll('#tabs-nav .button').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    activateSection(targetId);
  });
});

// Event listener utama untuk DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  injectTransposeButton('transpose-container');

  // Event listener untuk tombol transpose
  const transposeMinusButton = document.getElementById('transposeminus');
  const transposePlusButton = document.getElementById('transposeplus');
  const toggleLyricsCheckbox = document.getElementById('toggleLyrics');

  if (transposeMinusButton) {
    transposeMinusButton.addEventListener('click', () => transposeChords(-1));
  }

  if (transposePlusButton) {
    transposePlusButton.addEventListener('click', () => transposeChords(1));
  }

  if (toggleLyricsCheckbox) {
    toggleLyricsCheckbox.addEventListener('change', toggleLyrics);
  }

  // Event listener untuk tombol tab transpose
  document.querySelectorAll('.button[data-action="decreaseTab"]').forEach((button) => {
    button.addEventListener('click', () => transposeTabs(-1));
  });

  document.querySelectorAll('.button[data-action="increaseTab"]').forEach((button) => {
    button.addEventListener('click', () => transposeTabs(1));
  });

  // Event listener untuk navigasi tab
  document.querySelectorAll('#tabs-nav .button').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = button.getAttribute('data-target');
      activateSection(targetId);
    });
  });

  // Inisialisasi lirik tersembunyi
  toggleLyrics();

  // Update judul halaman berdasarkan parameter
  const params = new URLSearchParams(window.location.search);
  const artist = params.get('artist');
  const song = params.get('song');

  document.getElementById('artist').textContent = artist || 'Unknown Artist';
  document.getElementById('song').textContent = song || 'Unknown Song';

  updatePageTitle(artist, song);
});

// Fungsi untuk memuat tabs dari path
function loadTabs(tabsPath) {
  const tabsContent = document.getElementById('tabs-content');

  fetch(tabsPath)
    .then((response) => {
      if (!response.ok) throw new Error('File not found');
      return response.text();
    })
    .then((html) => {
      tabsContent.innerHTML = html;
      syncActiveButton();
    })
    .catch(() => {
      tabsContent.innerHTML = '<p>Error: Tabs file could not be loaded.</p>';
    });
}

// Ambil parameter dari URL
const params = new URLSearchParams(window.location.search);
const artist = params.get('artist') || 'Unknown Artist';
const song = params.get('song') || 'Unknown Song';

// Tampilkan nama artist dan song di halaman
document.getElementById('artist').textContent = artist;
document.getElementById('song').textContent = song;

// Update title halaman
document.title = `${artist} - ${song} | Guitar Tabs`;

// Load tabs jika ada dalam URL
const tabs = params.get('tabs');
if (tabs) {
  loadTabs(tabs);
} else {
  document.getElementById('tabs-content').innerHTML = '<p>No tabs available.</p>';
}
