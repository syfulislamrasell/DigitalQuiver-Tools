(function () {
  "use strict";
  var domainInput = document.getElementById("dl-domain");
  if (!domainInput) return;
  var typeSelect = document.getElementById("dl-type");
  var lookupBtn = document.getElementById("dl-lookup");
  var errorMsg = document.getElementById("dl-error");
  var table = document.getElementById("dl-table");
  var resultsBody = document.getElementById("dl-results");

  var TYPE_NUM_TO_NAME = {
    1: "A", 2: "NS", 5: "CNAME", 15: "MX", 16: "TXT", 28: "AAAA",
  };

  function doLookup() {
    var domain = domainInput.value.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
    errorMsg.classList.remove("show");
    table.style.display = "none";
    resultsBody.innerHTML = "";

    if (!domain) {
      errorMsg.textContent = "Enter a domain name first.";
      errorMsg.classList.add("show");
      return;
    }

    lookupBtn.disabled = true;
    lookupBtn.textContent = "Looking up…";

    var url = "https://dns.google/resolve?name=" + encodeURIComponent(domain) + "&type=" + encodeURIComponent(typeSelect.value);

    fetch(url)
      .then(function (resp) {
        if (!resp.ok) throw new Error("Lookup service returned an error.");
        return resp.json();
      })
      .then(function (data) {
        if (data.Status !== 0) {
          errorMsg.textContent = "No records found, or the domain doesn't resolve (status code " + data.Status + ").";
          errorMsg.classList.add("show");
          return;
        }
        var answers = data.Answer || [];
        if (answers.length === 0) {
          errorMsg.textContent = "No " + typeSelect.value + " records found for this domain.";
          errorMsg.classList.add("show");
          return;
        }
        answers.forEach(function (a) {
          var tr = document.createElement("tr");
          [a.name, TYPE_NUM_TO_NAME[a.type] || a.type, a.TTL, a.data].forEach(function (val) {
            var td = document.createElement("td");
            td.textContent = val;
            tr.appendChild(td);
          });
          resultsBody.appendChild(tr);
        });
        table.style.display = "table";
      })
      .catch(function () {
        errorMsg.textContent = "Could not reach the DNS lookup service. Check your connection and try again.";
        errorMsg.classList.add("show");
      })
      .finally(function () {
        lookupBtn.disabled = false;
        lookupBtn.textContent = "Lookup";
      });
  }

  lookupBtn.addEventListener("click", doLookup);
  domainInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") doLookup();
  });
})();
