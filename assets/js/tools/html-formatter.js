(function () {
  "use strict";
  var input = document.getElementById("hf-input");
  if (!input) return;

  var indentSelect = document.getElementById("hf-indent");
  var formatBtn = document.getElementById("hf-format");
  var clearBtn = document.getElementById("hf-clear");
  var output = document.getElementById("hf-output");

  function indentOptions() {
    return indentSelect.value === "tab"
      ? { indent_with_tabs: true }
      : { indent_size: parseInt(indentSelect.value, 10) };
  }

  formatBtn.addEventListener("click", function () {
    output.value = window.html_beautify(input.value, indentOptions());
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
  });
})();
