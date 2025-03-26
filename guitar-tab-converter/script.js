function convertTabs() {
  const input = document.getElementById('input').value;
  const lines = input.split('\n');
  let outputHtml = '';
  let currentTabLines = [];

  function closeTabBlock() {
    if (currentTabLines.length > 0) {
      outputHtml += '<pre class="tabs">\n' + currentTabLines.join('\n') + '\n</pre>\n';
      currentTabLines = [];
    }
  }

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    const chordMatch = trimmedLine.match(/^([A-Za-z0-9]+)\s*:\s*(.*)/);

    if (chordMatch) {
      closeTabBlock();
      outputHtml += `<pre class="chords showTip">${line}</pre>\n`;
      return;
    }

    const tabMatch = line.match(/^(e|B|G|D|A|E)\|/);
    if (tabMatch) {
      currentTabLines.push(line);
      return;
    }

    if (trimmedLine === '') {
      closeTabBlock();
    }
  });

  closeTabBlock();
  document.getElementById('output').innerHTML = outputHtml;
}

function copyHtml() {
  const output = document.getElementById('output').innerHTML;
  navigator.clipboard
    .writeText(output)
    .then(() => alert('HTML berhasil disalin!'))
    .catch((err) => console.error('Gagal menyalin:', err));
}
