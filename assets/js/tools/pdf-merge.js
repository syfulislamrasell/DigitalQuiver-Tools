(function () {
  "use strict";
  var fileInput = document.getElementById("pm-files");
  if (!fileInput) return;

  var fileList = document.getElementById("pm-filelist");
  var mergeBtn = document.getElementById("pm-merge");
  var downloadBtn = document.getElementById("pm-download");
  var errorMsg = document.getElementById("pm-error");
  var statusEl = document.getElementById("pm-status");

  var files = [];
  var resultUrl = null;

  fileInput.addEventListener("change", function () {
    files = Array.prototype.slice.call(fileInput.files);
    fileList.innerHTML = files.map(function (f) { return "<li>" + f.name + "</li>"; }).join("");
    mergeBtn.disabled = files.length < 2;
    downloadBtn.disabled = true;
    errorMsg.classList.remove("show");
    statusEl.textContent = files.length === 1 ? "Choose at least one more PDF to merge." : "";
  });

  mergeBtn.addEventListener("click", async function () {
    errorMsg.classList.remove("show");
    statusEl.textContent = "Merging...";
    mergeBtn.disabled = true;
    try {
      var mergedDoc = await PDFLib.PDFDocument.create();
      for (var i = 0; i < files.length; i++) {
        var bytes = await files[i].arrayBuffer();
        var srcDoc = await PDFLib.PDFDocument.load(bytes);
        var pages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        pages.forEach(function (p) { mergedDoc.addPage(p); });
      }
      var mergedBytes = await mergedDoc.save();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(new Blob([mergedBytes], { type: "application/pdf" }));
      downloadBtn.disabled = false;
      statusEl.textContent = "Merged " + files.length + " files into one " + mergedDoc.getPageCount() + "-page PDF.";
    } catch (e) {
      errorMsg.textContent = "Couldn't merge these files: " + e.message;
      errorMsg.classList.add("show");
      statusEl.textContent = "";
    }
    mergeBtn.disabled = false;
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var link = document.createElement("a");
    link.download = "merged.pdf";
    link.href = resultUrl;
    link.click();
  });
})();
