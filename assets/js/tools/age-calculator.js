(function () {
  "use strict";
  var dobInput = document.getElementById("ag-dob");
  if (!dobInput) return;

  var asofInput = document.getElementById("ag-asof");
  var calcBtn = document.getElementById("ag-calc");
  var errorMsg = document.getElementById("ag-error");
  var results = document.getElementById("ag-results");

  var todayStr = new Date().toISOString().slice(0, 10);
  asofInput.value = todayStr;
  dobInput.max = todayStr;

  function calc() {
    var dob = new Date(dobInput.value + "T00:00:00");
    var asOf = new Date((asofInput.value || todayStr) + "T00:00:00");

    if (!dobInput.value || isNaN(dob.getTime()) || dob > asOf) {
      errorMsg.classList.add("show");
      results.style.display = "none";
      return;
    }
    errorMsg.classList.remove("show");

    var years = asOf.getFullYear() - dob.getFullYear();
    var months = asOf.getMonth() - dob.getMonth();
    var days = asOf.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      var prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    var msPerDay = 86400000;
    var totalDays = Math.round((asOf - dob) / msPerDay);

    var nextBirthday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday < asOf || (nextBirthday.getMonth() === asOf.getMonth() && nextBirthday.getDate() === asOf.getDate())) {
      if (nextBirthday < asOf) nextBirthday.setFullYear(asOf.getFullYear() + 1);
    }
    var daysToNext = Math.round((nextBirthday - asOf) / msPerDay);

    document.getElementById("ag-years").textContent = years;
    document.getElementById("ag-months").textContent = months;
    document.getElementById("ag-days").textContent = days;
    document.getElementById("ag-totaldays").textContent = totalDays.toLocaleString();
    document.getElementById("ag-totalweeks").textContent = Math.floor(totalDays / 7).toLocaleString();
    document.getElementById("ag-nextbday").textContent = daysToNext;
    results.style.display = "";
  }

  calcBtn.addEventListener("click", calc);
  dobInput.addEventListener("change", calc);
  asofInput.addEventListener("change", calc);
})();
