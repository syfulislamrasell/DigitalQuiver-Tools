(function () {
  "use strict";
  var beforeInput = document.getElementById("pd-before");
  if (!beforeInput) return;
  var afterInput = document.getElementById("pd-after");
  var compareBtn = document.getElementById("pd-compare");
  var output = document.getElementById("pd-output");

  function tokenize(text) {
    return text.split(/(\s+)/).filter(function (t) { return t.length > 0; });
  }

  function diffWords(a, b) {
    var n = a.length, m = b.length;
    var dp = [];
    for (var i = 0; i <= n; i++) dp.push(new Array(m + 1).fill(0));
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var ops = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) {
        ops.push({ type: "same", text: a[i] });
        i++; j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        ops.push({ type: "del", text: a[i] });
        i++;
      } else {
        ops.push({ type: "add", text: b[j] });
        j++;
      }
    }
    while (i < n) { ops.push({ type: "del", text: a[i] }); i++; }
    while (j < m) { ops.push({ type: "add", text: b[j] }); j++; }
    return ops;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  compareBtn.addEventListener("click", function () {
    var a = tokenize(beforeInput.value);
    var b = tokenize(afterInput.value);
    var ops = diffWords(a, b);
    var html = ops.map(function (op) {
      var text = escapeHtml(op.text);
      if (op.type === "same") return text;
      if (op.type === "add") return '<ins style="background:rgba(46,160,67,0.25); text-decoration:none; border-radius:3px;">' + text + "</ins>";
      return '<del style="background:rgba(248,81,73,0.25); border-radius:3px;">' + text + "</del>";
    }).join("");
    output.innerHTML = html || "<span style=\"color:var(--text-faint)\">Nothing to compare.</span>";
  });
})();
