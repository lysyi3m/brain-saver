'use strict';

function matchedPosts(phrases, context) {
  let posts = [];
  if (context === 'facebook') {
    posts = Array.prototype.slice.call(document.querySelectorAll('.userContentWrapper'));
  } else if (context === 'twitter') {
    posts = Array.prototype.slice.call(document.querySelectorAll('.tweet'));
  }

  if (posts.length > 0) {
    let matched = [];

    posts.map(post => {
      const postContent = post.textContent.toLowerCase();
      if (phrases.some(phrase => postContent.indexOf(phrase) > -1)) {
        return matched.push(post);
      }
    });

    return matched;
  }
}

function hidePosts(posts, context) {
  posts.map(post => {
    if (!post.classList.contains('__ext-brain-saver')) {
      return post.className = `${post.className} __ext-brain-saver ${context}`;
    }
  });
}

const observeDOM = (() => {
  return function(obj, callback) {
    if (window.MutationObserver) {
      const obs = new MutationObserver((mutations) => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          callback();
        }
      });
      obs.observe(obj, {
        childList: true,
        subtree: true,
      });
    } else if (window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  };
})();


chrome.extension.onMessage.addListener((message) => {
  if (message.options.phrases.length > 0) {
    const posts = matchedPosts(message.options.phrases, message.context);

    if (posts.length > 0) {
      hidePosts(posts, message.context);
    }

    observeDOM(document, () => {
      const posts = matchedPosts(message.options.phrases, message.context);

      if (posts.length > 0) {
        hidePosts(posts, message.context);
      }
    });
  }
});
