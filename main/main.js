'use strict';

let words = [];

function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		var context = this;
    var args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function matchedPosts(words) {
  const posts = Array.prototype.slice.call(document.querySelectorAll('.userContentWrapper'));
  if (posts.length > 0) {
    let matched = [];
    posts.map(post => {
      const postContent = post.textContent.toLowerCase();
      if (words.some(word => postContent.indexOf(word) > -1)) {
        return matched.push(post);
      }
    });
    return matched;
  }
}

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
  if (message.phrases.length > 0) {
    words = message.phrases;
    const targetPosts = matchedPosts(words);
    if (targetPosts.length > 0) {
      targetPosts.map(post => {
        return post.className = `${post.className} __ext-brain-saver`;
      })
    }
  }
});

const observeDOM = (function() {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  const eventListenerSupported = window.addEventListener;

  return function(obj, callback) {
    if (MutationObserver) {
      const obs = new MutationObserver(function(mutations, observer) {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
          callback();
      });
      obs.observe(obj, {
        childList: true,
        subtree: true
      });
    } else if (eventListenerSupported) {
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
})();

observeDOM(document, function(){
  const targetPosts = matchedPosts(words);
  if (targetPosts.length > 0) {
    targetPosts.map(post => {
      if (!post.classList.contains('__ext-brain-saver')) {
        return post.className = `${post.className} __ext-brain-saver`;
      }
    })
  }
});
