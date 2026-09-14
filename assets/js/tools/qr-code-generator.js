(function () {
  "use strict";
  var canvas = document.getElementById("qr-canvas");
  if (!canvas) return;

  var input = document.getElementById("qr-input");
  var eccSelect = document.getElementById("qr-ecc");
  var sizeSelect = document.getElementById("qr-size");
  var generateBtn = document.getElementById("qr-generate");
  var downloadBtn = document.getElementById("qr-download");
  var errorMsg = document.getElementById("qr-error");
  var ctx = canvas.getContext("2d");

  function draw() {
    var text = input.value;
    if (!text.trim()) {
      errorMsg.textContent = "Please enter some text first.";
      errorMsg.classList.add("show");
      return false;
    }
    try {
      var qr = qrcode(0, eccSelect.value);
      qr.addData(text);
      qr.make();
    } catch (e) {
      errorMsg.textContent = "That text is too long to fit in a QR code. Try shortening it.";
      errorMsg.classList.add("show");
      return false;
    }
    errorMsg.classList.remove("show");

    var moduleCount = qr.getModuleCount();
    var targetSize = parseInt(sizeSelect.value, 10);
    var cell = Math.max(1, Math.floor(targetSize / moduleCount));
    var size = cell * moduleCount;

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";
    for (var row = 0; row < moduleCount; row++) {
      for (var col = 0; col < moduleCount; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(col * cell, row * cell, cell, cell);
        }
      }
    }
    return true;
  }

  generateBtn.addEventListener("click", draw);
  downloadBtn.addEventListener("click", function () {
    if (!draw()) return;
    var link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  draw();
})();
