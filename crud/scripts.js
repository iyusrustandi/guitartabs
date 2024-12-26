// Get references to DOM elements
const addTabForm = document.getElementById('addTabForm');
const tabsContainer = document.getElementById('tabsContainer');

let tabs = []; // Store all tabs

// Function to render tabs
function renderTabs() {
  tabsContainer.innerHTML = ''; // Clear existing tabs

  tabs.forEach((tab, index) => {
    const tabButton = document.createElement('button');
    tabButton.textContent = tab.note;
    tabButton.className = `tab-button ${tab.isActive ? 'active' : ''}`;
    tabButton.addEventListener('click', () => setActiveTab(index));
    tabsContainer.appendChild(tabButton);
  });
}

// Function to set active tab
function setActiveTab(index) {
  tabs = tabs.map((tab, i) => ({
    ...tab,
    isActive: i === index,
  }));
  renderTabs();
}

// Handle form submission
addTabForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Collect form data
  const newTab = {
    artist: e.target.artist.value,
    song: e.target.song.value,
    tabs: e.target.tabs.value,
    note: e.target.note.value,
    isActive: e.target.setActive.checked,
  };

  // If setActive is checked, deactivate all other tabs
  if (newTab.isActive) {
    tabs = tabs.map((tab) => ({...tab, isActive: false}));
  }

  // Add new tab to tabs array
  tabs.push(newTab);

  // Reset form
  addTabForm.reset();

  // Re-render tabs
  renderTabs();
});
