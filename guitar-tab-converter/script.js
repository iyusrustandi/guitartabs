async function convertTabs() {
  const input = document.getElementById('input').value;
  const lines = input.split('\n');
  let outputHtml = '';
  let currentTabLines = [];

  const loader = document.getElementById('loader');
  const convertBtn = document.querySelector('.btn-primary');

  try {
    // Show loading state
    loader.style.display = 'inline-block';
    convertBtn.disabled = true;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));

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
  } finally {
    loader.style.display = 'none';
    convertBtn.disabled = false;
  }
}

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
