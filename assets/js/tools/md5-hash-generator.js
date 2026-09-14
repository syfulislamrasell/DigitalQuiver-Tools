(function () {
  "use strict";
  var input = document.getElementById("md5-input");
  if (!input) return;

  var output = document.getElementById("md5-output");

  function update() {
    output.value = input.value ? md5(input.value) : "";
  }

  input.addEventListener("input", update);
})();
