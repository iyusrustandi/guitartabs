// scripts/loading-animation.js
function loadTabs(tabsPath) {
  const tabsContent = document.getElementById('tabs-content');
  // Menampilkan animasi loading
  tabsContent.innerHTML = `
    <div class="loading-animation">
      <img src="https://gtabs.vercel.app/images/loading.png" alt="Loading..." />
    </div>
  `;

  fetch(tabsPath)
    .then((response) => {
      if (!response.ok) throw new Error('Tabs file not found');
      return response.text();
    })
    .then((html) => {
      tabsContent.innerHTML = html;
      const initialActiveSection = document.querySelector('.active')?.id;
      if (initialActiveSection) updateButtonStyles(initialActiveSection);
    })
    .catch((error) => {
      console.error(error);
      tabsContent.innerHTML = '<p style="color: red;">Error: Unable to load guitar tabs.</p>';
    });
}
