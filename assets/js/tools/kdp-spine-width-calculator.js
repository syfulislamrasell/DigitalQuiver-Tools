(function () {
  "use strict";
  var pagesInput = document.getElementById("sw-pages");
  if (!pagesInput) return;

  var paperSelect = document.getElementById("sw-paper");
  var spineInEl = document.getElementById("sw-inches");
  var spineMmEl = document.getElementById("sw-mm");

  var FACTORS = {
    white: 0.002252,
    cream: 0.0025,
    "standard-color": 0.0032,
    "premium-color": 0.002252,
  };

  function calc() {
    var pages = parseFloat(pagesInput.value) || 0;
    var factor = FACTORS[paperSelect.value] || FACTORS.white;
    var inches = pages * factor;

    spineInEl.textContent = inches.toFixed(4) + '"';
    spineMmEl.textContent = (inches * 25.4).toFixed(2) + " mm";
  }

  [pagesInput, paperSelect].forEach(function (el) {
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
  });
  calc();
})();
