(function () {
  "use strict";
  var fileInput = document.getElementById("icv-file");
  if (!fileInput) return;

  var formatSelect = document.getElementById("icv-format");
  var qualityWrap = document.getElementById("icv-quality-wrap");
  var qualitySlider = document.getElementById("icv-quality");
  var qualityVal = document.getElementById("icv-quality-val");
  var convertBtn = document.getElementById("icv-convert");
  var downloadBtn = document.getElementById("icv-download");
  var errorMsg = document.getElementById("icv-error");
  var canvas = document.getElementById("icv-canvas");
  var ctx = canvas.getContext("2d");

  var img = null;
  var resultUrl = null;

  function updateQualityVisibility() {
    qualityWrap.style.display = formatSelect.value === "image/png" ? "none" : "";
  }
  updateQualityVisibility();
  formatSelect.addEventListener("change", updateQualityVisibility);

  qualitySlider.addEventListener("input", function () {
    qualityVal.textContent = qualitySlider.value;
  });

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    downloadBtn.disabled = true;

    var url = URL.createObjectURL(file);
    img = new Image();
    img.onload = function () {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      convertBtn.disabled = false;
      URL.revokeObjectURL(url);
    };
    img.onerror = function () {
      errorMsg.textContent = "Couldn't load that file as an image.";
      errorMsg.classList.add("show");
    };
    img.src = url;
  });

  convertBtn.addEventListener("click", function () {
    if (!img) return;
    var quality = parseInt(qualitySlider.value, 10) / 100;
    canvas.toBlob(function (blob) {
      if (!blob) {
        errorMsg.textContent = "Conversion failed for that format.";
        errorMsg.classList.add("show");
        return;
      }
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(blob);
      downloadBtn.disabled = false;
    }, formatSelect.value, quality);
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl) return;
    var ext = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[formatSelect.value];
    var link = document.createElement("a");
    link.download = "converted." + ext;
    link.href = resultUrl;
    link.click();
  });
})();
