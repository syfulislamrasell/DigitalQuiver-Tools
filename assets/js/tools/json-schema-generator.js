(function () {
  "use strict";
  var input = document.getElementById("jsg-input");
  if (!input) return;
  var generateBtn = document.getElementById("jsg-generate");
  var errorMsg = document.getElementById("jsg-error");
  var output = document.getElementById("jsg-output");

  function inferSchema(value) {
    if (value === null) return { type: "null" };
    if (Array.isArray(value)) {
      var schema = { type: "array" };
      if (value.length > 0) schema.items = inferSchema(value[0]);
      return schema;
    }
    var t = typeof value;
    if (t === "object") {
      var properties = {};
      var required = [];
      Object.keys(value).forEach(function (key) {
        properties[key] = inferSchema(value[key]);
        required.push(key);
      });
      return { type: "object", properties: properties, required: required };
    }
    if (t === "number") return { type: Number.isInteger(value) ? "integer" : "number" };
    if (t === "boolean") return { type: "boolean" };
    return { type: "string" };
  }

  generateBtn.addEventListener("click", function () {
    errorMsg.classList.remove("show");
    var parsed;
    try {
      parsed = JSON.parse(input.value);
    } catch (e) {
      errorMsg.textContent = "That isn't valid JSON: " + e.message;
      errorMsg.classList.add("show");
      output.value = "";
      return;
    }
    var schema = Object.assign(
      { "$schema": "http://json-schema.org/draft-07/schema#" },
      inferSchema(parsed)
    );
    output.value = JSON.stringify(schema, null, 2);
  });
})();
