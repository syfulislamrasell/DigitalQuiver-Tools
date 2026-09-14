(function () {
  "use strict";
  var input = document.getElementById("ts-input");
  if (!input) return;

  var output = document.getElementById("ts-output");
  var orderWrap = document.getElementById("ts-order");
  var ignoreCase = document.getElementById("ts-ignorecase");
  var dedupe = document.getElementById("ts-dedupe");
  var trim = document.getElementById("ts-trim");
  var sortBtn = document.getElementById("ts-sort");
  var clearBtn = document.getElementById("ts-clear");
  var order = "asc";

  orderWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-order]");
    if (!btn) return;
    Array.prototype.forEach.call(orderWrap.querySelectorAll("button"), function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    order = btn.getAttribute("data-order");
  });

  function sort() {
    var lines = input.value.split("\n");
    if (trim.checked) lines = lines.map(function (l) { return l.trim(); });

    lines.sort(function (a, b) {
      var x = ignoreCase.checked ? a.toLowerCase() : a;
      var y = ignoreCase.checked ? b.toLowerCase() : b;
      if (x < y) return order === "asc" ? -1 : 1;
      if (x > y) return order === "asc" ? 1 : -1;
      return 0;
    });

    if (dedupe.checked) {
      var seen = Object.create(null);
      lines = lines.filter(function (l) {
        var key = ignoreCase.checked ? l.toLowerCase() : l;
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
    }

    output.value = lines.join("\n");
  }

  sortBtn.addEventListener("click", sort);
  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
    input.focus();
  });
})();
