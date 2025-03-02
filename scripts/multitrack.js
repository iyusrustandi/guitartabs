document.addEventListener('DOMContentLoaded', function () {
  const multitrackButton = document.getElementById('multitrack-button');
  const multitrackContainer = document.getElementById('multitrack-container');
  const loadingScreen = createLoadingScreen();

  const songDataUrl = '/api/data.json';
  const params = new URLSearchParams(window.location.search);
  const artist = params.get('artist');
  const song = params.get('song');

  let audioTracks = {};
  let trackSettings = {};

  function createLoadingScreen() {
    const loading = document.createElement('div');
    loading.id = 'loading-screen';
    loading.innerHTML = `
            <div class="loading-content">
              <div class="loading-animation">
      <img src="https://gtabs.vercel.app/images/loading.png" alt="Loading..." />
    </div>
            </div>
            `;
    document.body.appendChild(loading);
    return loading;
  }

  function toggleLoading(show) {
    loadingScreen.style.display = show ? 'flex' : 'none';
  }

  function loadMultitrackData() {
    toggleLoading(true);
    fetch(songDataUrl)
      .then((response) => response.json())
      .then((data) => {
        const songData = data.find((item) => item.artist.toLowerCase().trim() === artist.toLowerCase().trim() && item.song.toLowerCase().trim() === song.toLowerCase().trim());

        if (songData && songData.tracks) {
          generateMultitrackPlayer(songData.tracks);
        } else {
          multitrackContainer.innerHTML = "<p style='color:red;'>Multitrack data not available.</p>";
        }
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        multitrackContainer.innerHTML = "<p style='color:red;'>Failed to load data.</p>";
      })
      .finally(() => toggleLoading(false));
  }

  function generateMultitrackPlayer(tracks) {
    audioTracks = {};
    trackSettings = {};

    const trackHTML = Object.entries(tracks)
      .map(([instrument, file]) => {
        return `
                <div class="fader">
                    <audio id="audio-${instrument}" src="${file}" preload="auto" controls></audio>
                    <div class="track-name">${instrument.toUpperCase()}</div>


                    <div class="buttons">
                        <button class="solo-btn" data-track="${instrument}">S</button>
                        <button class="mute-btn" data-track="${instrument}">M</button>
                    </div>

                    <select class="pan-control" data-track="${instrument}">
                        <option value="center">C</option>
                        <option value="left">L</option>
                        <option value="right">R</option>
                    </select>

                    <div class="volume-wrapper">
                        <label>Vol</label>
                        <input type="range" class="track-volume-slider" data-track="${instrument}" min="0" max="1" step="0.01" value="1">
                    </div>
                </div>`;
      })
      .join('');

    multitrackContainer.innerHTML = `
            <div class="master-controls">
                <div class="buttons">
                    <button id="play-all">▶️ Play</button>
                    <button id="pause-all">⏸️ Pause</button>
                    <button id="stop-all">⏹️ Stop</button>
                </div>
                <input type="range" id="master-volume" min="0" max="1" step="0.01" value="1">
                <progress id="master-progress" value="0" max="100"></progress>
            </div>

            <div class="fader-container">
                ${trackHTML}
            </div>
        `;

    Object.entries(tracks).forEach(([instrument]) => {
      const audio = document.getElementById(`audio-${instrument}`);
      audioTracks[instrument] = audio;

      trackSettings[instrument] = {
        volume: 1,
        muted: false,
        solo: false,
        pan: 'center',
      };

      audio.onerror = () => console.error(`Failed to load ${instrument} track.`);
      audio.ontimeupdate = updateMasterProgress;
    });

    setupControls();
  }

  function setupControls() {
    document.getElementById('play-all').onclick = () => controlAllTracks('play');
    document.getElementById('pause-all').onclick = () => controlAllTracks('pause');
    document.getElementById('stop-all').onclick = stopAllTracks;

    document.getElementById('master-volume').oninput = updateAllVolumes;

    document.querySelectorAll('.track-volume-slider').forEach((slider) => {
      slider.oninput = (e) => {
        const track = e.target.dataset.track;
        trackSettings[track].volume = parseFloat(e.target.value);
        updateTrackVolume(track);
      };
    });

    document.querySelectorAll('.solo-btn').forEach((btn) => {
      btn.onclick = () => toggleSolo(btn.dataset.track);
    });

    document.querySelectorAll('.mute-btn').forEach((btn) => {
      btn.onclick = () => toggleMute(btn.dataset.track);
    });

    document.querySelectorAll('.pan-control').forEach((select) => {
      select.onchange = (e) => {
        const track = e.target.dataset.track;
        trackSettings[track].pan = e.target.value;
        updateTrackPanning(track);
      };
    });
  }

  function updateTrackVolume(track) {
    const masterVolume = parseFloat(document.getElementById('master-volume').value);
    audioTracks[track].volume = masterVolume * trackSettings[track].volume * (trackSettings[track].muted ? 0 : 1);
  }

  function updateAllVolumes() {
    Object.keys(audioTracks).forEach(updateTrackVolume);
  }

  function toggleSolo(track) {
    trackSettings[track].solo = !trackSettings[track].solo;
    updateTrackStates();
  }

  function toggleMute(track) {
    trackSettings[track].muted = !trackSettings[track].muted;
    updateTrackStates();
  }

  function updateTrackStates() {
    const anySolo = Object.values(trackSettings).some((t) => t.solo);

    Object.entries(trackSettings).forEach(([track, settings]) => {
      const muted = anySolo ? !settings.solo : settings.muted;
      audioTracks[track].muted = muted;
      updateTrackVolume(track);
    });
  }

  function updateTrackPanning(track) {
    console.log(`Track ${track} panning set to ${trackSettings[track].pan}`);
  }

  function controlAllTracks(action) {
    Object.values(audioTracks).forEach((audio) => {
      if (action === 'play') audio.play();
      if (action === 'pause') audio.pause();
    });
  }

  function stopAllTracks() {
    Object.values(audioTracks).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  function updateMasterProgress() {
    const firstTrack = Object.values(audioTracks)[0];
    if (firstTrack && firstTrack.duration) {
      const percent = (firstTrack.currentTime / firstTrack.duration) * 100;
      document.getElementById('master-progress').value = percent;
    }
  }

  multitrackButton.onclick = () => {
    if (multitrackContainer.style.display === 'none') {
      loadMultitrackData();
      multitrackContainer.style.display = 'block';
      multitrackButton.textContent = 'Hide Multitrack';
    } else {
      multitrackContainer.style.display = 'none';
      multitrackButton.textContent = 'Show Multitrack';
    }
  };
});
