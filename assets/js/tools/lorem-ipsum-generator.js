(function () {
  "use strict";
  var output = document.getElementById("li-output");
  if (!output) return;

  var unitSelect = document.getElementById("li-unit");
  var countInput = document.getElementById("li-count");
  var classicCheck = document.getElementById("li-classic");
  var htmlCheck = document.getElementById("li-html");
  var generateBtn = document.getElementById("li-generate");

  var WORDS = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor " +
    "incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation " +
    "ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit " +
    "voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat " +
    "non proident sunt culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis " +
    "unde omnis iste natus error voluptatem accusantium doloremque laudantium totam rem aperiam " +
    "eaque ipsa quae ab illo inventore veritatis quasi architecto beatae vitae dicta sunt explicabo").split(" ");

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function randomWord() {
    return WORDS[randomInt(0, WORDS.length - 1)];
  }

  function generateSentence(minWords, maxWords) {
    var count = randomInt(minWords, maxWords);
    var words = [];
    for (var i = 0; i < count; i++) words.push(randomWord());
    var sentence = words.join(" ");
    return capitalize(sentence) + ".";
  }

  function generateParagraph(sentenceCount) {
    var sentences = [];
    for (var i = 0; i < sentenceCount; i++) sentences.push(generateSentence(6, 16));
    return sentences.join(" ");
  }

  function generate() {
    var unit = unitSelect.value;
    var count = Math.min(50, Math.max(1, parseInt(countInput.value, 10) || 1));
    var result = [];

    if (unit === "words") {
      var words = [];
      for (var i = 0; i < count; i++) words.push(randomWord());
      var text = capitalize(words.join(" ")) + ".";
      result = [text];
    } else if (unit === "sentences") {
      var sentences = [];
      for (var s = 0; s < count; s++) sentences.push(generateSentence(6, 16));
      result = [sentences.join(" ")];
    } else {
      for (var p = 0; p < count; p++) {
        result.push(generateParagraph(randomInt(4, 7)));
      }
    }

    if (classicCheck.checked && result.length) {
      var opener = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      if (unit === "paragraphs") {
        result[0] = opener + " " + result[0];
      } else {
        result[0] = opener + " " + result[0];
      }
    }

    if (htmlCheck.checked && unit === "paragraphs") {
      output.value = result.map(function (p) { return "<p>" + p + "</p>"; }).join("\n\n");
    } else {
      output.value = result.join("\n\n");
    }
  }

  generateBtn.addEventListener("click", generate);
  generate();
})();
