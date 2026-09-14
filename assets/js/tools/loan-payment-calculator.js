(function () {
  "use strict";
  var amountInput = document.getElementById("ln-amount");
  if (!amountInput) return;

  var rateInput = document.getElementById("ln-rate");
  var termInput = document.getElementById("ln-term");
  var termUnit = document.getElementById("ln-term-unit");
  var paymentEl = document.getElementById("ln-payment");
  var totalInterestEl = document.getElementById("ln-total-interest");
  var totalPaidEl = document.getElementById("ln-total-paid");
  var tableBody = document.getElementById("ln-table-body");

  function calc() {
    var principal = parseFloat(amountInput.value) || 0;
    var annualRate = parseFloat(rateInput.value) || 0;
    var term = parseFloat(termInput.value) || 0;
    var months = termUnit.value === "years" ? term * 12 : term;
    var monthlyRate = annualRate / 100 / 12;

    if (principal <= 0 || months <= 0) return;

    var payment;
    if (monthlyRate === 0) {
      payment = principal / months;
    } else {
      var factor = Math.pow(1 + monthlyRate, months);
      payment = (principal * monthlyRate * factor) / (factor - 1);
    }

    var totalPaid = payment * months;
    var totalInterest = totalPaid - principal;

    paymentEl.textContent = payment.toFixed(2);
    totalInterestEl.textContent = totalInterest.toFixed(2);
    totalPaidEl.textContent = totalPaid.toFixed(2);

    var rows = "";
    var balance = principal;
    var rowsToShow = Math.min(12, Math.round(months));
    for (var i = 1; i <= rowsToShow; i++) {
      var interestPortion = balance * monthlyRate;
      var principalPortion = payment - interestPortion;
      balance -= principalPortion;
      rows += "<tr><td>" + i + "</td><td>" + payment.toFixed(2) + "</td><td>" +
        principalPortion.toFixed(2) + "</td><td>" + interestPortion.toFixed(2) + "</td><td>" +
        Math.max(0, balance).toFixed(2) + "</td></tr>";
    }
    tableBody.innerHTML = rows;
  }

  [amountInput, rateInput, termInput, termUnit].forEach(function (el) {
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
  });
  calc();
})();
