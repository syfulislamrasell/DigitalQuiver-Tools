(function () {
  "use strict";
  var input = document.getElementById("jsf-input");
  if (!input) return;

  var indentSelect = document.getElementById("jsf-indent");
  var formatBtn = document.getElementById("jsf-format");
  var clearBtn = document.getElementById("jsf-clear");
  var output = document.getElementById("jsf-output");
  var errorMsg = document.getElementById("jsf-error");

  function indentOptions() {
    return indentSelect.value === "tab"
      ? { indent_with_tabs: true }
      : { indent_size: parseInt(indentSelect.value, 10) };
  }

  formatBtn.addEventListener("click", function () {
    try {
      output.value = window.js_beautify(input.value, indentOptions());
      errorMsg.classList.remove("show");
    } catch (e) {
      errorMsg.textContent = "Couldn't format that code: " + e.message;
      errorMsg.classList.add("show");
      output.value = "";
    }
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
    errorMsg.classList.remove("show");
  });
})();
