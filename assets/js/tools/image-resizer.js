(function () {
  "use strict";
  var fileInput = document.getElementById("ir-file");
  if (!fileInput) return;

  var widthInput = document.getElementById("ir-width");
  var heightInput = document.getElementById("ir-height");
  var lockCheck = document.getElementById("ir-lock");
  var resizeBtn = document.getElementById("ir-resize");
  var downloadBtn = document.getElementById("ir-download");
  var errorMsg = document.getElementById("ir-error");
  var canvas = document.getElementById("ir-canvas");
  var ctx = canvas.getContext("2d");

  var img = null;
  var aspectRatio = 1;
  var resultUrl = null;

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    downloadBtn.disabled = true;

    var url = URL.createObjectURL(file);
    img = new Image();
    img.onload = function () {
      aspectRatio = img.naturalWidth / img.naturalHeight;
      widthInput.value = img.naturalWidth;
      heightInput.value = img.naturalHeight;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      resizeBtn.disabled = false;
      URL.revokeObjectURL(url);
    };
    img.onerror = function () {
      errorMsg.textContent = "Couldn't load that file as an image.";
      errorMsg.classList.add("show");
    };
    img.src = url;
  });

  widthInput.addEventListener("input", function () {
    if (lockCheck.checked && aspectRatio) {
      heightInput.value = Math.round(parseFloat(widthInput.value) / aspectRatio) || "";
    }
  });
  heightInput.addEventListener("input", function () {
    if (lockCheck.checked && aspectRatio) {
      widthInput.value = Math.round(parseFloat(heightInput.value) * aspectRatio) || "";
    }
  });

  resizeBtn.addEventListener("click", function () {
    if (!img) return;
    var w = parseInt(widthInput.value, 10);
    var h = parseInt(heightInput.value, 10);
    if (!w || !h || w < 1 || h < 1) {
      errorMsg.textContent = "Enter a valid width and height.";
      errorMsg.classList.add("show");
      return;
    }
    errorMsg.classList.remove("show");
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob(function (blob) {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(blob);
      downloadBtn.disabled = false;
    }, "image/png");
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var link = document.createElement("a");
    link.download = "resized.png";
    link.href = resultUrl;
    link.click();
  });
})();
