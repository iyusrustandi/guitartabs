// tabs-script.js

//load components/transpose-button.html
function loadComponent(componentPath, targetElementId) {
  fetch(componentPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load component from ${componentPath}`);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById(targetElementId).innerHTML = html;
    })
    .catch((error) => {
      console.error(error);
    });
}

// Event listener saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  // Muat komponen transpose-button dari folder components
  loadComponent('https://gtabs.vercel.app/layout2/components/transpose-button.html', 'transpose-container');
});

// Function to transpose chords
function transposeChords(step) {
  const chordsElements = document.querySelectorAll('.chords.showTip');
  chordsElements.forEach((element) => {
    element.textContent = element.textContent.replace(/[A-G](#|b)?/g, (chord) => {
      return transposeChord(chord, step);
    });
  });
}

// Helper function to transpose individual chords
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

// Function to transpose tab numbers
function transposeTabs(step) {
  const tabsElements = document.querySelectorAll('.tabs');
  tabsElements.forEach((element) => {
    element.textContent = element.textContent.replace(/\d+/g, (number) => {
      return Math.max(0, parseInt(number, 10) + step); // Ensure no negative numbers
    });
  });
}

// Function to toggle lyrics visibility
function toggleLyrics() {
  const lyricsElements = document.querySelectorAll('.lyrics');
  lyricsElements.forEach((element) => {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
  });
}

// Event listeners for transpose buttons
document.getElementById('transposeminus').addEventListener('click', () => transposeChords(-1));
document.getElementById('transposeplus').addEventListener('click', () => transposeChords(1));

document.querySelectorAll('.button[onclick="decreaseTab()"]').forEach((button) => {
  button.addEventListener('click', () => transposeTabs(-1));
});

document.querySelectorAll('.button[onclick="increaseTab()"]').forEach((button) => {
  button.addEventListener('click', () => transposeTabs(1));
});

document.getElementById('toggleLyrics').addEventListener('change', toggleLyrics);

// Initialize lyrics as hidden by default
window.addEventListener('DOMContentLoaded', () => {
  toggleLyrics();

  // Update page title based on query parameters
  const params = new URLSearchParams(window.location.search);
  const artist = params.get('artist');
  const song = params.get('song');

  document.getElementById('artist').textContent = artist || 'Unknown Artist';
  document.getElementById('song').textContent = song || 'Unknown Song';

  updatePageTitle(artist, song);

  // Load tabs if provided in URL
  const tabs = params.get('tabs');
  if (tabs) {
    loadTabs(tabs);
  } else {
    document.getElementById('tabs-content').innerHTML = '<p>No tabs available.</p>';
  }

  // Add event listener for navigation buttons
  document.querySelectorAll('#tabs-nav .button').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault(); // Avoid default navigation
      const targetId = button.getAttribute('href').substring(1);
      activateSection(targetId);
    });
  });
});

// Helper functions for page updates and tab loading
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

function loadTabs(tabsPath) {
  const tabsContent = document.getElementById('tabs-content');

  fetch(tabsPath)
    .then((response) => {
      if (!response.ok) throw new Error('File not found');
      return response.text();
    })
    .then((html) => {
      tabsContent.innerHTML = html;
      syncActiveButton(); // Sync active button after content is loaded
    })
    .catch(() => {
      tabsContent.innerHTML = '<p>Error: Tabs file could not be loaded.</p>';
    });
}

function activateSection(id) {
  document.querySelectorAll('#tabs-nav .button').forEach((btn) => btn.classList.remove('active'));
  document.querySelectorAll('section').forEach((section) => section.classList.remove('active'));

  const targetButton = document.querySelector(`#tabs-nav .button[href="#${id}"]`);
  const targetSection = document.getElementById(id);

  if (targetButton) targetButton.classList.add('active');
  if (targetSection) targetSection.classList.add('active');
}

function syncActiveButton() {
  const activeSection = document.querySelector('section.active');
  if (activeSection) {
    const activeId = activeSection.id;
    const activeButton = document.querySelector(`#tabs-nav .button[href="#${activeId}"]`);
    if (activeButton) activeButton.classList.add('active');
  }
}
