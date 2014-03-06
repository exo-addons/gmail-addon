chrome.webRequest.onCompleted.addListener(function (details) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {
      type: "eXoUserInfo"
    });
  });
}, {
  urls: ["*://mail.google.com/*"]
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {
      type: "rightPanel"
    });
  });
}, {
  urls: ["*://mail.google.com/*"]
});
