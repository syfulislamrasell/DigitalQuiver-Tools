(function () {
  "use strict";
  var priceInput = document.getElementById("dc-price");
  if (!priceInput) return;

  var discountInput = document.getElementById("dc-discount");
  var taxInput = document.getElementById("dc-tax");
  var savedEl = document.getElementById("dc-saved");
  var finalEl = document.getElementById("dc-final");
  var taxAmountEl = document.getElementById("dc-tax-amount");

  function calc() {
    var price = parseFloat(priceInput.value) || 0;
    var discount = parseFloat(discountInput.value) || 0;
    var tax = parseFloat(taxInput.value) || 0;

    var saved = price * (discount / 100);
    var discounted = price - saved;
    var taxAmount = discounted * (tax / 100);
    var final = discounted + taxAmount;

    savedEl.textContent = saved.toFixed(2);
    finalEl.textContent = final.toFixed(2);
    taxAmountEl.textContent = taxAmount.toFixed(2);
  }

  [priceInput, discountInput, taxInput].forEach(function (el) { el.addEventListener("input", calc); });
  calc();
})();
