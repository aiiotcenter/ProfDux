var langs =
[['English',['en-US', 'United States']],
 ['Türkçe', ['tr-TR']]
];

let langlist = {
  "tr" : "tr-TR",
  "en" : "en-US"
};

let lang = document.querySelector("html").getAttribute("lang");
let language = langlist[lang];

let start_button = document.querySelector("#start_button")

var two_line = /\n\n/g;
var one_line = /\n/g;
var first_char = /\S/;
 
 var messages = {
    "start": {
      msg: 'Click on the microphone icon and begin speaking.',
      class: 'alert-success'},
    "speak_now": {
      msg: 'Speak now.',
      class: 'alert-success'},
    "no_speech": {
      msg: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a>.',
      class: 'alert-danger'},
    "no_microphone": {
      msg: 'No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a> are configured correctly.',
      class: 'alert-danger'},
    "allow": {
      msg: 'Click the "Allow" button above to enable your microphone.',
      class: 'alert-warning'},
    "denied": {
      msg: 'Permission to use microphone was denied.',
      class: 'alert-danger'},
    "blocked": {
      msg: 'Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone',
      class: 'alert-danger'},
    "upgrade": {
      msg: 'Web Speech API is not supported by this browser. It is only supported by <a href="//www.google.com/chrome">Chrome</a> version 25 or later on desktop and Android mobile.',
      class: 'alert-danger'},
    "stop": {
        msg: 'Stop listening, click on the microphone icon to restart',
        class: 'alert-success'},
    "copy": {
      msg: 'Content copy to clipboard successfully.',
      class: 'alert-success'},
  }
  
  var final_transcript = '';
  var recognizing = false;
  var ignore_onend;
  var start_timestamp;
  let recognition;
  
  if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } else {

      // start_button.style.display = 'grid';
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
  
      recognition.onstart = function() {
        recognizing = true;
        start_img.src = '../assets/icons/mic-animation.gif';
      };
  
      recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          start_img.src = '../assets/icons/mic.gif';
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          start_img.src = '../assets/icons/mic.gif';
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
          } else {
          }
          ignore_onend = true;
        }
      };
  
      recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
          return;
        }
        start_img.src = '../assets/icons/mic.gif';
        if (!final_transcript) {
          return;
        }
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
          var range = document.createRange();
          range.selectNode(document.getElementById('final_speech'));
          window.getSelection().addRange(range);
        }
      };
  
      recognition.onresult = function(event) {
        var interim_transcript = '';
        interim_speech.style.padding = "13px 0px 13px 3px";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            interim_speech.style.padding = "0px 0px 0px 0px";
            final_transcript += " " + event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript = capitalize(final_transcript);
        final_speech.innerHTML = linebreak(final_transcript);
        interim_speech.innerHTML = linebreak(interim_transcript);
      };
  }

  function upgrade() {
    start_button.style.visibility = 'hidden';
  }
  
  function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }
  
  function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
  }
  
  function start() {

    if (recognizing) {
      recognition.stop();
      return;
    }

    final_transcript = '';
    recognition.lang = language;
    recognition.start();
    ignore_onend = false;
    final_speech.innerHTML = '';
    interim_speech.innerHTML = '';
    interim_speech.style.padding = "13px 0px 13px 3px";
    start_img.src = '../assets/icons/mic-slash.gif';
    start_timestamp = event.timeStamp;
  };
  