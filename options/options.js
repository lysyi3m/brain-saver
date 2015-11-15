// Restore options from storage
function restoreOptions() {
  chrome.storage.sync.get('phrases', function(data) {
    document.getElementById('form-phrases').value = data.phrases.join(', ');
  });
}

// Save options to storage:
function saveOptions(options) {
  chrome.storage.sync.set(options, function() {
    const status = document.getElementById('form-status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// On page load restore options
document.addEventListener('DOMContentLoaded', restoreOptions());

// On form submit save options
document.getElementById('form-save').addEventListener('click', function(e) {
  e.preventDefault();
  const newPhrases = document.getElementById('form-phrases').value.trim();
  const newPhrasesArray = newPhrases.split(', ');
  saveOptions({phrases: newPhrasesArray});
});
