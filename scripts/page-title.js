// scripts/page-title.js
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
