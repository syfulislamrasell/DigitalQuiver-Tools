(function () {
  "use strict";
  var fileInput = document.getElementById("ps-file");
  if (!fileInput) return;

  var pageCountEl = document.getElementById("ps-pagecount");
  var startInput = document.getElementById("ps-start");
  var endInput = document.getElementById("ps-end");
  var extractBtn = document.getElementById("ps-extract");
  var downloadBtn = document.getElementById("ps-download");
  var errorMsg = document.getElementById("ps-error");
  var statusEl = document.getElementById("ps-status");

  var srcBytes = null;
  var pageCount = 0;
  var resultUrl = null;

  fileInput.addEventListener("change", async function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    downloadBtn.disabled = true;
    extractBtn.disabled = true;
    statusEl.textContent = "Reading PDF...";
    try {
      srcBytes = await file.arrayBuffer();
      var doc = await PDFLib.PDFDocument.load(srcBytes);
      pageCount = doc.getPageCount();
      pageCountEl.textContent = "This PDF has " + pageCount + " page" + (pageCount === 1 ? "" : "s") + ".";
      startInput.max = pageCount;
      endInput.max = pageCount;
      startInput.value = 1;
      endInput.value = pageCount;
      extractBtn.disabled = false;
      statusEl.textContent = "";
    } catch (e) {
      errorMsg.textContent = "Couldn't read that PDF: " + e.message;
      errorMsg.classList.add("show");
      pageCountEl.textContent = "";
      statusEl.textContent = "";
    }
  });

  extractBtn.addEventListener("click", async function () {
    var start = parseInt(startInput.value, 10);
    var end = parseInt(endInput.value, 10);
    if (!start || !end || start < 1 || end > pageCount || start > end) {
      errorMsg.textContent = "Enter a valid page range between 1 and " + pageCount + ".";
      errorMsg.classList.add("show");
      return;
    }
    errorMsg.classList.remove("show");
    statusEl.textContent = "Extracting...";
    extractBtn.disabled = true;
    try {
      var srcDoc = await PDFLib.PDFDocument.load(srcBytes);
      var newDoc = await PDFLib.PDFDocument.create();
      var indices = [];
      for (var i = start - 1; i <= end - 1; i++) indices.push(i);
      var pages = await newDoc.copyPages(srcDoc, indices);
      pages.forEach(function (p) { newDoc.addPage(p); });
      var newBytes = await newDoc.save();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(new Blob([newBytes], { type: "application/pdf" }));
      downloadBtn.disabled = false;
      statusEl.textContent = "Extracted pages " + start + "–" + end + " (" + indices.length + " page" + (indices.length === 1 ? "" : "s") + ").";
    } catch (e) {
      errorMsg.textContent = "Couldn't extract those pages: " + e.message;
      errorMsg.classList.add("show");
      statusEl.textContent = "";
    }
    extractBtn.disabled = false;
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var link = document.createElement("a");
    link.download = "extracted.pdf";
    link.href = resultUrl;
    link.click();
  });
})();
