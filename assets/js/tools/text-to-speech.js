(function () {
  "use strict";
  var input = document.getElementById("tts-input");
  if (!input) return;
  var voiceSelect = document.getElementById("tts-voice");
  var rateSlider = document.getElementById("tts-rate");
  var rateVal = document.getElementById("tts-rate-val");
  var pitchSlider = document.getElementById("tts-pitch");
  var pitchVal = document.getElementById("tts-pitch-val");
  var playBtn = document.getElementById("tts-play");
  var pauseBtn = document.getElementById("tts-pause");
  var stopBtn = document.getElementById("tts-stop");
  var errorMsg = document.getElementById("tts-error");
  var unsupported = document.getElementById("tts-unsupported");

  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    unsupported.style.display = "block";
    [playBtn, pauseBtn, stopBtn, voiceSelect, rateSlider, pitchSlider].forEach(function (el) {
      el.disabled = true;
    });
    return;
  }

  var synth = window.speechSynthesis;
  var voices = [];

  function loadVoices() {
    voices = synth.getVoices();
    if (voices.length === 0) return;
    voiceSelect.innerHTML = "";
    voices.forEach(function (v, i) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.textContent = v.name + " (" + v.lang + ")";
      voiceSelect.appendChild(opt);
    });
  }

  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.addEventListener("voiceschanged", loadVoices);
  }

  rateSlider.addEventListener("input", function () {
    rateVal.textContent = parseFloat(rateSlider.value).toFixed(1);
  });
  pitchSlider.addEventListener("input", function () {
    pitchVal.textContent = parseFloat(pitchSlider.value).toFixed(1);
  });

  function setPlayingState(isPlaying) {
    playBtn.disabled = isPlaying;
    pauseBtn.disabled = !isPlaying;
    stopBtn.disabled = !isPlaying;
    pauseBtn.textContent = "Pause";
  }

  playBtn.addEventListener("click", function () {
    var text = input.value.trim();
    errorMsg.classList.remove("show");
    if (!text) {
      errorMsg.textContent = "Type or paste some text first.";
      errorMsg.classList.add("show");
      return;
    }
    if (voices.length === 0) {
      errorMsg.textContent = "No text-to-speech voices are available in this browser/OS, so playback can't start. This is a system limitation, not something this page can fix.";
      errorMsg.classList.add("show");
      return;
    }
    synth.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    if (voices.length) {
      var selected = voices[parseInt(voiceSelect.value, 10)];
      if (selected) utterance.voice = selected;
    }
    utterance.rate = parseFloat(rateSlider.value);
    utterance.pitch = parseFloat(pitchSlider.value);

    utterance.onstart = function () { setPlayingState(true); };
    utterance.onend = function () { setPlayingState(false); };
    utterance.onerror = function () {
      setPlayingState(false);
      errorMsg.textContent = "Speech playback was interrupted or failed.";
      errorMsg.classList.add("show");
    };

    synth.speak(utterance);
  });

  pauseBtn.addEventListener("click", function () {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      pauseBtn.textContent = "Resume";
    } else if (synth.paused) {
      synth.resume();
      pauseBtn.textContent = "Pause";
    }
  });

  stopBtn.addEventListener("click", function () {
    synth.cancel();
    setPlayingState(false);
  });

  window.addEventListener("beforeunload", function () {
    synth.cancel();
  });
})();
