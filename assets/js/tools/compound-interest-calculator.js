(function () {
  "use strict";
  var principalInput = document.getElementById("ci-principal");
  if (!principalInput) return;

  var rateInput = document.getElementById("ci-rate");
  var timeInput = document.getElementById("ci-time");
  var freqSelect = document.getElementById("ci-freq");
  var interestEl = document.getElementById("ci-interest");
  var totalEl = document.getElementById("ci-total");

  function calc() {
    var p = parseFloat(principalInput.value) || 0;
    var r = (parseFloat(rateInput.value) || 0) / 100;
    var t = parseFloat(timeInput.value) || 0;
    var n = parseFloat(freqSelect.value) || 1;

    var amount = p * Math.pow(1 + r / n, n * t);
    var interest = amount - p;

    interestEl.textContent = interest.toFixed(2);
    totalEl.textContent = amount.toFixed(2);
  }

  [principalInput, rateInput, timeInput, freqSelect].forEach(function (el) {
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
  });
  calc();
})();
