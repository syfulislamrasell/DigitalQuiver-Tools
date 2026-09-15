(function () {
  "use strict";
  var systemInput = document.getElementById("pf-system");
  if (!systemInput) return;
  var userInput = document.getElementById("pf-user");
  var formatSelect = document.getElementById("pf-format");
  var output = document.getElementById("pf-output");

  function render() {
    var sys = systemInput.value.trim();
    var user = userInput.value.trim();

    if (formatSelect.value === "messages") {
      var messages = [];
      if (sys) messages.push({ role: "system", content: sys });
      messages.push({ role: "user", content: user });
      output.value = JSON.stringify({ messages: messages }, null, 2);
    } else {
      var parts = [];
      if (sys) parts.push("<system>\n" + sys + "\n</system>");
      parts.push("<user>\n" + user + "\n</user>");
      output.value = parts.join("\n\n");
    }
  }

  [systemInput, userInput, formatSelect].forEach(function (el) {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  render();
})();
