(function () {
  "use strict";
  var input = document.getElementById("cf-input");
  if (!input) return;

  var indentSelect = document.getElementById("cf-indent");
  var formatBtn = document.getElementById("cf-format");
  var clearBtn = document.getElementById("cf-clear");
  var output = document.getElementById("cf-output");

  function indentOptions() {
    return indentSelect.value === "tab"
      ? { indent_with_tabs: true }
      : { indent_size: parseInt(indentSelect.value, 10) };
  }

  formatBtn.addEventListener("click", function () {
    output.value = window.css_beautify(input.value, indentOptions());
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
  });
})();
