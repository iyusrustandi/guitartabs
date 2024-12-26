const addNewButton = document.getElementById('addNewButton');
const formModal = document.getElementById('formModal');
const formComponent = document.getElementById('formComponent');
const closeModal = document.getElementById('closeModal');
const tableBody = document.getElementById('tableBody');

let tabs = []; // Array to store tab data

// Load Form Component
async function loadFormComponent() {
  const response = await fetch('components/add-form.html');
  const formHTML = await response.text();
  formComponent.innerHTML = formHTML;

  // Attach form submission logic
  const addTabForm = document.getElementById('addTabForm');
  addTabForm.addEventListener('submit', handleAddTab);
}

// Open Modal
addNewButton.addEventListener('click', () => {
  loadFormComponent();
  formModal.classList.remove('hidden');
});

// Close Modal
closeModal.addEventListener('click', () => {
  formModal.classList.add('hidden');
});

// Handle Add Tab Form Submission
function handleAddTab(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const newTab = {
    artist: formData.get('artist'),
    song: formData.get('song'),
    tabs: formData.get('tabs'),
    note: formData.get('note'),
  };

  tabs.push(newTab);
  renderTable();
  formModal.classList.add('hidden');
}

// Render Table
function renderTable() {
  tableBody.innerHTML = '';

  tabs.forEach((tab, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${tab.artist}</td>
      <td>${tab.song}</td>
      <td>${tab.note}</td>
      <td>${tab.tabs}</td>
      <td>
        <button class="btn-edit">Edit</button>
        <button class="btn-delete">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}
