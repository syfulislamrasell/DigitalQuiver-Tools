(function () {
  "use strict";
  var fileInput = document.getElementById("rbg-file");
  if (!fileInput) return;

  var statusEl = document.getElementById("rbg-status");
  var errorMsg = document.getElementById("rbg-error");
  var downloadBtn = document.getElementById("rbg-download");
  var canvas = document.getElementById("rbg-canvas");
  var ctx = canvas.getContext("2d");

  var segmenterPromise = null;

  function getSegmenter() {
    if (!segmenterPromise) {
      statusEl.textContent = "Loading the AI model (first time only, about 12MB)…";
      statusEl.style.display = "block";
      segmenterPromise = Vision.FilesetResolver.forVisionTasks(
        "../assets/js/vendor/mediapipe-wasm"
      ).then(function (fileset) {
        return Vision.ImageSegmenter.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: "../assets/js/vendor/mediapipe-selfie-segmenter.tflite" },
          runningMode: "IMAGE",
          outputCategoryMask: false,
          outputConfidenceMasks: true,
        });
      });
    }
    return segmenterPromise;
  }

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    downloadBtn.disabled = true;

    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      statusEl.textContent = "Removing the background…";
      statusEl.style.display = "block";

      getSegmenter().then(function (segmenter) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        var result = segmenter.segment(img);
        // A single confidence mask is returned for this binary (person vs
        // background) model; each value is the model's confidence (0-1)
        // that the pixel belongs to the person, verified empirically.
        var confidence = result.confidenceMasks[0].getAsFloat32Array();

        var frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < confidence.length; i++) {
          frame.data[i * 4 + 3] = Math.round(confidence[i] * 255);
        }
        ctx.putImageData(frame, 0, 0);
        if (result.close) result.close();

        statusEl.style.display = "none";
        downloadBtn.disabled = false;
        URL.revokeObjectURL(url);
      }).catch(function () {
        statusEl.style.display = "none";
        errorMsg.textContent = "Could not process this image. Please try a different photo.";
        errorMsg.classList.add("show");
      });
    };
    img.onerror = function () {
      errorMsg.textContent = "Could not read this file as an image.";
      errorMsg.classList.add("show");
    };
    img.src = url;
  });

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "background-removed.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
