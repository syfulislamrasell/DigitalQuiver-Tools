(function () {
  "use strict";
  var fileInput = document.getElementById("jtp-files");
  if (!fileInput) return;

  var fileList = document.getElementById("jtp-filelist");
  var convertBtn = document.getElementById("jtp-convert");
  var downloadBtn = document.getElementById("jtp-download");
  var errorMsg = document.getElementById("jtp-error");
  var statusEl = document.getElementById("jtp-status");

  var files = [];
  var resultUrl = null;

  fileInput.addEventListener("change", function () {
    files = Array.prototype.slice.call(fileInput.files);
    fileList.innerHTML = files.map(function (f) { return "<li>" + f.name + "</li>"; }).join("");
    convertBtn.disabled = files.length === 0;
    downloadBtn.disabled = true;
    errorMsg.classList.remove("show");
    statusEl.textContent = "";
  });

  convertBtn.addEventListener("click", async function () {
    errorMsg.classList.remove("show");
    statusEl.textContent = "Converting...";
    convertBtn.disabled = true;
    try {
      var doc = await PDFLib.PDFDocument.create();
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var bytes = await file.arrayBuffer();
        var image = /png/i.test(file.type) ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        var page = doc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      var pdfBytes = await doc.save();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
      downloadBtn.disabled = false;
      statusEl.textContent = "Created a " + files.length + "-page PDF.";
    } catch (e) {
      errorMsg.textContent = "Couldn't convert those images: " + e.message;
      errorMsg.classList.add("show");
      statusEl.textContent = "";
    }
    convertBtn.disabled = false;
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var link = document.createElement("a");
    link.download = "images.pdf";
    link.href = resultUrl;
    link.click();
  });
})();
