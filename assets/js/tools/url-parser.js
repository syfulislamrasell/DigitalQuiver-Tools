(function () {
  "use strict";
  var input = document.getElementById("up-input");
  if (!input) return;

  var errorMsg = document.getElementById("up-error");
  var resultBox = document.getElementById("up-result");
  var partsBody = document.getElementById("up-parts");
  var queryWrap = document.getElementById("up-query-wrap");
  var queryBody = document.getElementById("up-query");

  function addRow(tbody, a, b) {
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.textContent = a;
    var td2 = document.createElement("td");
    td2.textContent = b || "(none)";
    tr.appendChild(td1);
    tr.appendChild(td2);
    tbody.appendChild(tr);
  }

  function parse() {
    var value = input.value.trim();
    errorMsg.classList.remove("show");
    if (!value) {
      resultBox.style.display = "none";
      return;
    }
    var url;
    try {
      url = new URL(value);
    } catch (e) {
      resultBox.style.display = "none";
      errorMsg.textContent = "That doesn't look like a valid, fully-qualified URL (it needs a protocol, e.g. https://).";
      errorMsg.classList.add("show");
      return;
    }

    partsBody.innerHTML = "";
    addRow(partsBody, "Protocol", url.protocol);
    addRow(partsBody, "Host", url.host);
    addRow(partsBody, "Hostname", url.hostname);
    addRow(partsBody, "Port", url.port);
    addRow(partsBody, "Pathname", url.pathname);
    addRow(partsBody, "Search (query string)", url.search);
    addRow(partsBody, "Hash", url.hash);
    addRow(partsBody, "Origin", url.origin);

    queryBody.innerHTML = "";
    var hasParams = false;
    url.searchParams.forEach(function (val, key) {
      hasParams = true;
      addRow(queryBody, key, val);
    });
    queryWrap.style.display = hasParams ? "block" : "none";

    resultBox.style.display = "block";
  }

  input.addEventListener("input", parse);
})();
