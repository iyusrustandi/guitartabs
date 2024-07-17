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
$.get('Script/button.html', function (data) {
  $('#transposebutton').replaceWith(data);
});

// ========================Visibility Button=====================
$.get('Script/button.html', function (data) {
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
