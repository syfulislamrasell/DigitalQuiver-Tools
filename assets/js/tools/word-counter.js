(function () {
  "use strict";
  var input = document.getElementById("wc-input");
  if (!input) return;

  var words = document.getElementById("wc-words");
  var chars = document.getElementById("wc-chars");
  var charsNoSpace = document.getElementById("wc-chars-nospace");
  var sentences = document.getElementById("wc-sentences");
  var paragraphs = document.getElementById("wc-paragraphs");
  var reading = document.getElementById("wc-reading");

  function update() {
    var text = input.value;
    var trimmed = text.trim();

    var wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    var sentenceCount = trimmed === "" ? 0 : (trimmed.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || []).filter(function (s) {
      return s.trim().length > 0;
    }).length;
    var paragraphCount = trimmed === "" ? 0 : trimmed.split(/\n\s*\n/).filter(function (p) {
      return p.trim().length > 0;
    }).length;

    words.textContent = wordCount;
    chars.textContent = text.length;
    charsNoSpace.textContent = text.replace(/\s/g, "").length;
    sentences.textContent = sentenceCount;
    paragraphs.textContent = paragraphCount;

    var minutes = wordCount / 200;
    if (minutes < 1) {
      reading.textContent = Math.max(1, Math.round(minutes * 60)) + " sec";
    } else {
      reading.textContent = Math.round(minutes * 10) / 10 + " min";
    }
  }

  input.addEventListener("input", update);
  update();
})();
