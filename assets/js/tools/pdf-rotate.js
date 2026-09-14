(function () {
  "use strict";
  var fileInput = document.getElementById("pr-file");
  if (!fileInput) return;

  var pageCountEl = document.getElementById("pr-pagecount");
  var angleSelect = document.getElementById("pr-angle");
  var rotateBtn = document.getElementById("pr-rotate");
  var downloadBtn = document.getElementById("pr-download");
  var errorMsg = document.getElementById("pr-error");
  var statusEl = document.getElementById("pr-status");

  var srcBytes = null;
  var resultUrl = null;

  fileInput.addEventListener("change", async function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    downloadBtn.disabled = true;
    try {
      srcBytes = await file.arrayBuffer();
      var doc = await PDFLib.PDFDocument.load(srcBytes);
      pageCountEl.textContent = "This PDF has " + doc.getPageCount() + " page(s).";
      rotateBtn.disabled = false;
    } catch (e) {
      errorMsg.textContent = "Couldn't read that PDF: " + e.message;
      errorMsg.classList.add("show");
      pageCountEl.textContent = "";
    }
  });

  rotateBtn.addEventListener("click", async function () {
    errorMsg.classList.remove("show");
    statusEl.textContent = "Rotating...";
    rotateBtn.disabled = true;
    try {
      var doc = await PDFLib.PDFDocument.load(srcBytes);
      var angle = parseInt(angleSelect.value, 10);
      doc.getPages().forEach(function (page) {
        var current = page.getRotation().angle;
        page.setRotation(PDFLib.degrees((current + angle) % 360));
      });
      var newBytes = await doc.save();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(new Blob([newBytes], { type: "application/pdf" }));
      downloadBtn.disabled = false;
      statusEl.textContent = "Rotated all pages by " + angle + "°.";
    } catch (e) {
      errorMsg.textContent = "Couldn't rotate that PDF: " + e.message;
      errorMsg.classList.add("show");
      statusEl.textContent = "";
    }
    rotateBtn.disabled = false;
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var link = document.createElement("a");
    link.download = "rotated.pdf";
    link.href = resultUrl;
    link.click();
  });
})();
