(function () {
  "use strict";
  var input = document.getElementById("cc-input");
  if (!input) return;

  var total = document.getElementById("cc-total");
  var nospace = document.getElementById("cc-nospace");
  var remaining = document.getElementById("cc-remaining");
  var presetWrap = document.getElementById("cc-presets");
  var currentLimit = 0;

  function update() {
    var text = input.value;
    total.textContent = text.length;
    nospace.textContent = text.replace(/\s/g, "").length;
    if (currentLimit > 0) {
      remaining.textContent = currentLimit - text.length;
    } else {
      remaining.textContent = "—";
    }
  }

  presetWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-limit]");
    if (!btn) return;
    Array.prototype.forEach.call(presetWrap.querySelectorAll("button"), function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentLimit = parseInt(btn.getAttribute("data-limit"), 10) || 0;
    update();
  });

  input.addEventListener("input", update);
  update();
})();
