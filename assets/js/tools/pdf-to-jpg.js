(function () {
  "use strict";
  var fileInput = document.getElementById("ptj-file");
  if (!fileInput) return;

  var statusEl = document.getElementById("ptj-status");
  var errorMsg = document.getElementById("ptj-error");
  var gallery = document.getElementById("ptj-gallery");
  var MAX_PAGES = 30;

  pdfjsLib.GlobalWorkerOptions.workerSrc = "../assets/js/vendor/pdf.worker.min.js";

  fileInput.addEventListener("change", async function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    gallery.innerHTML = "";
    statusEl.textContent = "Rendering pages...";

    try {
      var bytes = await file.arrayBuffer();
      var pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      var pageCount = Math.min(pdf.numPages, MAX_PAGES);

      for (var i = 1; i <= pageCount; i++) {
        var page = await pdf.getPage(i);
        var viewport = page.getViewport({ scale: 1.5 });
        var canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        var ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        var wrap = document.createElement("div");
        wrap.style.textAlign = "center";
        var thumb = canvas.cloneNode();
        thumb.getContext("2d").drawImage(canvas, 0, 0);
        thumb.style.width = "100%";
        thumb.style.border = "1px solid var(--border)";
        thumb.style.borderRadius = "8px";
        wrap.appendChild(thumb);

        var label = document.createElement("div");
        label.className = "hint";
        label.style.margin = "6px 0";
        label.textContent = "Page " + i;
        wrap.appendChild(label);

        var btn = document.createElement("button");
        btn.className = "btn btn-secondary btn-sm";
        btn.textContent = "Download";
        btn.addEventListener("click", function (c, pageNum) {
          return function () {
            c.toBlob(function (blob) {
              var link = document.createElement("a");
              link.download = "page-" + pageNum + ".jpg";
              link.href = URL.createObjectURL(blob);
              link.click();
            }, "image/jpeg", 0.92);
          };
        }(canvas, i));
        wrap.appendChild(btn);

        gallery.appendChild(wrap);
      }

      statusEl.textContent = pdf.numPages > MAX_PAGES
        ? "Showing the first " + MAX_PAGES + " of " + pdf.numPages + " pages."
        : "Rendered all " + pdf.numPages + " page(s).";
    } catch (e) {
      errorMsg.textContent = "Couldn't render that PDF: " + e.message;
      errorMsg.classList.add("show");
      statusEl.textContent = "";
    }
  });
})();
