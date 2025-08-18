function formatTab() {
  const input = document.getElementById('inputArea').value;
  const outputArea = document.getElementById('outputArea');
  const previewArea = document.getElementById('previewArea');

  if (!input.trim()) {
    outputArea.innerHTML = '<p style="color: #e74c3c;">Please enter some guitar tab content first!</p>';
    return;
  }

  let formattedHTML = '';
  const lines = input.split('\n'); // Keep original lines with spacing
  let tabLines = [];
  let chordLines = [];
  let inChordSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; // Keep original line with spacing
    const trimmedLine = line.trim();

    // Check for empty lines - they might separate sections or be part of tabs
    if (!trimmedLine) {
      // Look ahead to see if there are more tabs coming
      let hasMoreTabs = false;
      let hasChords = false;

      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (!nextLine) continue; // Skip multiple empty lines

        if (nextLine.includes('|') || /^[eEbBgGdDaA]\|/.test(nextLine)) {
          hasMoreTabs = true;
          break;
        } else if (nextLine.includes(':') || isChordLine(nextLine)) {
          hasChords = true;
          break;
        } else {
          break; // Hit something else, stop looking
        }
      }

      // If we have tabs and no chords are coming, add empty line to tabs
      if (tabLines.length > 0 && hasMoreTabs && !hasChords) {
        tabLines.push(''); // Add empty line to tab section
        continue;
      }

      // Otherwise, end current sections
      if (tabLines.length > 0) {
        formattedHTML += formatTabSection(tabLines);
        tabLines = [];
      }
      if (chordLines.length > 0) {
        formattedHTML += formatChordSection(chordLines);
        chordLines = [];
        inChordSection = false;
      }
      continue;
    }

    // Check if it's a section header (contains : and chord names)
    if (trimmedLine.includes(':') && !trimmedLine.includes('|')) {
      // First, process any pending sections
      if (tabLines.length > 0) {
        formattedHTML += formatTabSection(tabLines);
        tabLines = [];
      }
      if (chordLines.length > 0) {
        formattedHTML += formatChordSection(chordLines);
        chordLines = [];
      }

      // Start new chord section - preserve original spacing
      chordLines.push(line);
      inChordSection = true;
    }
    // Check if it's a tab line (contains | or guitar string notation)
    else if (trimmedLine.includes('|') || /^[eEbBgGdDaA]\|/.test(trimmedLine)) {
      // End any chord section first
      if (chordLines.length > 0) {
        formattedHTML += formatChordSection(chordLines);
        chordLines = [];
        inChordSection = false;
      }
      tabLines.push(line); // Preserve original spacing
    }
    // Check if it's a continuation of chords (indented or starts with chord patterns)
    else if (inChordSection && (line.startsWith('\t') || line.startsWith('  ') || isChordLine(trimmedLine))) {
      chordLines.push(line); // Preserve original spacing including indentation
    }
    // Handle standalone chord lines
    else if (isChordLine(trimmedLine)) {
      if (tabLines.length > 0) {
        formattedHTML += formatTabSection(tabLines);
        tabLines = [];
      }
      if (chordLines.length > 0) {
        formattedHTML += formatChordSection(chordLines);
        chordLines = [];
      }
      chordLines.push(line); // Preserve original spacing
      inChordSection = true;
    } else {
      // End current sections for unrecognized lines
      if (tabLines.length > 0) {
        formattedHTML += formatTabSection(tabLines);
        tabLines = [];
      }
      if (chordLines.length > 0) {
        formattedHTML += formatChordSection(chordLines);
        chordLines = [];
        inChordSection = false;
      }
    }
  }

  // Process any remaining sections
  if (tabLines.length > 0) {
    formattedHTML += formatTabSection(tabLines);
  }
  if (chordLines.length > 0) {
    formattedHTML += formatChordSection(chordLines);
  }

  // Display the formatted HTML
  outputArea.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(formattedHTML)}</pre>`;

  // Show live preview
  previewArea.innerHTML = formattedHTML;
}

function isChordLine(line) {
  // More comprehensive chord detection
  const chordPattern = /^[\s\t]*[A-G](#|b)?(m|maj|min|dim|aug|sus|add)?\d*(\([^)]*\))?\s*([A-G](#|b)?(m|maj|min|dim|aug|sus|add)?\d*(\([^)]*\))?[\s\t]*)*[\s\t]*(\(.*\))?\s*$/;
  return chordPattern.test(line) || line.match(/[A-G](#|b)?(m7?|maj7?|min7?|dim7?|aug7?|sus[24]?|add[29]?)\s/);
}

function formatChordSection(chordLines) {
  if (chordLines.length === 0) return '';

  let chordContent = chordLines.join('\n');
  return `<pre class="chords showTip">\n${chordContent}\n</pre>\n`;
}

function formatTabSection(tabLines) {
  if (tabLines.length === 0) return '';

  let tabContent = tabLines.join('\n');
  return `<pre class="tabs">\n${tabContent}\n</pre>\n`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function copyOutput() {
  const outputArea = document.getElementById('outputArea');
  const textToCopy = outputArea.textContent;

  if (!textToCopy || textToCopy.includes('Your formatted HTML will appear here')) {
    alert('Nothing to copy! Please format your tab first.');
    return;
  }

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      const btn = document.querySelector('.copy-btn');
      const originalText = btn.textContent;
      btn.textContent = '✅ Copied!';
      btn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
      }, 2000);
    })
    .catch((err) => {
      alert('Failed to copy to clipboard. Please manually select and copy the text.');
    });
}

// Auto-format on input change (debounced)
let timeout;
document.getElementById('inputArea').addEventListener('input', function () {
  clearTimeout(timeout);
  timeout = setTimeout(formatTab, 500);
});
