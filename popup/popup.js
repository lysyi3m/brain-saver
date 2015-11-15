document.querySelector('#go-to-options').addEventListener('click', function(e) {
  e.preventDefault();
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

// document.addEventListener('DOMContentLoaded', () => {
//   chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
//     const tabId = tabs[0].id;
//     chrome.tabs.sendMessage(tabId, {action: 'GET_COUNTER'}, (response) => {
//       console.log(response);
//     });
//   });
// });
