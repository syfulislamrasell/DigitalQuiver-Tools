(function () {
  "use strict";
  var modeWrap = document.getElementById("mc-mode");
  if (!modeWrap) return;

  var MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
    I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
    Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
    "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
    ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
    '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
  };
  var REVERSE = {};
  Object.keys(MORSE).forEach(function (k) { REVERSE[MORSE[k]] = k; });

  var panelTo = document.getElementById("mc-panel-to");
  var panelFrom = document.getElementById("mc-panel-from");
  var textInput = document.getElementById("mc-text-input");
  var morseOutput = document.getElementById("mc-morse-output");
  var morseInput = document.getElementById("mc-morse-input");
  var textOutput = document.getElementById("mc-text-output");

  function toMorse() {
    var text = textInput.value.toUpperCase();
    var words = text.split(/\s+/).filter(Boolean);
    var out = words.map(function (word) {
      return word.split("").map(function (ch) { return MORSE[ch] || ""; }).filter(Boolean).join(" ");
    });
    morseOutput.value = out.join(" / ");
  }

  function fromMorse() {
    var raw = morseInput.value.trim();
    if (!raw) { textOutput.value = ""; return; }
    var words = raw.split("/");
    var out = words.map(function (word) {
      return word.trim().split(/\s+/).map(function (code) { return REVERSE[code] || ""; }).join("");
    });
    textOutput.value = out.join(" ");
  }

  modeWrap.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    Array.prototype.forEach.call(modeWrap.querySelectorAll("button"), function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    var mode = btn.getAttribute("data-mode");
    panelTo.style.display = mode === "to" ? "" : "none";
    panelFrom.style.display = mode === "from" ? "" : "none";
  });

  textInput.addEventListener("input", toMorse);
  morseInput.addEventListener("input", fromMorse);

  var table = document.getElementById("mc-table");
  var rows = Object.keys(MORSE).map(function (k) {
    return "<tr><td>" + k + "</td><td>" + MORSE[k] + "</td></tr>";
  });
  var half = Math.ceil(rows.length / 2);
  var body = "<thead><tr><th>Char</th><th>Morse</th><th>Char</th><th>Morse</th></tr></thead><tbody>";
  for (var i = 0; i < half; i++) {
    var left = Object.keys(MORSE)[i];
    var rightIdx = i + half;
    var right = Object.keys(MORSE)[rightIdx];
    body += "<tr><td>" + left + "</td><td>" + MORSE[left] + "</td>" +
      (right ? "<td>" + right + "</td><td>" + MORSE[right] + "</td>" : "<td></td><td></td>") + "</tr>";
  }
  body += "</tbody>";
  table.innerHTML = body;

  toMorse();
})();
