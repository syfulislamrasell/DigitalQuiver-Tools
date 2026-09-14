(function () {
  "use strict";
  var output = document.getElementById("rn-output");
  if (!output) return;

  var minInput = document.getElementById("rn-min");
  var maxInput = document.getElementById("rn-max");
  var countInput = document.getElementById("rn-count");
  var decimalsCheck = document.getElementById("rn-decimals");
  var uniqueCheck = document.getElementById("rn-unique");
  var generateBtn = document.getElementById("rn-generate");
  var errorMsg = document.getElementById("rn-error");

  function secureRandomInt(maxExclusive) {
    var range = Math.floor(4294967296 / maxExclusive) * maxExclusive;
    var val;
    do {
      val = crypto.getRandomValues(new Uint32Array(1))[0];
    } while (val >= range);
    return val % maxExclusive;
  }

  function randomInRange(min, max) {
    return min + secureRandomInt(max - min + 1);
  }

  function randomDecimalInRange(min, max) {
    var r = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
    return Math.round((min + r * (max - min)) * 100) / 100;
  }

  function generate() {
    errorMsg.classList.remove("show");
    var min = parseFloat(minInput.value);
    var max = parseFloat(maxInput.value);
    var count = Math.min(1000, Math.max(1, parseInt(countInput.value, 10) || 1));

    if (isNaN(min) || isNaN(max) || min > max) {
      errorMsg.textContent = "Minimum must be less than or equal to maximum.";
      errorMsg.classList.add("show");
      output.value = "";
      return;
    }

    var results = [];

    if (decimalsCheck.checked) {
      for (var i = 0; i < count; i++) results.push(randomDecimalInRange(min, max));
    } else {
      min = Math.ceil(min);
      max = Math.floor(max);
      var rangeSize = max - min + 1;
      if (uniqueCheck.checked && count > rangeSize) {
        errorMsg.textContent = "Can't generate " + count + " unique numbers from a range that only has " + rangeSize + " whole numbers.";
        errorMsg.classList.add("show");
        output.value = "";
        return;
      }
      if (uniqueCheck.checked) {
        var pool = [];
        for (var n = min; n <= max; n++) pool.push(n);
        for (var j = pool.length - 1; j > 0; j--) {
          var k = secureRandomInt(j + 1);
          var tmp = pool[j];
          pool[j] = pool[k];
          pool[k] = tmp;
        }
        results = pool.slice(0, count);
      } else {
        for (var m = 0; m < count; m++) results.push(randomInRange(min, max));
      }
    }

    output.value = results.join("\n");
  }

  generateBtn.addEventListener("click", generate);
  generate();
})();
