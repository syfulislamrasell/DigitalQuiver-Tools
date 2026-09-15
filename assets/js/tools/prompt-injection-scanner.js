(function () {
  "use strict";
  var input = document.getElementById("pis-input");
  if (!input) return;
  var scanBtn = document.getElementById("pis-scan");
  var resultEl = document.getElementById("pis-result");

  var PATTERNS = [
    { re: /ignore\s+(all\s+)?(the\s+)?(above|previous|prior|preceding)\s+(instructions|prompts|rules)/i, label: "\"Ignore previous instructions\"-style override" },
    { re: /disregard\s+(all\s+)?(the\s+)?(above|previous|prior)\s+(instructions|prompts|rules)/i, label: "\"Disregard previous instructions\"-style override" },
    { re: /you\s+are\s+now\s+(a|an)\s/i, label: "\"You are now a...\" role-override attempt" },
    { re: /forget\s+(everything|all)\s+(you|that)/i, label: "\"Forget everything you...\" reset attempt" },
    { re: /reveal\s+(your|the)\s+(system\s+prompt|instructions)/i, label: "Request to reveal system prompt/instructions" },
    { re: /(show|print|output)\s+(me\s+)?(your|the)\s+(system\s+prompt|initial\s+instructions)/i, label: "Request to print system prompt" },
    { re: /\bdo anything now\b|\bDAN\b/i, label: "\"DAN\" / \"do anything now\" jailbreak phrasing" },
    { re: /pretend\s+(you\s+)?(have\s+no|there\s+are\s+no)\s+(restrictions|rules|guidelines)/i, label: "\"Pretend you have no restrictions\" jailbreak phrasing" },
    { re: /act\s+as\s+(if\s+)?(you\s+have\s+)?no\s+(filter|restrictions|limitations)/i, label: "\"Act as if you have no filter\" jailbreak phrasing" },
    { re: /this\s+is\s+(a\s+)?(hypothetical|fictional)\s+scenario.{0,40}(no\s+rules|no\s+restrictions|anything\s+goes)/i, label: "Hypothetical-scenario jailbreak framing" },
    { re: /new\s+instructions?:/i, label: "\"New instructions:\" injection marker" },
    { re: /system\s*:\s*you\s+(are|must|will)/i, label: "Fake \"system:\" role injection" },
    { re: /\[\s*system\s*\]/i, label: "Fake [system] tag injection" },
    { re: /end\s+of\s+(user\s+)?(prompt|input|message)[\s\S]{0,30}(system|assistant)/i, label: "Fake end-of-message + role-switch marker" },
    { re: /base64|rot13/i, label: "Reference to an encoding scheme (sometimes used to smuggle instructions past filters)" },
  ];

  scanBtn.addEventListener("click", function () {
    var text = input.value;
    var matches = [];
    PATTERNS.forEach(function (p) {
      if (p.re.test(text)) matches.push(p.label);
    });

    resultEl.style.display = "block";
    if (matches.length === 0) {
      resultEl.innerHTML = '<p style="color:var(--success); font-weight:600;">No known suspicious patterns matched.</p>';
      return;
    }

    var items = matches.map(function (m) {
      return "<li>" + m.replace(/</g, "&lt;") + "</li>";
    }).join("");
    resultEl.innerHTML =
      '<p style="font-weight:700; color:#c0392b;">' + matches.length + " pattern" + (matches.length === 1 ? "" : "s") + " matched:</p>" +
      '<ul style="margin:8px 0 0 20px; line-height:1.7;">' + items + "</ul>";
  });
})();
