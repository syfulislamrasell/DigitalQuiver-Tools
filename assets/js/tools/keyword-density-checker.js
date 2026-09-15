(function () {
  "use strict";
  var input = document.getElementById("kdc-input");
  if (!input) return;
  var phraseSelect = document.getElementById("kdc-phrase");
  var minLenInput = document.getElementById("kdc-minlen");
  var stopwordsCheckbox = document.getElementById("kdc-stopwords");
  var analyzeBtn = document.getElementById("kdc-analyze");
  var summary = document.getElementById("kdc-summary");
  var table = document.getElementById("kdc-table");
  var resultsBody = document.getElementById("kdc-results");

  var STOPWORDS = ("a an the and or but if then else for nor so yet of to in on at by with " +
    "from as is are was were be been being this that these those it its it's i you he she " +
    "we they them his her our your their not no do does did doing have has had having will " +
    "would shall should can could may might must there here what which who whom when where " +
    "why how all any both each few more most other some such only own same than too very " +
    "just about into over under again further once").split(" ").reduce(function (set, w) {
    set[w] = true;
    return set;
  }, {});

  analyzeBtn.addEventListener("click", function () {
    var text = input.value;
    var n = parseInt(phraseSelect.value, 10);
    var minLen = Math.max(1, parseInt(minLenInput.value, 10) || 1);
    var filterStop = stopwordsCheckbox.checked;

    var words = (text.toLowerCase().match(/[a-z0-9']+/g) || []);
    var totalWords = words.length;

    if (totalWords === 0) {
      summary.textContent = "Paste some content first.";
      table.style.display = "none";
      resultsBody.innerHTML = "";
      return;
    }

    var filteredIndices = words.map(function (w, i) { return i; }).filter(function (i) {
      var w = words[i];
      if (w.length < minLen) return false;
      if (filterStop && STOPWORDS[w]) return false;
      return true;
    });

    var counts = {};
    if (n === 1) {
      filteredIndices.forEach(function (i) {
        counts[words[i]] = (counts[words[i]] || 0) + 1;
      });
    } else {
      for (var i = 0; i <= words.length - n; i++) {
        var slice = words.slice(i, i + n);
        var allowed = slice.every(function (w) {
          if (w.length < minLen) return false;
          if (filterStop && STOPWORDS[w]) return false;
          return true;
        });
        if (!allowed) continue;
        var phrase = slice.join(" ");
        counts[phrase] = (counts[phrase] || 0) + 1;
      }
    }

    var entries = Object.keys(counts).map(function (k) { return [k, counts[k]]; });
    entries.sort(function (a, b) { return b[1] - a[1]; });
    entries = entries.slice(0, 50);

    summary.textContent = totalWords.toLocaleString() + " total words analyzed.";
    resultsBody.innerHTML = "";
    entries.forEach(function (entry) {
      var tr = document.createElement("tr");
      var tdWord = document.createElement("td");
      tdWord.textContent = entry[0];
      var tdCount = document.createElement("td");
      tdCount.textContent = entry[1];
      var tdDensity = document.createElement("td");
      tdDensity.textContent = ((entry[1] * n / totalWords) * 100).toFixed(2) + "%";
      tr.appendChild(tdWord);
      tr.appendChild(tdCount);
      tr.appendChild(tdDensity);
      resultsBody.appendChild(tr);
    });
    table.style.display = entries.length ? "table" : "none";
  });
})();
