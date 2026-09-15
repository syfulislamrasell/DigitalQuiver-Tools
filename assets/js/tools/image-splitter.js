(function () {
  "use strict";
  var fileInput = document.getElementById("isp-file");
  if (!fileInput) return;

  var colsInput = document.getElementById("isp-cols");
  var rowsInput = document.getElementById("isp-rows");
  var splitBtn = document.getElementById("isp-split");
  var errorMsg = document.getElementById("isp-error");
  var grid = document.getElementById("isp-grid");

  var img = null;

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    grid.innerHTML = "";
    var url = URL.createObjectURL(file);
    img = new Image();
    img.onload = function () {
      splitBtn.disabled = false;
      URL.revokeObjectURL(url);
    };
    img.onerror = function () {
      errorMsg.textContent = "Could not read this file as an image.";
      errorMsg.classList.add("show");
    };
    img.src = url;
  });

  splitBtn.addEventListener("click", function () {
    if (!img) return;
    var cols = Math.max(1, Math.min(10, parseInt(colsInput.value, 10) || 1));
    var rows = Math.max(1, Math.min(10, parseInt(rowsInput.value, 10) || 1));
    grid.innerHTML = "";

    var pieceW = img.naturalWidth / cols;
    var pieceH = img.naturalHeight / rows;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var pieceCanvas = document.createElement("canvas");
        pieceCanvas.width = Math.round(pieceW);
        pieceCanvas.height = Math.round(pieceH);
        var pctx = pieceCanvas.getContext("2d");
        pctx.drawImage(
          img,
          c * pieceW, r * pieceH, pieceW, pieceH,
          0, 0, pieceCanvas.width, pieceCanvas.height
        );

        var card = document.createElement("div");
        card.className = "tool-card";
        card.style.textAlign = "center";

        var previewImg = document.createElement("img");
        previewImg.src = pieceCanvas.toDataURL("image/png");
        previewImg.style.maxWidth = "100%";
        previewImg.style.borderRadius = "8px";
        previewImg.alt = "Split piece row " + (r + 1) + " column " + (c + 1);

        var link = document.createElement("a");
        link.href = previewImg.src;
        link.download = "piece-" + (r + 1) + "-" + (c + 1) + ".png";
        link.className = "btn btn-secondary btn-sm";
        link.style.display = "block";
        link.style.marginTop = "8px";
        link.textContent = "Download";

        card.appendChild(previewImg);
        card.appendChild(link);
        grid.appendChild(card);
      }
    }
  });
})();
