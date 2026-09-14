(function () {
  "use strict";
  var principalInput = document.getElementById("si-principal");
  if (!principalInput) return;

  var rateInput = document.getElementById("si-rate");
  var timeInput = document.getElementById("si-time");
  var interestEl = document.getElementById("si-interest");
  var totalEl = document.getElementById("si-total");

  function calc() {
    var p = parseFloat(principalInput.value) || 0;
    var r = parseFloat(rateInput.value) || 0;
    var t = parseFloat(timeInput.value) || 0;
    var interest = (p * r * t) / 100;
    interestEl.textContent = interest.toFixed(2);
    totalEl.textContent = (p + interest).toFixed(2);
  }

  [principalInput, rateInput, timeInput].forEach(function (el) { el.addEventListener("input", calc); });
  calc();
})();
