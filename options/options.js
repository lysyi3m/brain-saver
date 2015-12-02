// Restore options from storage
function restoreOptions() {
  chrome.storage.sync.get('options', (data) => {
    if (data.options) {
      document.getElementById('form-facebook').checked = data.options.facebook;
      document.getElementById('form-twitter').checked = data.options.twitter;
      document.getElementById('form-phrases').value = data.options.phrases ? data.options.phrases.join(', ') : '';
    }
  });
}

// Save options to storage:
function saveOptions(options) {
  chrome.storage.sync.set({'options': options}, () => {
    const formStatus = document.getElementById('form-status');
    formStatus.textContent = 'Successfully saved';
    setTimeout(() => {
      formStatus.textContent = '';
    }, 750);
  });
}

// On page load restore options
document.addEventListener('DOMContentLoaded', restoreOptions());

// On form submit save options
document.getElementById('form-save').addEventListener('click', (e) => {
  e.preventDefault();
  const phrases = document.getElementById('form-phrases').value.trim();

  saveOptions({
    phrases: phrases.length > 0 ? phrases.toLowerCase().split(', ') : [],
    facebook: document.getElementById('form-facebook').checked,
    twitter: document.getElementById('form-twitter').checked,
  });
});

// Google Analytics stuff
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-70266101-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();
