(function () {
  "use strict";
  var input = document.getElementById("jwt-input");
  if (!input) return;

  var errorMsg = document.getElementById("jwt-error");
  var resultsWrap = document.getElementById("jwt-results");
  var headerOut = document.getElementById("jwt-header");
  var payloadOut = document.getElementById("jwt-payload");
  var signatureOut = document.getElementById("jwt-signature");
  var expiryEl = document.getElementById("jwt-expiry");

  function base64UrlDecode(str) {
    var padded = str.replace(/-/g, "+").replace(/_/g, "/");
    while (padded.length % 4) padded += "=";
    var binary = atob(padded);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }

  function decode() {
    var token = input.value.trim();
    if (!token) {
      errorMsg.classList.remove("show");
      resultsWrap.style.display = "none";
      return;
    }
    var parts = token.split(".");
    if (parts.length !== 3) {
      errorMsg.classList.add("show");
      resultsWrap.style.display = "none";
      return;
    }
    try {
      var header = JSON.parse(base64UrlDecode(parts[0]));
      var payload = JSON.parse(base64UrlDecode(parts[1]));

      headerOut.value = JSON.stringify(header, null, 2);
      payloadOut.value = JSON.stringify(payload, null, 2);
      signatureOut.value = parts[2];

      if (payload.exp) {
        var expDate = new Date(payload.exp * 1000);
        var expired = expDate.getTime() < Date.now();
        expiryEl.textContent = (expired ? "⚠️ Expired on " : "Valid until ") + expDate.toUTCString();
        expiryEl.style.color = expired ? "var(--danger)" : "var(--success)";
      } else {
        expiryEl.textContent = "No expiry (exp) claim found in payload.";
        expiryEl.style.color = "";
      }

      errorMsg.classList.remove("show");
      resultsWrap.style.display = "";
    } catch (e) {
      errorMsg.classList.add("show");
      resultsWrap.style.display = "none";
    }
  }

  input.addEventListener("input", decode);
})();
