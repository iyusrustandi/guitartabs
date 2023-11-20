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
