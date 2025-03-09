document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('dropArea').addEventListener('dragover', (e) => e.preventDefault());
document.getElementById('dropArea').addEventListener('drop', handleDrop);

function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    readFile(file);
  }
}

function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    readFile(file);
  }
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('manualInput').value = e.target.result;
  };
  reader.readAsText(file);
}

function convertText() {
  const inputText = document.getElementById('manualInput').value;
  const outputContainer = document.getElementById('outputContainer');
  outputContainer.innerHTML = convertToHTML(inputText);
}

function convertToHTML(text) {
  const lines = text.split('\n');
  let html = '';
  let inTabBlock = false;
  let inChordBlock = false;
  let tabBuffer = [];
  let chordBuffer = [];

  // Fungsi untuk mengeluarkan semua buffer tab jadi satu pre.tabs
  function flushTabs() {
    if (tabBuffer.length > 0) {
      html += `<pre class="tabs">\n${tabBuffer.join('\n')}\n</pre>\n`;
      tabBuffer = [];
      inTabBlock = false;
    }
  }

  // Fungsi untuk mengeluarkan semua buffer chord jadi satu pre.chords showTip
  function flushChords() {
    if (chordBuffer.length > 0) {
      html += `<pre class="chords showTip">\n${chordBuffer.join('\n')}\n</pre>\n`;
      chordBuffer = [];
      inChordBlock = false;
    }
  }

  lines.forEach((line, index) => {
    const isTabLine = /^[eBGDAE]\|/.test(line); // Cek apakah baris tab
    const isChordLine = /^(Intro|Verse|Reff|Pre|Intr|Outro|Chorus|Bridge|Interlude)\b/i.test(line); // Cek apakah baris chord progresi

    if (isTabLine) {
      if (!inTabBlock) {
        // Kalau masuk tab, pastikan chord sebelumnya ditutup
        flushChords();
        inTabBlock = true;
      }
      tabBuffer.push(line);
    } else if (isChordLine) {
      if (!inChordBlock) {
        // Kalau masuk chord, pastikan tab sebelumnya ditutup
        flushTabs();
        inChordBlock = true;
      }
      chordBuffer.push(line);
    } else if (line.trim() === '') {
      // Kalau baris kosong, flush yang ada
      flushChords();
      flushTabs();
      html += '<br>\n';
    } else {
      // Baris biasa (misal lirik) atau lainnya
      flushChords();
      flushTabs();
      html += `<pre>${line}</pre>\n`;
    }
  });

  // Pastikan semua buffer terakhir dikeluarkan
  flushChords();
  flushTabs();

  return html;
}

function copyToClipboard() {
  const outputContainer = document.getElementById('outputContainer');
  navigator.clipboard
    .writeText(outputContainer.innerText)
    .then(() => {
      alert('Hasil konversi berhasil disalin!');
    })
    .catch((err) => {
      alert('Gagal menyalin teks');
    });
}

function downloadHTML() {
  const outputHTML = document.getElementById('outputContainer').innerHTML;
  const blob = new Blob([outputHTML], {type: 'text/html'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'konversi-tabs-chords.html';
  link.click();
}
