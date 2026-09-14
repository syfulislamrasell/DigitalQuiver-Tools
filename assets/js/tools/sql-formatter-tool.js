(function () {
  "use strict";
  var input = document.getElementById("sf-input");
  if (!input) return;

  var dialectSelect = document.getElementById("sf-dialect");
  var formatBtn = document.getElementById("sf-format");
  var clearBtn = document.getElementById("sf-clear");
  var output = document.getElementById("sf-output");
  var errorMsg = document.getElementById("sf-error");

  formatBtn.addEventListener("click", function () {
    try {
      output.value = window.sqlFormatter.format(input.value, { language: dialectSelect.value });
      errorMsg.classList.remove("show");
    } catch (e) {
      errorMsg.textContent = "Couldn't format that SQL: " + e.message;
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
