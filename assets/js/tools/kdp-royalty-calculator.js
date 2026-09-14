(function () {
  "use strict";
  var ebookBtn = document.getElementById("kr-mode-ebook");
  if (!ebookBtn) return;

  var paperbackBtn = document.getElementById("kr-mode-paperback");
  var ebookPanel = document.getElementById("kr-ebook-panel");
  var paperbackPanel = document.getElementById("kr-paperback-panel");

  var priceInput = document.getElementById("kr-price");
  var planSelect = document.getElementById("kr-plan");
  var fileSizeInput = document.getElementById("kr-filesize");
  var fileSizeField = document.getElementById("kr-filesize-field");

  var pbPriceInput = document.getElementById("kr-pb-price");
  var pageCountInput = document.getElementById("kr-pb-pages");
  var inkSelect = document.getElementById("kr-pb-ink");

  var royaltyEl = document.getElementById("kr-royalty");
  var detailEl = document.getElementById("kr-detail");
  var noteEl = document.getElementById("kr-note");

  var mode = "ebook";

  function setMode(next) {
    mode = next;
    ebookBtn.classList.toggle("active", mode === "ebook");
    paperbackBtn.classList.toggle("active", mode === "paperback");
    ebookPanel.style.display = mode === "ebook" ? "" : "none";
    paperbackPanel.style.display = mode === "paperback" ? "" : "none";
    calc();
  }

  function calcEbook() {
    var price = parseFloat(priceInput.value) || 0;
    var plan = planSelect.value;
    var fileSize = parseFloat(fileSizeInput.value) || 0;

    fileSizeField.style.display = plan === "70" ? "" : "none";

    var eligibleFor70 = price >= 2.99 && price <= 12.99;
    var royalty, note;

    if (plan === "70" && eligibleFor70) {
      var delivery = fileSize * 0.15;
      royalty = price * 0.70 - delivery;
      detailEl.textContent = "70% of $" + price.toFixed(2) + " minus delivery cost ($0.15/MB × " + fileSize.toFixed(1) + " MB = $" + delivery.toFixed(2) + ")";
      note = "";
    } else {
      royalty = price * 0.35;
      detailEl.textContent = "35% of $" + price.toFixed(2) + " — no delivery fee at this rate.";
      note = plan === "70" && !eligibleFor70
        ? "The 70% royalty plan only applies to list prices between $2.99 and $12.99, so 35% is used here instead."
        : "";
    }

    royaltyEl.textContent = "$" + royalty.toFixed(2);
    noteEl.textContent = note;
  }

  function calcPaperback() {
    var price = parseFloat(pbPriceInput.value) || 0;
    var pages = parseFloat(pageCountInput.value) || 0;
    var ink = inkSelect.value;

    var perPage = ink === "bw" ? 0.012 : (ink === "standard-color" ? 0.0255 : 0.065);
    var printingCost = 1.00 + pages * perPage;
    var rate = price >= 9.99 ? 0.60 : 0.50;
    var royalty = price * rate - printingCost;

    royaltyEl.textContent = "$" + royalty.toFixed(2);
    detailEl.textContent = (rate * 100) + "% of $" + price.toFixed(2) + " minus printing cost ($" + printingCost.toFixed(2) + " for " + pages + " pages)";
    noteEl.textContent = royalty < 0 ? "This price doesn't cover the printing cost — you'd lose money on every sale at this price." : "";
  }

  function calc() {
    if (mode === "ebook") calcEbook(); else calcPaperback();
  }

  ebookBtn.addEventListener("click", function () { setMode("ebook"); });
  paperbackBtn.addEventListener("click", function () { setMode("paperback"); });
  [priceInput, planSelect, fileSizeInput, pbPriceInput, pageCountInput, inkSelect].forEach(function (el) {
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
  });

  setMode("ebook");
})();
