(function () {
  "use strict";
  var fileInput = document.getElementById("pc-file");
  if (!fileInput) return;

  var compressBtn = document.getElementById("pc-compress");
  var downloadBtn = document.getElementById("pc-download");
  var errorMsg = document.getElementById("pc-error");
  var originalSizeEl = document.getElementById("pc-original-size");
  var newSizeEl = document.getElementById("pc-new-size");
  var savingsEl = document.getElementById("pc-savings");

  var srcBytes = null;
  var originalSize = 0;
  var resultUrl = null;

  fileInput.addEventListener("change", async function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    downloadBtn.disabled = true;
    newSizeEl.textContent = "—";
    savingsEl.textContent = "—";
    originalSize = file.size;
    originalSizeEl.textContent = window.DQFormatBytes(originalSize);
    srcBytes = await file.arrayBuffer();
    compressBtn.disabled = false;
  });

  compressBtn.addEventListener("click", async function () {
    if (!srcBytes) return;
    errorMsg.classList.remove("show");
    compressBtn.disabled = true;
    try {
      var srcDoc = await PDFLib.PDFDocument.load(srcBytes);
      var newDoc = await PDFLib.PDFDocument.create();
      var pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      pages.forEach(function (p) { newDoc.addPage(p); });
      var newBytes = await newDoc.save({ useObjectStreams: true });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(new Blob([newBytes], { type: "application/pdf" }));
      newSizeEl.textContent = window.DQFormatBytes(newBytes.length);
      var reduction = originalSize > 0 ? Math.round((1 - newBytes.length / originalSize) * 100) : 0;
      savingsEl.textContent = (reduction >= 0 ? reduction : 0) + "%";
      downloadBtn.disabled = false;
    } catch (e) {
      errorMsg.textContent = "Couldn't optimize that PDF: " + e.message;
      errorMsg.classList.add("show");
    }
    compressBtn.disabled = false;
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var link = document.createElement("a");
    link.download = "optimized.pdf";
    link.href = resultUrl;
    link.click();
  });
})();
