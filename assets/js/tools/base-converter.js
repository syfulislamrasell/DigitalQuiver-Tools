(function () {
  "use strict";
  var container = document.getElementById("base-converter");
  if (!container) return;

  var decInput = document.getElementById("bc-dec");
  var binInput = document.getElementById("bc-bin");
  var hexInput = document.getElementById("bc-hex");
  var octInput = document.getElementById("bc-oct");
  var errorMsg = document.getElementById("bc-error");
  var clearBtn = document.getElementById("bc-clear");

  var FIELDS = {
    10: { el: decInput, regex: /^[0-9]+$/, prefix: "" },
    2: { el: binInput, regex: /^[01]+$/, prefix: "0b" },
    16: { el: hexInput, regex: /^[0-9a-fA-F]+$/, prefix: "0x" },
    8: { el: octInput, regex: /^[0-7]+$/, prefix: "0o" },
  };

  function updateFrom(base) {
    var field = FIELDS[base];
    var raw = field.el.value.trim();
    if (raw === "") {
      Object.keys(FIELDS).forEach(function (b) {
        if (Number(b) !== base) FIELDS[b].el.value = "";
      });
      errorMsg.classList.remove("show");
      return;
    }
    if (!field.regex.test(raw)) {
      errorMsg.classList.add("show");
      return;
    }
    errorMsg.classList.remove("show");
    var value;
    try {
      value = BigInt(field.prefix + raw);
    } catch (e) {
      errorMsg.classList.add("show");
      return;
    }
    Object.keys(FIELDS).forEach(function (b) {
      var num = Number(b);
      if (num === base) return;
      FIELDS[b].el.value = value.toString(num);
    });
    // hex should render uppercase for readability
    if (base !== 16) hexInput.value = hexInput.value.toUpperCase();
  }

  Object.keys(FIELDS).forEach(function (b) {
    FIELDS[b].el.addEventListener("input", function () {
      updateFrom(Number(b));
    });
  });

  clearBtn.addEventListener("click", function () {
    Object.keys(FIELDS).forEach(function (b) { FIELDS[b].el.value = ""; });
    errorMsg.classList.remove("show");
  });

  // Prefill with an example based on which base this page is about.
  var primary = container.getAttribute("data-primary");
  var examples = { bin: ["bc-bin", "101010"], hex: ["bc-hex", "2A"], dec: ["bc-dec", "42"], oct: ["bc-oct", "52"] };
  var pick = examples[primary] || examples.dec;
  document.getElementById(pick[0]).value = pick[1];
  var baseByField = { "bc-bin": 2, "bc-hex": 16, "bc-dec": 10, "bc-oct": 8 };
  updateFrom(baseByField[pick[0]]);
})();
