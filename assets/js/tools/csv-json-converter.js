(function () {
  "use strict";
  var directionSelect = document.getElementById("cj-direction");
  if (!directionSelect) return;
  var input = document.getElementById("cj-input");
  var inputLabel = document.getElementById("cj-input-label");
  var outputLabel = document.getElementById("cj-output-label");
  var convertBtn = document.getElementById("cj-convert");
  var errorMsg = document.getElementById("cj-error");
  var output = document.getElementById("cj-output");

  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = "";
        rows.push(row); row = [];
      } else {
        field += c;
      }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return !(r.length === 1 && r[0] === ""); });
  }

  function csvToJson(text) {
    var rows = parseCSV(text);
    if (rows.length === 0) return [];
    var headers = rows[0];
    return rows.slice(1).map(function (row) {
      var obj = {};
      headers.forEach(function (h, i) { obj[h] = row[i] !== undefined ? row[i] : ""; });
      return obj;
    });
  }

  function csvEscape(val) {
    var str = String(val === undefined || val === null ? "" : val);
    if (/[",\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
    return str;
  }

  function jsonToCsv(data) {
    if (!Array.isArray(data)) data = [data];
    var headerSet = [];
    data.forEach(function (row) {
      Object.keys(row).forEach(function (k) {
        if (headerSet.indexOf(k) === -1) headerSet.push(k);
      });
    });
    var lines = [headerSet.map(csvEscape).join(",")];
    data.forEach(function (row) {
      lines.push(headerSet.map(function (h) { return csvEscape(row[h]); }).join(","));
    });
    return lines.join("\n");
  }

  function updateLabels() {
    var toJson = directionSelect.value === "csv2json";
    inputLabel.textContent = toJson ? "CSV input" : "JSON input";
    outputLabel.textContent = toJson ? "JSON output" : "CSV output";
  }

  directionSelect.addEventListener("change", updateLabels);
  updateLabels();

  convertBtn.addEventListener("click", function () {
    errorMsg.classList.remove("show");
    try {
      if (directionSelect.value === "csv2json") {
        output.value = JSON.stringify(csvToJson(input.value), null, 2);
      } else {
        var parsed = JSON.parse(input.value);
        output.value = jsonToCsv(parsed);
      }
    } catch (e) {
      errorMsg.textContent = "Couldn't convert: " + e.message;
      errorMsg.classList.add("show");
      output.value = "";
    }
  });
})();
