(function () {
  "use strict";
  var input = document.getElementById("atc-input");
  if (!input) return;
  var charsEl = document.getElementById("atc-chars");
  var wordsEl = document.getElementById("atc-words");
  var gptEl = document.getElementById("atc-gpt");
  var claudeEl = document.getElementById("atc-claude");

  function update() {
    var text = input.value;
    var chars = text.length;
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    // Character-based heuristic estimate (not an exact tokenizer count).
    var gptEstimate = Math.round(chars / 4);
    var claudeEstimate = Math.round(chars / 3.8);

    charsEl.textContent = chars.toLocaleString();
    wordsEl.textContent = words.toLocaleString();
    gptEl.textContent = "~" + gptEstimate.toLocaleString();
    claudeEl.textContent = "~" + claudeEstimate.toLocaleString();
  }

  input.addEventListener("input", update);
  update();
})();
