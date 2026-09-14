(function () {
  "use strict";
  var textInput = document.getElementById("bc-text");
  if (!textInput) return;

  var roundsInput = document.getElementById("bc-rounds");
  var roundsVal = document.getElementById("bc-rounds-val");
  var generateBtn = document.getElementById("bc-generate");
  var output = document.getElementById("bc-output");

  var verifyText = document.getElementById("bc-verify-text");
  var verifyHash = document.getElementById("bc-verify-hash");
  var verifyBtn = document.getElementById("bc-verify-btn");
  var verifyResult = document.getElementById("bc-verify-result");

  var bcrypt = window.dcodeIO && window.dcodeIO.bcrypt;

  roundsInput.addEventListener("input", function () {
    roundsVal.textContent = roundsInput.value;
  });

  generateBtn.addEventListener("click", function () {
    if (!textInput.value) return;
    var rounds = parseInt(roundsInput.value, 10);
    generateBtn.disabled = true;
    generateBtn.textContent = "Hashing...";
    output.value = "";

    bcrypt.genSalt(rounds, function (err, salt) {
      if (err) {
        output.value = "Error generating salt.";
        resetBtn();
        return;
      }
      bcrypt.hash(textInput.value, salt, function (err2, hash) {
        resetBtn();
        if (err2) {
          output.value = "Error generating hash.";
          return;
        }
        output.value = hash;
      });
    });

    function resetBtn() {
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate Hash";
    }
  });

  verifyBtn.addEventListener("click", function () {
    if (!verifyText.value || !verifyHash.value) return;
    verifyResult.textContent = "Checking...";
    verifyResult.style.color = "";
    try {
      bcrypt.compare(verifyText.value, verifyHash.value, function (err, res) {
        if (err) {
          verifyResult.textContent = "Invalid hash format.";
          verifyResult.style.color = "var(--danger)";
          return;
        }
        verifyResult.textContent = res ? "✅ Match — the text matches this hash." : "❌ No match.";
        verifyResult.style.color = res ? "var(--success)" : "var(--danger)";
      });
    } catch (e) {
      verifyResult.textContent = "Invalid hash format.";
      verifyResult.style.color = "var(--danger)";
    }
  });
})();
