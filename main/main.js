function matchPosts(phrases, context) {
  let posts = [];

  switch (context) {
  case 'facebook':
    posts = Array.prototype.slice.call(document.querySelectorAll('.userContentWrapper'));
    break;
  case 'twitter':
    posts = Array.prototype.slice.call(document.querySelectorAll('.tweet'));
    break;
  default:
    break;
  }

  if (posts.length > 0) {
    return posts.filter(post => phrases.some(phrase => (post.textContent || {}).toLowerCase().indexOf(phrase) > -1));
  }
}

function hidePosts(posts, context) {
  posts.forEach(post => {
    if (!post.classList.contains('__ext-brain-saver')) {
      post.className = `${post.className} __ext-brain-saver ${context}`;
    }
  });
}

function processPosts(message) {
  const posts = matchPosts(message.options.phrases, message.context);

  if (posts.length > 0) {
    hidePosts(posts, message.context);
  }
}

function observeDOM(obj, callback) {
  if (window.MutationObserver) {
    const obs = new MutationObserver(mutations => {
      if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) callback();
    });
    obs.observe(obj, { childList: true, subtree: true });
  } else if (window.addEventListener) {
    obj.addEventListener('DOMNodeInserted', callback, false);
    obj.addEventListener('DOMNodeRemoved', callback, false);
  }
}

chrome.extension.onMessage.addListener(message => {
  if (message.options.phrases.length > 0) {
    processPosts(message);

    observeDOM(document, () => processPosts(message));
  }
});
