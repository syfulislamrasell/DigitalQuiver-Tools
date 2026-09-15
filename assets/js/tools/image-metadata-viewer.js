(function () {
  "use strict";
  var fileInput = document.getElementById("imv-file");
  if (!fileInput) return;

  var errorMsg = document.getElementById("imv-error");
  var resultBox = document.getElementById("imv-result");
  var preview = document.getElementById("imv-preview");
  var tbody = document.getElementById("imv-table-body");
  var noExifMsg = document.getElementById("imv-no-exif");

  var TYPE_SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };

  var TAG_NAMES = {
    0x010F: "Camera Make",
    0x0110: "Camera Model",
    0x0112: "Orientation",
    0x0132: "File Modified Date",
    0x9003: "Date Taken",
    0x829A: "Exposure Time",
    0x829D: "Aperture (f-number)",
    0x8827: "ISO Speed",
    0x920A: "Focal Length",
  };

  var ORIENTATION_LABELS = {
    1: "Normal",
    2: "Flipped horizontally",
    3: "Rotated 180°",
    4: "Flipped vertically",
    5: "Rotated 90° CW + flipped",
    6: "Rotated 90° CW",
    7: "Rotated 270° CW + flipped",
    8: "Rotated 270° CW",
  };

  function readAscii(view, offset, length) {
    var chars = [];
    for (var i = 0; i < length; i++) {
      var c = view.getUint8(offset + i);
      if (c === 0) break;
      chars.push(String.fromCharCode(c));
    }
    return chars.join("");
  }

  function readIFD(view, tiffStart, ifdOffset, little, out) {
    var count = view.getUint16(tiffStart + ifdOffset, little);
    var entryBase = tiffStart + ifdOffset + 2;
    var exifSubOffset = null;
    var gpsSubOffset = null;

    for (var i = 0; i < count; i++) {
      var entryOffset = entryBase + i * 12;
      var tag = view.getUint16(entryOffset, little);
      var type = view.getUint16(entryOffset + 2, little);
      var numValues = view.getUint32(entryOffset + 4, little);
      var valueOffset = entryOffset + 8;
      var size = (TYPE_SIZE[type] || 1) * numValues;
      var dataStart = size > 4 ? tiffStart + view.getUint32(valueOffset, little) : valueOffset;

      if (tag === 0x8769) { exifSubOffset = view.getUint32(valueOffset, little); continue; }
      if (tag === 0x8825) { gpsSubOffset = view.getUint32(valueOffset, little); continue; }

      var name = TAG_NAMES[tag];
      if (!name) continue;

      var value = null;
      if (type === 2) {
        value = readAscii(view, dataStart, numValues).trim();
      } else if (type === 3) {
        value = view.getUint16(dataStart, little);
      } else if (type === 4) {
        value = view.getUint32(dataStart, little);
      } else if (type === 5 || type === 10) {
        var num = type === 5 ? view.getUint32(dataStart, little) : view.getInt32(dataStart, little);
        var den = type === 5 ? view.getUint32(dataStart + 4, little) : view.getInt32(dataStart + 4, little);
        value = den ? num / den : 0;
      }
      if (value === null || value === "") continue;

      if (tag === 0x0112) value = ORIENTATION_LABELS[value] || value;
      if (tag === 0x829A) value = value + " sec";
      if (tag === 0x829D) value = "f/" + Math.round(value * 10) / 10;
      if (tag === 0x920A) value = Math.round(value * 10) / 10 + " mm";

      out.push({ label: name, value: value });
    }
    return { exifSubOffset: exifSubOffset, gpsSubOffset: gpsSubOffset };
  }

  function parseExif(arrayBuffer, out) {
    var view = new DataView(arrayBuffer);
    if (view.byteLength < 4 || view.getUint16(0) !== 0xFFD8) return false;

    var offset = 2;
    while (offset < view.byteLength - 4) {
      var marker = view.getUint16(offset);
      if ((marker & 0xFF00) !== 0xFF00) break;
      var segLength = view.getUint16(offset + 2);
      if (marker === 0xFFE1) {
        var segStart = offset + 4;
        var exifHeader = readAscii(view, segStart, 6);
        if (exifHeader === "Exif") {
          var tiffStart = segStart + 6;
          var little = view.getUint16(tiffStart) === 0x4949;
          var firstIFDOffset = view.getUint32(tiffStart + 4, little);
          var refs = readIFD(view, tiffStart, firstIFDOffset, little, out);
          if (refs.exifSubOffset) readIFD(view, tiffStart, refs.exifSubOffset, little, out);
          return out.length > 0;
        }
      }
      if (marker === 0xFFDA) break; // start of scan, no more metadata markers
      offset += 2 + segLength;
    }
    return false;
  }

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorMsg.classList.remove("show");
    resultBox.style.display = "none";
    tbody.innerHTML = "";

    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      var rows = [
        { label: "File name", value: file.name },
        { label: "File type", value: file.type || "Unknown" },
        { label: "File size", value: window.DQFormatBytes ? window.DQFormatBytes(file.size) : file.size + " bytes" },
        { label: "Dimensions", value: img.naturalWidth + " × " + img.naturalHeight + " px" },
      ];

      var reader = new FileReader();
      reader.onload = function () {
        var exifRows = [];
        try {
          parseExif(reader.result, exifRows);
        } catch (e) {
          exifRows = [];
        }
        rows = rows.concat(exifRows);
        rows.forEach(function (row) {
          var tr = document.createElement("tr");
          var th = document.createElement("td");
          th.textContent = row.label;
          var td = document.createElement("td");
          td.textContent = row.value;
          tr.appendChild(th);
          tr.appendChild(td);
          tbody.appendChild(tr);
        });
        noExifMsg.style.display = exifRows.length === 0 ? "block" : "none";
        preview.src = url;
        resultBox.style.display = "block";
      };
      reader.readAsArrayBuffer(file);
    };
    img.onerror = function () {
      errorMsg.textContent = "Could not read this file as an image.";
      errorMsg.classList.add("show");
    };
    img.src = url;
  });
})();
