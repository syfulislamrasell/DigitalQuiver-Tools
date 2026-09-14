(function () {
  "use strict";
  var unitsWrap = document.getElementById("bmi-units");
  if (!unitsWrap) return;

  var metricFields = document.getElementById("bmi-metric-fields");
  var imperialFields = document.getElementById("bmi-imperial-fields");
  var weightKg = document.getElementById("bmi-weight-kg");
  var heightCm = document.getElementById("bmi-height-cm");
  var weightLb = document.getElementById("bmi-weight-lb");
  var heightFt = document.getElementById("bmi-height-ft");
  var heightIn = document.getElementById("bmi-height-in");
  var calcBtn = document.getElementById("bmi-calc");
  var results = document.getElementById("bmi-results");
  var valueEl = document.getElementById("bmi-value");
  var categoryEl = document.getElementById("bmi-category");
  var units = "metric";

  function category(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }

  function calc() {
    var bmi;
    if (units === "metric") {
      var kg = parseFloat(weightKg.value);
      var cm = parseFloat(heightCm.value);
      if (!kg || !cm) return;
      var m = cm / 100;
      bmi = kg / (m * m);
    } else {
      var lb = parseFloat(weightLb.value);
      var ft = parseFloat(heightFt.value) || 0;
      var inch = parseFloat(heightIn.value) || 0;
      var totalIn = ft * 12 + inch;
      if (!lb || !totalIn) return;
      bmi = (703 * lb) / (totalIn * totalIn);
    }
    valueEl.textContent = Math.round(bmi * 10) / 10;
    categoryEl.textContent = category(bmi);
    results.style.display = "";
  }

  unitsWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-units]");
    if (!btn) return;
    Array.prototype.forEach.call(unitsWrap.querySelectorAll("button"), function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    units = btn.getAttribute("data-units");
    metricFields.style.display = units === "metric" ? "" : "none";
    imperialFields.style.display = units === "imperial" ? "" : "none";
  });

  calcBtn.addEventListener("click", calc);
  [weightKg, heightCm, weightLb, heightFt, heightIn].forEach(function (el) {
    el.addEventListener("input", calc);
  });
  calc();
})();
