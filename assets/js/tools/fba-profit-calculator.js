(function () {
  "use strict";
  var costInput = document.getElementById("fp-cost");
  if (!costInput) return;

  var priceInput = document.getElementById("fp-price");
  var referralInput = document.getElementById("fp-referral");
  var fulfillmentInput = document.getElementById("fp-fulfillment");
  var otherInput = document.getElementById("fp-other");

  var profitEl = document.getElementById("fp-profit");
  var marginEl = document.getElementById("fp-margin");
  var roiEl = document.getElementById("fp-roi");
  var feesEl = document.getElementById("fp-fees");

  function calc() {
    var cost = parseFloat(costInput.value) || 0;
    var price = parseFloat(priceInput.value) || 0;
    var referralPct = parseFloat(referralInput.value) || 0;
    var fulfillment = parseFloat(fulfillmentInput.value) || 0;
    var other = parseFloat(otherInput.value) || 0;

    var referralFee = price * (referralPct / 100);
    var totalFees = referralFee + fulfillment + other;
    var profit = price - cost - totalFees;
    var margin = price > 0 ? (profit / price) * 100 : 0;
    var roi = cost > 0 ? (profit / cost) * 100 : 0;

    profitEl.textContent = "$" + profit.toFixed(2);
    marginEl.textContent = margin.toFixed(1) + "%";
    roiEl.textContent = roi.toFixed(1) + "%";
    feesEl.textContent = "$" + totalFees.toFixed(2);

    profitEl.style.color = profit < 0 ? "var(--danger)" : "var(--accent)";
  }

  [costInput, priceInput, referralInput, fulfillmentInput, otherInput].forEach(function (el) {
    el.addEventListener("input", calc);
  });
  calc();
})();
