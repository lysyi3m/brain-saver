'use strict'

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const defaultOptions = {
      facebook: true,
      twitter: true,
      phrases: [],
    };

    chrome.storage.sync.set({'options': defaultOptions}, () => {
      console.log('Default settings are successfully applied')
    });
  }

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostContains: 'facebook.com',
          },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostContains: 'twitter.com',
          },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.storage.sync.get('options', (data) => {
      const isFacebook = data.options.facebook && tab.url.indexOf('facebook.com') > -1;
      const isTwitter = data.options.twitter && tab.url.indexOf('twitter.com') > -1;

      if (isFacebook || isTwitter) {
        chrome.tabs.insertCSS(tab.id, {file: 'main/main.css'});
        chrome.tabs.executeScript(tab.id, {file: 'main/main.js'}, (response) => {
          const context = isFacebook ? 'facebook' : 'twitter'
          chrome.tabs.sendMessage(tab.id, {options: data.options, context: context});
        });
      }
    });
  }
});
