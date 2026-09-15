(function () {
  "use strict";
  var input = document.getElementById("rcc-input");
  if (!input) return;
  var sizeInput = document.getElementById("rcc-size");
  var overlapInput = document.getElementById("rcc-overlap");
  var calcBtn = document.getElementById("rcc-calc");
  var errorMsg = document.getElementById("rcc-error");
  var summary = document.getElementById("rcc-summary");
  var countEl = document.getElementById("rcc-count");
  var totalTokensEl = document.getElementById("rcc-total-tokens");
  var chunksEl = document.getElementById("rcc-chunks");

  var CHARS_PER_TOKEN = 4;

  calcBtn.addEventListener("click", function () {
    errorMsg.classList.remove("show");
    var text = input.value;
    var chunkTokens = parseInt(sizeInput.value, 10);
    var overlapTokens = parseInt(overlapInput.value, 10) || 0;

    if (!text.trim()) {
      errorMsg.textContent = "Paste some text first.";
      errorMsg.classList.add("show");
      summary.style.display = "none";
      chunksEl.innerHTML = "";
      return;
    }
    if (!chunkTokens || chunkTokens <= 0) {
      errorMsg.textContent = "Chunk size must be a positive number.";
      errorMsg.classList.add("show");
      return;
    }
    if (overlapTokens >= chunkTokens) {
      errorMsg.textContent = "Overlap must be smaller than the chunk size.";
      errorMsg.classList.add("show");
      return;
    }

    var chunkChars = chunkTokens * CHARS_PER_TOKEN;
    var overlapChars = overlapTokens * CHARS_PER_TOKEN;
    var step = chunkChars - overlapChars;

    var chunks = [];
    var pos = 0;
    while (pos < text.length) {
      var end = Math.min(text.length, pos + chunkChars);
      chunks.push(text.slice(pos, end));
      if (end >= text.length) break;
      pos += step;
    }

    countEl.textContent = chunks.length;
    var totalEstTokens = Math.round(text.length / CHARS_PER_TOKEN);
    totalTokensEl.textContent = "~" + totalEstTokens.toLocaleString();
    summary.style.display = "grid";

    chunksEl.innerHTML = "";
    chunks.forEach(function (chunk, i) {
      var box = document.createElement("div");
      box.style.cssText = "border:1px solid var(--border-light); border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:8px; background:var(--bg-elevated);";
      var label = document.createElement("div");
      label.style.cssText = "font-weight:700; font-size:0.82rem; color:var(--text-dim); margin-bottom:4px;";
      label.textContent = "Chunk " + (i + 1) + " (~" + Math.round(chunk.length / CHARS_PER_TOKEN) + " tokens)";
      var body = document.createElement("div");
      body.style.cssText = "font-size:0.86rem; white-space:pre-wrap; max-height:100px; overflow:auto;";
      body.textContent = chunk;
      box.appendChild(label);
      box.appendChild(body);
      chunksEl.appendChild(box);
    });
  });
})();
