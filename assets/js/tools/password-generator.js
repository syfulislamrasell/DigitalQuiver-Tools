(function () {
  "use strict";
  var output = document.getElementById("pg-output");
  if (!output) return;

  var lengthInput = document.getElementById("pg-length");
  var lengthVal = document.getElementById("pg-length-val");
  var upper = document.getElementById("pg-upper");
  var lower = document.getElementById("pg-lower");
  var numbers = document.getElementById("pg-numbers");
  var symbols = document.getElementById("pg-symbols");
  var ambiguous = document.getElementById("pg-ambiguous");
  var generateBtn = document.getElementById("pg-generate");
  var errorMsg = document.getElementById("pg-error");
  var strengthEl = document.getElementById("pg-strength");
  var entropyEl = document.getElementById("pg-entropy");

  var SETS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
  };
  var AMBIGUOUS = "lI1O0";

  function secureRandomInt(maxExclusive) {
    var range = 256 - (256 % maxExclusive);
    var byte;
    do {
      byte = crypto.getRandomValues(new Uint8Array(1))[0];
    } while (byte >= range);
    return byte % maxExclusive;
  }

  function buildCharset() {
    var charset = "";
    if (upper.checked) charset += SETS.upper;
    if (lower.checked) charset += SETS.lower;
    if (numbers.checked) charset += SETS.numbers;
    if (symbols.checked) charset += SETS.symbols;
    if (ambiguous.checked) {
      charset = charset.split("").filter(function (c) { return AMBIGUOUS.indexOf(c) === -1; }).join("");
    }
    return charset;
  }

  function generate() {
    var charset = buildCharset();
    if (!charset) {
      errorMsg.classList.add("show");
      output.value = "";
      strengthEl.textContent = "—";
      entropyEl.textContent = "0";
      return;
    }
    errorMsg.classList.remove("show");
    var length = parseInt(lengthInput.value, 10);
    var pwd = "";
    for (var i = 0; i < length; i++) {
      pwd += charset[secureRandomInt(charset.length)];
    }
    output.value = pwd;

    var entropy = Math.round(length * Math.log2(charset.length));
    entropyEl.textContent = entropy;
    var label = "Weak";
    if (entropy >= 100) label = "Excellent";
    else if (entropy >= 80) label = "Very Strong";
    else if (entropy >= 60) label = "Strong";
    else if (entropy >= 40) label = "Moderate";
    strengthEl.textContent = label;
  }

  lengthInput.addEventListener("input", function () {
    lengthVal.textContent = lengthInput.value;
    generate();
  });
  [upper, lower, numbers, symbols, ambiguous].forEach(function (el) {
    el.addEventListener("change", generate);
  });
  generateBtn.addEventListener("click", generate);

  generate();
})();
