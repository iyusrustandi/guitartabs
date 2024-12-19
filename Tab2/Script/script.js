// =======================Transpose tabs=================================

function increaseTab() {
  var tabElements = document.getElementsByClassName('tabs');
  for (var i = 0; i < tabElements.length; i++) {
    tabElements[i].textContent = incrementTab(tabElements[i].textContent);
  }
}

function decreaseTab() {
  var tabElements = document.getElementsByClassName('tabs');
  for (var i = 0; i < tabElements.length; i++) {
    tabElements[i].textContent = decrementTab(tabElements[i].textContent);
  }
}

function incrementTab(tab) {
  return tab.replace(/\d+/g, function (match) {
    return parseInt(match) + 1;
  });
}

function decrementTab(tab) {
  return tab.replace(/\d+/g, function (match) {
    return Math.max(0, parseInt(match) - 1);
  });
}

// ========================Transposebutton=====================
$.get('Components/transposebutton.html', function (data) {
  $('#transposebutton').replaceWith(data);
});

// ========================Visibility Button=====================
$.get('Components/transposebutton.html', function (data) {
  $('#toggleLyrics').click(function () {
    $('.lyrics').slideToggle();
  });
});

// ====================new tabs button ====================
document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('#tabs-nav .button');
  const sections = document.querySelectorAll('section');

  buttons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      buttons.forEach((button) => {
        button.classList.remove('active');
      });

      button.classList.add('active');

      sections.forEach((section) => {
        section.classList.remove('active');
      });

      const targetId = button.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });
});

// // =================== transposebutton ver 2 ===========================
// document.addEventListener('DOMContentLoaded', function () {
//   // Load header.html into #header-container
//   fetch('Components/transposebutton2.html')
//     .then((response) => response.text())
//     .then((data) => {
//       document.getElementById('transposebutton2').innerHTML = data;
//       highlightActiveButton(); // Highlight the button based on the active section
//       attachTabEventListeners(); // Attach event listeners after loading header
//     });

//   function highlightActiveButton() {
//     const activeSection = document.querySelector('section.active');
//     const targetId = '#' + activeSection.id;

//     // Find the button corresponding to the active section
//     const correspondingButton = document.querySelector(`.transposebutton .button[data-target="${targetId}"]`);

//     if (correspondingButton) {
//       correspondingButton.classList.add('active');
//     }
//   }

//   function attachTabEventListeners() {
//     const buttons = document.querySelectorAll('.transposebutton .button');

//     buttons.forEach((button) => {
//       button.addEventListener('click', function () {
//         const targetSectionId = this.getAttribute('data-target');

//         // Remove active class from all sections
//         document.querySelectorAll('section').forEach((section) => {
//           section.classList.remove('active');
//         });

//         // Hide active state on all buttons
//         buttons.forEach((btn) => btn.classList.remove('active'));

//         // Add active class to the clicked button
//         this.classList.add('active');

//         // Show the selected section
//         document.querySelector(targetSectionId).classList.add('active');
//       });
//     });
//   }
// });

// ======================= lyric tabs =============================
function myFunction() {
  var elements = document.getElementsByClassName('lyricTabs');
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].style.display === 'none') {
      elements[i].style.display = 'block';
    } else {
      elements[i].style.display = 'none';
    }
  }
}
