let fileContent = '';

document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('dropArea');

  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
  });

  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      showLoading();
      readFile(file);
    } else {
      alert('Hanya file .txt yang didukung!');
    }
  });

  document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      showLoading();
      readFile(file);
    }
  });
});

function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    fileContent = e.target.result;
    hideLoading();
    if (!fileContent.trim()) {
      alert('File kosong, mohon pastikan file berisi lirik dan chord.');
      return;
    }
    showSuccessAlert();
  };
  reader.readAsText(file);
}

function convertFile() {
  const manualInput = document.getElementById('manualInput').value.trim();
  const inputText = manualInput ? manualInput : fileContent;

  if (!inputText) {
    alert('Silakan upload file, drop file, atau ketik lirik & chord terlebih dahulu.');
    return;
  }

  const htmlOutput = convertLirikChordToHTML(inputText);
  const outputContainer = document.getElementById('outputContainer');
  const outputDiv = document.getElementById('output');

  outputDiv.innerHTML = htmlOutput;
  outputContainer.classList.remove('hidden');
}

function convertLirikChordToHTML(text) {
  const lines = text.split('\n');
  let html = `<pre class="lyrics">\n`;
  let insideReff = false;

  // Regex final untuk deteksi chord secara lengkap
  const chordRegex = /([A-G][#b]?(?:m|M|maj|dim|aug)?(?:7|9|11|13)?(?:-5|-9)?(?:\/[A-G][#b]?)?)/g;

  lines.forEach((line) => {
    if (line.trim() === '') {
      html += '\n';
      return;
    }

    // Deteksi baris Reff
    if (line.trim().toLowerCase().startsWith('reff')) {
      if (insideReff) {
        html += `</pre>\n`; // Tutup reff sebelumnya kalau ada
      }
      html += ` <pre class="lyrics" id="reff">\n<b>Reff</b>\n`;
      insideReff = true;
      return;
    }

    // Section title seperti "Intro:", "Verse 1:", dll.
    if (line.includes(':')) {
      html += `<pre class="lyrics">${line.trim()}</pre>\n`;
      return;
    }

    // Proses baris lirik/chord
    let processedLine = '';
    let lastIndex = 0;

    line.replace(chordRegex, (match, chord, offset) => {
      // Tambahkan teks biasa sebelum chord
      processedLine += line.substring(lastIndex, offset);

      // Bungkus chord di dalam <span>
      processedLine += `<span  class="chord">${chord}</span>`;

      // Update lastIndex ke akhir chord yang diproses
      lastIndex = offset + chord.length;

      return chord;
    });

    // Tambahkan teks sisa setelah chord terakhir
    processedLine += line.substring(lastIndex);

    html += processedLine + '\n';
  });

  // Tutup tag reff terakhir jika masih terbuka
  if (insideReff) {
    html += `</span>\n`;
  }

  html += `</pre>`;
  return html;
}

function copyToClipboard() {
  const outputDiv = document.getElementById('output');
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = outputDiv.innerHTML;

  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);

  alert('HTML hasil konversi berhasil disalin!');
}

function downloadHTML() {
  const outputDiv = document.getElementById('output').innerHTML;
  const blob = new Blob([outputDiv], {type: 'text/html'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chord-lirik.html';
  link.click();
}

function showLoading() {
  document.getElementById('loadingIndicator').classList.remove('hidden');
  document.getElementById('successAlert').classList.add('hidden');
}

function hideLoading() {
  document.getElementById('loadingIndicator').classList.add('hidden');
}

function showSuccessAlert() {
  document.getElementById('successAlert').classList.remove('hidden');
}
