chrome.webRequest.onCompleted.addListener(function (details) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {
      type: "bindEvent"
    });
  });
}, {
  urls: ["*://mail.google.com/*"]
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {
      type: "bindEvent"
    });
  });
}, {
  urls: ["*://mail.google.com/*"]
});
