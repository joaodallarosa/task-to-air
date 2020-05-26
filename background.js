chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ dataSource: [] }, function () {
    console.log("Created empty dataSource.");

    chrome.storage.onChanged.addListener(function(changes) {
      for (var key in changes) {
        var storageChange = changes[key];
        console.log(JSON.stringify(storageChange.newValue));
      }
    });
  });
});
