(function () {
  "use strict";
  var fileInput = document.getElementById("cmb-files");
  if (!fileInput) return;

  var directionSelect = document.getElementById("cmb-direction");
  var gapSlider = document.getElementById("cmb-gap");
  var gapVal = document.getElementById("cmb-gap-val");
  var downloadBtn = document.getElementById("cmb-download");
  var errorMsg = document.getElementById("cmb-error");
  var canvas = document.getElementById("cmb-canvas");
  var ctx = canvas.getContext("2d");

  var images = [];

  function loadImages(files) {
    var promises = Array.prototype.map.call(files, function (file) {
      return new Promise(function (resolve, reject) {
        var url = URL.createObjectURL(file);
        var img = new Image();
        img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = function () { URL.revokeObjectURL(url); reject(); };
        img.src = url;
      });
    });
    return Promise.all(promises);
  }

  function draw() {
    if (images.length < 1) return;
    var gap = parseInt(gapSlider.value, 10);
    var isRow = directionSelect.value === "row";

    if (isRow) {
      var commonH = Math.min.apply(null, images.map(function (i) { return i.naturalHeight; }));
      var widths = images.map(function (i) { return (i.naturalWidth / i.naturalHeight) * commonH; });
      var totalW = widths.reduce(function (a, b) { return a + b; }, 0) + gap * (images.length - 1);
      canvas.width = Math.round(totalW);
      canvas.height = Math.round(commonH);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var x = 0;
      images.forEach(function (img, i) {
        ctx.drawImage(img, x, 0, widths[i], commonH);
        x += widths[i] + gap;
      });
    } else {
      var commonW = Math.min.apply(null, images.map(function (i) { return i.naturalWidth; }));
      var heights = images.map(function (i) { return (i.naturalHeight / i.naturalWidth) * commonW; });
      var totalH = heights.reduce(function (a, b) { return a + b; }, 0) + gap * (images.length - 1);
      canvas.width = Math.round(commonW);
      canvas.height = Math.round(totalH);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var y = 0;
      images.forEach(function (img, i) {
        ctx.drawImage(img, 0, y, commonW, heights[i]);
        y += heights[i] + gap;
      });
    }
  }

  fileInput.addEventListener("change", function () {
    var files = fileInput.files;
    if (!files || files.length < 1) return;
    errorMsg.classList.remove("show");
    if (files.length < 2) {
      errorMsg.textContent = "Choose at least two images to combine.";
      errorMsg.classList.add("show");
      downloadBtn.disabled = true;
      return;
    }
    loadImages(files).then(function (imgs) {
      images = imgs;
      draw();
      downloadBtn.disabled = false;
    }).catch(function () {
      errorMsg.textContent = "Could not read one of the chosen files as an image.";
      errorMsg.classList.add("show");
    });
  });

  directionSelect.addEventListener("change", draw);
  gapSlider.addEventListener("input", function () {
    gapVal.textContent = gapSlider.value;
    draw();
  });

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "combined.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
