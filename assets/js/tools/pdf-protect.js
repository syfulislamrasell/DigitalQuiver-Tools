(function () {
  "use strict";
  var fileInput = document.getElementById("pp-file");
  if (!fileInput) return;

  var userPwInput = document.getElementById("pp-userpw");
  var ownerPwInput = document.getElementById("pp-ownerpw");
  var protectBtn = document.getElementById("pp-protect");
  var downloadBtn = document.getElementById("pp-download");
  var errorMsg = document.getElementById("pp-error");
  var statusEl = document.getElementById("pp-status");

  var srcBytes = null;
  var resultUrl = null;

  fileInput.addEventListener("change", async function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    downloadBtn.disabled = true;
    srcBytes = await file.arrayBuffer();
    protectBtn.disabled = false;
  });

  protectBtn.addEventListener("click", async function () {
    if (!userPwInput.value) {
      errorMsg.textContent = "Please enter a password to open the file.";
      errorMsg.classList.add("show");
      return;
    }
    errorMsg.classList.remove("show");
    statusEl.textContent = "Encrypting...";
    protectBtn.disabled = true;
    try {
      var doc = await PDFLib.PDFDocument.load(srcBytes);
      doc.encrypt({
        userPassword: userPwInput.value,
        ownerPassword: ownerPwInput.value || userPwInput.value,
        algorithm: "AES-256",
      });
      var newBytes = await doc.save();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(new Blob([newBytes], { type: "application/pdf" }));
      downloadBtn.disabled = false;
      statusEl.textContent = "Protected. This file now requires the password to open.";
    } catch (e) {
      errorMsg.textContent = "Couldn't protect that PDF: " + e.message;
      errorMsg.classList.add("show");
      statusEl.textContent = "";
    }
    protectBtn.disabled = false;
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var link = document.createElement("a");
    link.download = "protected.pdf";
    link.href = resultUrl;
    link.click();
  });
})();
