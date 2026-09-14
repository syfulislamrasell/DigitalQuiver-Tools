(function () {
  "use strict";
  var billInput = document.getElementById("tp-bill");
  if (!billInput) return;

  var presetsWrap = document.getElementById("tp-presets");
  var customInput = document.getElementById("tp-custom");
  var peopleInput = document.getElementById("tp-people");
  var tipEl = document.getElementById("tp-tip");
  var totalEl = document.getElementById("tp-total");
  var perPersonEl = document.getElementById("tp-perperson");

  function calc() {
    var bill = parseFloat(billInput.value) || 0;
    var tipPct = parseFloat(customInput.value) || 0;
    var people = Math.max(1, parseInt(peopleInput.value, 10) || 1);

    var tip = bill * (tipPct / 100);
    var total = bill + tip;

    tipEl.textContent = tip.toFixed(2);
    totalEl.textContent = total.toFixed(2);
    perPersonEl.textContent = (total / people).toFixed(2);
  }

  presetsWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-tip]");
    if (!btn) return;
    Array.prototype.forEach.call(presetsWrap.querySelectorAll("button"), function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    customInput.value = btn.getAttribute("data-tip");
    calc();
  });

  [billInput, customInput, peopleInput].forEach(function (el) { el.addEventListener("input", calc); });
  calc();
})();
