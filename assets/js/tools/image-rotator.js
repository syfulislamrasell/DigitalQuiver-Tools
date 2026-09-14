(function () {
  "use strict";
  var fileInput = document.getElementById("irt-file");
  if (!fileInput) return;

  var leftBtn = document.getElementById("irt-left");
  var rightBtn = document.getElementById("irt-right");
  var flipHBtn = document.getElementById("irt-flip-h");
  var flipVBtn = document.getElementById("irt-flip-v");
  var resetBtn = document.getElementById("irt-reset");
  var downloadBtn = document.getElementById("irt-download");
  var canvas = document.getElementById("irt-canvas");
  var ctx = canvas.getContext("2d");

  var img = null;
  var rotation = 0; // 0, 90, 180, 270
  var flipH = false;
  var flipV = false;

  function draw() {
    var swap = rotation === 90 || rotation === 270;
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    canvas.width = swap ? h : w;
    canvas.height = swap ? w : h;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    ctx.restore();
  }

  function enableButtons() {
    [leftBtn, rightBtn, flipHBtn, flipVBtn, resetBtn, downloadBtn].forEach(function (b) { b.disabled = false; });
  }

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    var url = URL.createObjectURL(file);
    img = new Image();
    img.onload = function () {
      rotation = 0;
      flipH = false;
      flipV = false;
      draw();
      enableButtons();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });

  leftBtn.addEventListener("click", function () { rotation = (rotation + 270) % 360; draw(); });
  rightBtn.addEventListener("click", function () { rotation = (rotation + 90) % 360; draw(); });
  flipHBtn.addEventListener("click", function () { flipH = !flipH; draw(); });
  flipVBtn.addEventListener("click", function () { flipV = !flipV; draw(); });
  resetBtn.addEventListener("click", function () { rotation = 0; flipH = false; flipV = false; draw(); });

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "rotated.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
