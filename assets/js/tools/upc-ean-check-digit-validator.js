(function () {
  "use strict";
  var inputEl = document.getElementById("uv-input");
  if (!inputEl) return;

  var resultEl = document.getElementById("uv-result");
  var detailEl = document.getElementById("uv-detail");
  var errorEl = document.getElementById("uv-error");

  function calcCheckDigit(digits) {
    // digits: array of numbers, without the check digit, left to right.
    // GS1 rule: weight 3 for odd positions counted from the RIGHT (1-indexed),
    // weight 1 for even positions, applied to the digits preceding the check digit.
    var sum = 0;
    var len = digits.length;
    for (var i = 0; i < len; i++) {
      var positionFromRight = len - i; // position of this digit if check digit were appended next
      var weight = positionFromRight % 2 === 1 ? 3 : 1;
      sum += digits[i] * weight;
    }
    return (10 - (sum % 10)) % 10;
  }

  function run() {
    var raw = inputEl.value.replace(/\s|-/g, "");
    errorEl.classList.remove("show");
    resultEl.textContent = "";
    detailEl.textContent = "";

    if (!raw) return;

    if (!/^\d+$/.test(raw)) {
      errorEl.textContent = "Enter digits only (spaces and dashes are ignored).";
      errorEl.classList.add("show");
      return;
    }

    var digits = raw.split("").map(Number);
    var format;
    if (digits.length === 11 || digits.length === 12) {
      format = "UPC-A";
    } else if (digits.length === 12 || digits.length === 13) {
      format = "EAN-13";
    }

    if (digits.length === 11) {
      format = "UPC-A";
      var check = calcCheckDigit(digits);
      resultEl.textContent = raw + check;
      detailEl.textContent = "Calculated UPC-A check digit: " + check;
    } else if (digits.length === 12) {
      // Ambiguous: valid as UPC-A (11 data + check) or EAN-13 data-only (12 data, needs check).
      var upcBody = digits.slice(0, 11);
      var upcCheck = digits[11];
      var expectedUpcCheck = calcCheckDigit(upcBody);
      var ean13Check = calcCheckDigit(digits);
      if (upcCheck === expectedUpcCheck) {
        resultEl.textContent = "Valid UPC-A";
        resultEl.style.color = "var(--success)";
        detailEl.textContent = "Check digit " + upcCheck + " matches the expected value.";
      } else {
        resultEl.textContent = "Invalid as UPC-A (expected check digit " + expectedUpcCheck + ")";
        resultEl.style.color = "var(--danger)";
        detailEl.textContent = "As 12 data digits for EAN-13 instead, the check digit would be " + ean13Check + " → " + raw + ean13Check;
      }
    } else if (digits.length === 13) {
      format = "EAN-13";
      var body = digits.slice(0, 12);
      var given = digits[12];
      var expected = calcCheckDigit(body);
      if (given === expected) {
        resultEl.textContent = "Valid EAN-13";
        resultEl.style.color = "var(--success)";
        detailEl.textContent = "Check digit " + given + " matches the expected value.";
      } else {
        resultEl.textContent = "Invalid EAN-13 (expected check digit " + expected + ")";
        resultEl.style.color = "var(--danger)";
        detailEl.textContent = "Given check digit was " + given + ".";
      }
    } else {
      errorEl.textContent = "Enter 11 or 12 digits to calculate a check digit, or 12 (UPC-A) / 13 (EAN-13) digits including the check digit to validate.";
      errorEl.classList.add("show");
    }
  }

  inputEl.addEventListener("input", run);
})();
