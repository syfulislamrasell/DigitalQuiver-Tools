(function () {
  "use strict";
  var input = document.getElementById("tcc-input");
  if (!input) return;
  var output = document.getElementById("tcc-output");
  var buttons = document.querySelectorAll("[data-case]");

  function words(text) {
    return text
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(/[\s_-]+/)
      .filter(function (w) { return w.length > 0; });
  }

  var CONVERTERS = {
    upper: function (t) { return t.toUpperCase(); },
    lower: function (t) { return t.toLowerCase(); },
    title: function (t) {
      return t.replace(/\w\S*/g, function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      });
    },
    sentence: function (t) {
      var lower = t.toLowerCase();
      return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, function (c) { return c.toUpperCase(); });
    },
    camel: function (t) {
      var w = words(t).map(function (x) { return x.toLowerCase(); });
      return w.map(function (x, i) {
        return i === 0 ? x : x.charAt(0).toUpperCase() + x.slice(1);
      }).join("");
    },
    pascal: function (t) {
      var w = words(t).map(function (x) { return x.toLowerCase(); });
      return w.map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1); }).join("");
    },
    snake: function (t) {
      return words(t).map(function (x) { return x.toLowerCase(); }).join("_");
    },
    kebab: function (t) {
      return words(t).map(function (x) { return x.toLowerCase(); }).join("-");
    },
  };

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var fn = CONVERTERS[btn.getAttribute("data-case")];
      output.value = fn ? fn(input.value) : input.value;
    });
  });
})();
