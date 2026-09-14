(function () {
  "use strict";
  var input = document.getElementById("yf-input");
  if (!input) return;

  var formatBtn = document.getElementById("yf-format");
  var toJsonBtn = document.getElementById("yf-tojson");
  var clearBtn = document.getElementById("yf-clear");
  var output = document.getElementById("yf-output");
  var errorMsg = document.getElementById("yf-error");

  function parse() {
    try {
      var data = jsyaml.load(input.value);
      errorMsg.classList.remove("show");
      return data;
    } catch (e) {
      errorMsg.textContent = "Invalid YAML: " + e.message;
      errorMsg.classList.add("show");
      return undefined;
    }
  }

  formatBtn.addEventListener("click", function () {
    var data = parse();
    if (data === undefined) { output.value = ""; return; }
    output.value = jsyaml.dump(data, { indent: 2 });
  });

  toJsonBtn.addEventListener("click", function () {
    var data = parse();
    if (data === undefined) { output.value = ""; return; }
    output.value = JSON.stringify(data, null, 2);
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
    errorMsg.classList.remove("show");
  });
})();
