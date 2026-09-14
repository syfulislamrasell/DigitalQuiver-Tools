(function () {
  "use strict";
  var input = document.getElementById("xf-input");
  if (!input) return;

  var indentSelect = document.getElementById("xf-indent");
  var formatBtn = document.getElementById("xf-format");
  var clearBtn = document.getElementById("xf-clear");
  var output = document.getElementById("xf-output");
  var errorMsg = document.getElementById("xf-error");

  function indentStr() {
    return indentSelect.value === "tab" ? "\t" : " ".repeat(parseInt(indentSelect.value, 10));
  }

  function escapeText(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escapeAttr(text) {
    return escapeText(text).replace(/"/g, "&quot;");
  }

  function serializeElement(el, depth, pad) {
    var indent = pad.repeat(depth);
    var attrs = Array.prototype.map.call(el.attributes, function (a) {
      return " " + a.name + '="' + escapeAttr(a.value) + '"';
    }).join("");
    var children = Array.prototype.filter.call(el.childNodes, function (n) {
      return !(n.nodeType === 3 && n.textContent.trim() === "");
    });

    if (children.length === 0) {
      return indent + "<" + el.tagName + attrs + "/>";
    }
    if (children.length === 1 && children[0].nodeType === 3) {
      return indent + "<" + el.tagName + attrs + ">" + escapeText(children[0].textContent.trim()) + "</" + el.tagName + ">";
    }

    var inner = children.map(function (c) {
      if (c.nodeType === 1) return serializeElement(c, depth + 1, pad);
      if (c.nodeType === 8) return pad.repeat(depth + 1) + "<!--" + c.textContent + "-->";
      if (c.nodeType === 3) return pad.repeat(depth + 1) + escapeText(c.textContent.trim());
      return "";
    }).join("\n");

    return indent + "<" + el.tagName + attrs + ">\n" + inner + "\n" + indent + "</" + el.tagName + ">";
  }

  formatBtn.addEventListener("click", function () {
    var text = input.value.trim();
    if (!text) { output.value = ""; errorMsg.classList.remove("show"); return; }
    var doc = new DOMParser().parseFromString(text, "application/xml");
    var parseError = doc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      errorMsg.textContent = "That XML isn't well-formed: " + parseError[0].textContent.trim().split("\n")[0];
      errorMsg.classList.add("show");
      output.value = "";
      return;
    }
    errorMsg.classList.remove("show");
    var result = serializeElement(doc.documentElement, 0, indentStr());
    if (/^<\?xml/i.test(text)) {
      result = text.match(/^<\?xml[^>]*\?>/i)[0] + "\n" + result;
    }
    output.value = result;
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    output.value = "";
    errorMsg.classList.remove("show");
  });
})();
