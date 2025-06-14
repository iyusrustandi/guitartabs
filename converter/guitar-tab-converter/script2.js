async function convertTabs() {
  const input = document.getElementById('input').value;
  const lines = input.split('\n');
  let outputHtml = '';
  let currentTabLines = [];
  let currentChordBlock = null;
  let currentBlockType = null; // 'chord' or 'tab'

  const loader = document.getElementById('loader');
  const convertBtn = document.querySelector('.btn-primary');

  try {
    loader.style.display = 'inline-block';
    convertBtn.disabled = true;
    await new Promise((resolve) => setTimeout(resolve, 300));

    const closeCurrentBlock = () => {
      if (currentBlockType === 'chord' && currentChordBlock) {
        const cleanedChord = currentChordBlock.replace(/\n{2,}/g, '\n');
        if (cleanedChord.trim() !== '') {
          outputHtml += `<pre class="chords showTip">${cleanedChord}</pre>\n`;
        }
        currentChordBlock = null;
      } else if (currentBlockType === 'tab' && currentTabLines.length > 0) {
        const cleanedTabs = currentTabLines.join('\n').replace(/\n{3,}/g, '\n\n');
        if (cleanedTabs.trim() !== '') {
          outputHtml += `<pre class="tabs">\n${cleanedTabs}\n</pre>\n`;
        }
        currentTabLines = [];
      }
      currentBlockType = null;
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Deteksi chord lines (termasuk line continuation)
      const isChordLine = line.match(/^\s*([A-Za-z0-9]+\s*:|\s{2,})/);

      // Deteksi tab line
      const isTabLine = line.match(/^[eBGDABE]\|/);

      if (isChordLine) {
        if (currentBlockType === 'tab') {
          closeCurrentBlock();
        }

        // Normalisasi whitespace dan formatting
        const formattedLine = line
          .replace(/\s{2,}/g, '\t') // Convert multi-space to tab
          .replace(/:(\S)/, ': $1') // Tambah space setelah colon
          .replace(/\t+/g, '\t'); // Normalisasi multiple tabs

        if (!currentChordBlock) {
          currentChordBlock = formattedLine;
        } else {
          currentChordBlock += '\n' + formattedLine;
        }
        currentBlockType = 'chord';
      } else if (isTabLine) {
        if (currentBlockType === 'chord') {
          closeCurrentBlock();
        }
        currentTabLines.push(line);
        currentBlockType = 'tab';
      } else {
        if (trimmedLine === '') {
          if (currentBlockType === 'tab') {
            // Pertahankan empty line dalam tab block
            currentTabLines.push('');
          } else {
            // Close current block untuk empty line antar block
            closeCurrentBlock();
          }
        }
      }
    });

    // Tutup block terakhir
    closeCurrentBlock();

    // Final cleanup
    outputHtml = outputHtml
      .replace(/<pre class="chords[^>]+>\s*<\/pre>/g, '') // Hapus chord kosong
      .replace(/(<\/pre>)\s*(<pre class="tabs">)/g, '$1\n$2')
      .replace(/(<\/pre>)\s*(<pre class="chords)/g, '$1\n\n$2');

    document.getElementById('output').innerHTML = outputHtml;
  } finally {
    loader.style.display = 'none';
    convertBtn.disabled = false;
  }
}

// Fungsi copyHtml dan showToast tetap sama

async function copyHtml() {
  const output = document.getElementById('output').innerHTML;
  try {
    await navigator.clipboard.writeText(output);
    showToast('HTML copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy HTML', true);
  }
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '12px 24px';
  toast.style.background = isError ? '#e74c3c' : '#2ecc71';
  toast.style.color = 'white';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  toast.style.zIndex = '1000';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
