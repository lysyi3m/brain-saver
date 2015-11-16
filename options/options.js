// Restore options from storage
function restoreOptions() {
  chrome.storage.sync.get('phrases', (data) => {
    document.getElementById('form-phrases').value = data.phrases.join(', ');
  });
}

// Save options to storage:
function saveOptions(options) {
  chrome.storage.sync.set(options, () => {
    const status = document.getElementById('form-status');
    status.textContent = 'Successfully saved';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

// On page load restore options
document.addEventListener('DOMContentLoaded', restoreOptions());

// On form submit save options
document.getElementById('form-save').addEventListener('click', (e) => {
  e.preventDefault();
  const value = document.getElementById('form-phrases').value.trim();
  if (value.length > 0) {
    const valuesArray = value.toLowerCase().split(', ');
    saveOptions({phrases: valuesArray});
  } else {
    saveOptions({phrases: []});
  }
});
