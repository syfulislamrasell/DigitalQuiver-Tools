(function () {
  "use strict";
  var titleInput = document.getElementById("tc-title");
  if (!titleInput) return;

  var titleCountEl = document.getElementById("tc-title-count");
  var bulletInputs = [1, 2, 3, 4, 5].map(function (i) { return document.getElementById("tc-bullet" + i); });
  var bulletCountEls = [1, 2, 3, 4, 5].map(function (i) { return document.getElementById("tc-bullet" + i + "-count"); });
  var totalEl = document.getElementById("tc-total");

  var TITLE_LIMIT = 75;
  var BULLET_LIMIT = 255;
  var BULLET_RECOMMENDED = 200;
  var TOTAL_RECOMMENDED = 1000;

  function setCount(el, length, limit) {
    el.textContent = length + " / " + limit;
    el.style.color = length > limit ? "var(--danger)" : (length > limit * 0.9 ? "var(--accent)" : "var(--success)");
  }

  function calc() {
    setCount(titleCountEl, titleInput.value.length, TITLE_LIMIT);

    var total = 0;
    bulletInputs.forEach(function (input, i) {
      var len = input.value.length;
      total += len;
      setCount(bulletCountEls[i], len, BULLET_LIMIT);
    });

    totalEl.textContent = total + " / " + TOTAL_RECOMMENDED + " recommended";
    totalEl.style.color = total > TOTAL_RECOMMENDED ? "var(--danger)" : "var(--text-dim)";
  }

  titleInput.addEventListener("input", calc);
  bulletInputs.forEach(function (el) { el.addEventListener("input", calc); });
  calc();
})();
