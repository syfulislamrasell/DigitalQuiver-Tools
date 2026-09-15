(function () {
  "use strict";
  var fileInput = document.getElementById("crp-file");
  if (!fileInput) return;

  var aspectSelect = document.getElementById("crp-aspect");
  var downloadBtn = document.getElementById("crp-download");
  var errorMsg = document.getElementById("crp-error");
  var hint = document.getElementById("crp-hint");
  var stage = document.getElementById("crp-stage");
  var canvas = document.getElementById("crp-canvas");
  var ctx = canvas.getContext("2d");
  var box = document.getElementById("crp-box");

  var img = null;
  // box position/size in displayed (CSS) pixels, relative to the stage
  var boxRect = { x: 0, y: 0, w: 100, h: 100 };
  var drag = null; // { mode: "move"|"nw"|"ne"|"sw"|"se", startX, startY, start: {...boxRect} }

  function aspectRatio() {
    var v = aspectSelect.value;
    if (v === "free") return null;
    var parts = v.split(":");
    return parseInt(parts[0], 10) / parseInt(parts[1], 10);
  }

  function displaySize() {
    var r = canvas.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function clampBox() {
    var d = displaySize();
    boxRect.w = Math.max(20, Math.min(boxRect.w, d.w));
    boxRect.h = Math.max(20, Math.min(boxRect.h, d.h));
    boxRect.x = Math.max(0, Math.min(boxRect.x, d.w - boxRect.w));
    boxRect.y = Math.max(0, Math.min(boxRect.y, d.h - boxRect.h));
  }

  function renderBox() {
    box.style.left = boxRect.x + "px";
    box.style.top = boxRect.y + "px";
    box.style.width = boxRect.w + "px";
    box.style.height = boxRect.h + "px";
  }

  function resetBox() {
    var d = displaySize();
    var ratio = aspectRatio();
    var w = d.w * 0.6;
    var h = ratio ? w / ratio : d.h * 0.6;
    if (h > d.h * 0.9) { h = d.h * 0.9; w = ratio ? h * ratio : w; }
    boxRect = { x: (d.w - w) / 2, y: (d.h - h) / 2, w: w, h: h };
    clampBox();
    renderBox();
  }

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    var url = URL.createObjectURL(file);
    img = new Image();
    img.onload = function () {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      box.style.display = "block";
      hint.style.display = "block";
      downloadBtn.disabled = false;
      URL.revokeObjectURL(url);
      requestAnimationFrame(resetBox);
    };
    img.onerror = function () {
      errorMsg.textContent = "Could not read this file as an image.";
      errorMsg.classList.add("show");
    };
    img.src = url;
  });

  aspectSelect.addEventListener("change", function () {
    if (img) resetBox();
  });

  function pointerDown(mode) {
    return function (e) {
      e.preventDefault();
      drag = {
        mode: mode,
        startX: e.clientX,
        startY: e.clientY,
        start: { x: boxRect.x, y: boxRect.y, w: boxRect.w, h: boxRect.h },
      };
      document.addEventListener("pointermove", pointerMove);
      document.addEventListener("pointerup", pointerUp);
    };
  }

  function pointerMove(e) {
    if (!drag) return;
    var dx = e.clientX - drag.startX;
    var dy = e.clientY - drag.startY;
    var d = displaySize();
    var ratio = aspectRatio();

    if (drag.mode === "move") {
      boxRect.x = drag.start.x + dx;
      boxRect.y = drag.start.y + dy;
    } else {
      var nx = drag.start.x, ny = drag.start.y, nw = drag.start.w, nh = drag.start.h;
      if (drag.mode === "se") {
        nw = drag.start.w + dx;
        nh = ratio ? nw / ratio : drag.start.h + dy;
      } else if (drag.mode === "sw") {
        nw = drag.start.w - dx;
        nx = drag.start.x + dx;
        nh = ratio ? nw / ratio : drag.start.h + dy;
      } else if (drag.mode === "ne") {
        nw = drag.start.w + dx;
        nh = ratio ? nw / ratio : drag.start.h - dy;
        ny = ratio ? drag.start.y + (drag.start.h - nh) : drag.start.y + dy;
      } else if (drag.mode === "nw") {
        nw = drag.start.w - dx;
        nx = drag.start.x + dx;
        nh = ratio ? nw / ratio : drag.start.h - dy;
        ny = ratio ? drag.start.y + (drag.start.h - nh) : drag.start.y + dy;
      }
      boxRect.x = nx; boxRect.y = ny; boxRect.w = nw; boxRect.h = nh;
    }

    boxRect.w = Math.max(20, boxRect.w);
    boxRect.h = Math.max(20, boxRect.h);
    boxRect.x = Math.max(0, Math.min(boxRect.x, d.w - boxRect.w));
    boxRect.y = Math.max(0, Math.min(boxRect.y, d.h - boxRect.h));
    renderBox();
  }

  function pointerUp() {
    drag = null;
    document.removeEventListener("pointermove", pointerMove);
    document.removeEventListener("pointerup", pointerUp);
  }

  box.addEventListener("pointerdown", function (e) {
    if (e.target.classList.contains("crp-handle")) return;
    pointerDown("move")(e);
  });
  Array.prototype.forEach.call(box.querySelectorAll(".crp-handle"), function (handle) {
    handle.addEventListener("pointerdown", function (e) {
      e.stopPropagation();
      pointerDown(handle.getAttribute("data-h"))(e);
    });
  });

  downloadBtn.addEventListener("click", function () {
    if (!img) return;
    var d = displaySize();
    var scale = canvas.width / d.w;
    var sx = boxRect.x * scale;
    var sy = boxRect.y * scale;
    var sw = boxRect.w * scale;
    var sh = boxRect.h * scale;

    var out = document.createElement("canvas");
    out.width = Math.round(sw);
    out.height = Math.round(sh);
    out.getContext("2d").drawImage(canvas, sx, sy, sw, sh, 0, 0, out.width, out.height);

    var link = document.createElement("a");
    link.download = "cropped.png";
    link.href = out.toDataURL("image/png");
    link.click();
  });

  window.addEventListener("resize", function () {
    if (img) { clampBox(); renderBox(); }
  });
})();
