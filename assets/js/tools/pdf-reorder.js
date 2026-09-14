(function () {
  "use strict";
  var fileInput = document.getElementById("pro-file");
  if (!fileInput) return;

  var statusEl = document.getElementById("pro-status");
  var listEl = document.getElementById("pro-list");
  var applyBtn = document.getElementById("pro-apply");
  var downloadBtn = document.getElementById("pro-download");
  var errorMsg = document.getElementById("pro-error");

  var srcBytes = null;
  var order = []; // array of original 0-based page indices, in current display order
  var resultUrl = null;
  var dragIndex = null;

  function renderList() {
    listEl.innerHTML = order.map(function (origIndex, pos) {
      return '<li draggable="true" data-pos="' + pos + '" style="padding:10px 12px; margin-bottom:6px; background:var(--bg-elevated); border:1px solid var(--border); border-radius:9px; cursor:grab; display:flex; align-items:center; gap:10px;">' +
        '<span style="opacity:.5;">☰</span> Page ' + (origIndex + 1) + '</li>';
    }).join("");
  }

  listEl.addEventListener("dragstart", function (e) {
    var li = e.target.closest("li");
    if (!li) return;
    dragIndex = parseInt(li.getAttribute("data-pos"), 10);
    e.dataTransfer.effectAllowed = "move";
  });
  listEl.addEventListener("dragover", function (e) {
    e.preventDefault();
  });
  listEl.addEventListener("drop", function (e) {
    e.preventDefault();
    var li = e.target.closest("li");
    if (!li || dragIndex === null) return;
    var dropIndex = parseInt(li.getAttribute("data-pos"), 10);
    if (dropIndex === dragIndex) return;
    var moved = order.splice(dragIndex, 1)[0];
    order.splice(dropIndex, 0, moved);
    dragIndex = null;
    renderList();
  });

  fileInput.addEventListener("change", async function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    downloadBtn.disabled = true;
    try {
      srcBytes = await file.arrayBuffer();
      var doc = await PDFLib.PDFDocument.load(srcBytes);
      var count = doc.getPageCount();
      order = Array.from({ length: count }, function (_, i) { return i; });
      renderList();
      statusEl.textContent = "Drag pages to reorder them, then click Apply New Order.";
      applyBtn.disabled = false;
    } catch (e) {
      errorMsg.textContent = "Couldn't read that PDF: " + e.message;
      errorMsg.classList.add("show");
    }
  });

  applyBtn.addEventListener("click", async function () {
    errorMsg.classList.remove("show");
    applyBtn.disabled = true;
    try {
      var srcDoc = await PDFLib.PDFDocument.load(srcBytes);
      var newDoc = await PDFLib.PDFDocument.create();
      var pages = await newDoc.copyPages(srcDoc, order);
      pages.forEach(function (p) { newDoc.addPage(p); });
      var newBytes = await newDoc.save();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(new Blob([newBytes], { type: "application/pdf" }));
      downloadBtn.disabled = false;
      statusEl.textContent = "New order applied. Ready to download.";
    } catch (e) {
      errorMsg.textContent = "Couldn't reorder that PDF: " + e.message;
      errorMsg.classList.add("show");
    }
    applyBtn.disabled = false;
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var link = document.createElement("a");
    link.download = "reordered.pdf";
    link.href = resultUrl;
    link.click();
  });
})();
