// script/loading-audio.js
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const artist = params.get('artist') || 'Unknown Artist';
  const song = params.get('song') || 'Unknown Song';
  const file = params.get('file');

  document.getElementById('artist').textContent = artist;
  document.getElementById('song').textContent = song;

  if (file && file.trim() !== '') {
    const audioContainer = document.getElementById('audio-container');
    audioContainer.innerHTML = `
            <div class="audio-loading">Loading audio ...</div>
            <audio controls id="audio-player">
              <source src="${file}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          `;
    const audioElement = document.getElementById('audio-player');
    audioElement.addEventListener('canplay', function () {
      document.querySelector('.audio-loading').style.display = 'none';
    });

    audioElement.onerror = function () {
      audioContainer.innerHTML = '<div class="no-audio">Audio not available</div>';
    };
  }
});
