chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostContains: 'facebook.com',
          },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active && tab.url.indexOf('facebook.com') > -1) {
    chrome.tabs.insertCSS(tab.id, {file: 'main/main.css'}, console.log("Stylesheet have been injected."));

    chrome.tabs.executeScript(tab.id, {file: 'main/main.js'}, (response) => {
      chrome.storage.sync.get('phrases', (data) => {
        if (data){
          chrome.tabs.sendMessage(tab.id, {phrases: data.phrases}, (response) => {
            console.log(response.status);
          });
        }
      });
    });
  }
})
