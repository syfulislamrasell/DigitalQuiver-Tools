(function () {
  "use strict";
  var ipInput = document.getElementById("il-ip");
  if (!ipInput) return;
  var lookupBtn = document.getElementById("il-lookup");
  var errorMsg = document.getElementById("il-error");
  var table = document.getElementById("il-table");
  var resultsBody = document.getElementById("il-results");

  var FIELDS = [
    ["ip", "IP address"],
    ["city", "City"],
    ["region", "Region"],
    ["country_name", "Country"],
    ["postal", "Postal code"],
    ["org", "Organization / ISP"],
    ["latitude", "Latitude"],
    ["longitude", "Longitude"],
    ["timezone", "Timezone"],
  ];

  function doLookup() {
    var ip = ipInput.value.trim();
    errorMsg.classList.remove("show");
    table.style.display = "none";
    resultsBody.innerHTML = "";

    lookupBtn.disabled = true;
    lookupBtn.textContent = "Looking up…";

    var url = ip ? "https://ipapi.co/" + encodeURIComponent(ip) + "/json/" : "https://ipapi.co/json/";

    fetch(url)
      .then(function (resp) {
        if (!resp.ok) throw new Error("Lookup service returned an error.");
        return resp.json();
      })
      .then(function (data) {
        if (data.error) {
          errorMsg.textContent = data.reason || "That doesn't look like a valid IP address.";
          errorMsg.classList.add("show");
          return;
        }
        FIELDS.forEach(function (f) {
          var val = data[f[0]];
          if (val === undefined || val === null || val === "") return;
          var tr = document.createElement("tr");
          var th = document.createElement("td");
          th.style.fontWeight = "600";
          th.textContent = f[1];
          var td = document.createElement("td");
          td.textContent = val;
          tr.appendChild(th);
          tr.appendChild(td);
          resultsBody.appendChild(tr);
        });
        table.style.display = "table";
      })
      .catch(function () {
        errorMsg.textContent = "Could not reach the IP lookup service. Check your connection and try again.";
        errorMsg.classList.add("show");
      })
      .finally(function () {
        lookupBtn.disabled = false;
        lookupBtn.textContent = "Lookup";
      });
  }

  lookupBtn.addEventListener("click", doLookup);
  ipInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") doLookup();
  });
})();
