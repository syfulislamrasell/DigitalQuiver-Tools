(function () {
  "use strict";
  var patternInput = document.getElementById("rt-pattern");
  if (!patternInput) return;

  var textInput = document.getElementById("rt-text");
  var errorMsg = document.getElementById("rt-error");
  var highlightEl = document.getElementById("rt-highlight");
  var countEl = document.getElementById("rt-count");
  var matchesBody = document.getElementById("rt-matches-body");
  var flagBoxes = {
    g: document.getElementById("rt-flag-g"),
    i: document.getElementById("rt-flag-i"),
    m: document.getElementById("rt-flag-m"),
    s: document.getElementById("rt-flag-s"),
  };

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function currentFlags() {
    return Object.keys(flagBoxes).filter(function (f) { return flagBoxes[f].checked; }).join("");
  }

  function getMatches(regex, text) {
    if (regex.global) return Array.from(text.matchAll(regex));
    var m = regex.exec(text);
    return m ? [m] : [];
  }

  function update() {
    var pattern = patternInput.value;
    var text = textInput.value;
    if (!pattern) {
      errorMsg.classList.remove("show");
      highlightEl.textContent = text;
      countEl.textContent = "";
      matchesBody.innerHTML = "";
      return;
    }

    var regex;
    try {
      regex = new RegExp(pattern, currentFlags());
      errorMsg.classList.remove("show");
    } catch (e) {
      errorMsg.textContent = "Invalid regular expression: " + e.message;
      errorMsg.classList.add("show");
      highlightEl.textContent = text;
      countEl.textContent = "";
      matchesBody.innerHTML = "";
      return;
    }

    var matches = getMatches(regex, text);

    var html = "";
    var lastIndex = 0;
    matches.forEach(function (m) {
      html += escapeHtml(text.slice(lastIndex, m.index));
      html += '<mark class="rt-mark">' + escapeHtml(m[0]) + "</mark>";
      lastIndex = m.index + (m[0].length || 1);
    });
    html += escapeHtml(text.slice(lastIndex));
    highlightEl.innerHTML = html || "<span style='color:var(--text-faint)'>(no matches)</span>";

    countEl.textContent = matches.length + " match" + (matches.length === 1 ? "" : "es") + " found.";

    matchesBody.innerHTML = matches.map(function (m, i) {
      var groups = m.slice(1).filter(function (g) { return g !== undefined; });
      return "<tr><td>" + (i + 1) + "</td><td>" + escapeHtml(m[0]) + "</td><td>" +
        (groups.length ? escapeHtml(groups.join(", ")) : "—") + "</td><td>" + m.index + "</td></tr>";
    }).join("");
  }

  patternInput.addEventListener("input", update);
  textInput.addEventListener("input", update);
  Object.keys(flagBoxes).forEach(function (f) { flagBoxes[f].addEventListener("change", update); });

  update();
})();
