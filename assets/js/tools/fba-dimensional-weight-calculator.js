(function () {
  "use strict";
  var lengthInput = document.getElementById("dw-length");
  if (!lengthInput) return;

  var widthInput = document.getElementById("dw-width");
  var heightInput = document.getElementById("dw-height");
  var divisorInput = document.getElementById("dw-divisor");
  var actualInput = document.getElementById("dw-actual");

  var dimEl = document.getElementById("dw-dim-weight");
  var billableEl = document.getElementById("dw-billable");

  function calc() {
    var l = parseFloat(lengthInput.value) || 0;
    var w = parseFloat(widthInput.value) || 0;
    var h = parseFloat(heightInput.value) || 0;
    var divisor = parseFloat(divisorInput.value) || 139;
    var actual = parseFloat(actualInput.value) || 0;

    var dimWeight = (l * w * h) / divisor;
    var billable = actual > 0 ? Math.max(dimWeight, actual) : dimWeight;

    dimEl.textContent = dimWeight.toFixed(2) + " lb";
    billableEl.textContent = billable.toFixed(2) + " lb";
  }

  [lengthInput, widthInput, heightInput, divisorInput, actualInput].forEach(function (el) {
    el.addEventListener("input", calc);
  });
  calc();
})();
