(function () {
  "use strict";
  var input = document.getElementById("jf-input");
  if (!input) return;

  var indentSelect = document.getElementById("jf-indent");
  var formatBtn = document.getElementById("jf-format");
  var minifyBtn = document.getElementById("jf-minify");
  var clearBtn = document.getElementById("jf-clear");
  var output = document.getElementById("jf-output");
  var errorMsg = document.getElementById("jf-error");
  var validMsg = document.getElementById("jf-valid");

  function indentValue() {
    return indentSelect.value === "tab" ? "\t" : parseInt(indentSelect.value, 10);
  }

  function parse() {
    try {
      var data = JSON.parse(input.value);
      errorMsg.classList.remove("show");
      validMsg.style.display = "";
      return data;
    } catch (e) {
      errorMsg.textContent = "Invalid JSON: " + e.message;
      errorMsg.classList.add("show");
      validMsg.style.display = "none";
      return undefined;
    }
  }

  formatBtn.addEventListener("click", function () {
    var data = parse();
    if (data === undefined) { output.value = ""; return; }
    output.value = JSON.stringify(data, null, indentValue());
  });

  minifyBtn.addEventListener("click", function () {
    var data = parse();
    if (data === undefined) { output.value = ""; return; }
    output.value = JSON.stringify(data);
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
    errorMsg.classList.remove("show");
    validMsg.style.display = "none";
  });
})();
