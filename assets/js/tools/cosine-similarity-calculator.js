(function () {
  "use strict";
  var vecAInput = document.getElementById("cos-a");
  if (!vecAInput) return;
  var vecBInput = document.getElementById("cos-b");
  var calcBtn = document.getElementById("cos-calc");
  var errorMsg = document.getElementById("cos-error");
  var result = document.getElementById("cos-result");
  var valueEl = document.getElementById("cos-value");
  var interpretationEl = document.getElementById("cos-interpretation");

  function parseVector(str) {
    var parts = str.split(/[\s,]+/).filter(function (s) { return s.length > 0; });
    var nums = parts.map(Number);
    if (nums.some(isNaN)) return null;
    return nums;
  }

  function interpret(sim) {
    if (sim > 0.9) return "Nearly identical";
    if (sim > 0.7) return "Very similar";
    if (sim > 0.4) return "Somewhat similar";
    if (sim > 0.1) return "Slightly similar";
    if (sim > -0.1) return "Unrelated";
    return "Opposite direction";
  }

  calcBtn.addEventListener("click", function () {
    errorMsg.classList.remove("show");
    result.style.display = "none";

    var a = parseVector(vecAInput.value);
    var b = parseVector(vecBInput.value);

    if (!a || !b) {
      errorMsg.textContent = "Both vectors must contain only numbers, separated by commas, spaces or new lines.";
      errorMsg.classList.add("show");
      return;
    }
    if (a.length !== b.length) {
      errorMsg.textContent = "Both vectors must be the same length (A has " + a.length + ", B has " + b.length + ").";
      errorMsg.classList.add("show");
      return;
    }
    if (a.length === 0) {
      errorMsg.textContent = "Enter at least one number in each vector.";
      errorMsg.classList.add("show");
      return;
    }

    var dot = 0, magA = 0, magB = 0;
    for (var i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    if (magA === 0 || magB === 0) {
      errorMsg.textContent = "Cosine similarity is undefined for a zero vector (all values are 0).";
      errorMsg.classList.add("show");
      return;
    }

    var similarity = dot / (magA * magB);
    valueEl.textContent = similarity.toFixed(4);
    interpretationEl.textContent = interpret(similarity);
    result.style.display = "grid";
  });
})();
