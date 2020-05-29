chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Reset Project Associations',
    id: 'menu-reset-associations',
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    title: 'Open Timesheet',
    id: 'openair-link',
    contexts: ['all'],
  });

  chrome.storage.sync.set({ dataSource: [] }, function () {
    chrome.storage.onChanged.addListener(function (changes) {
      for (var key in changes) {
        var storageChange = changes[key];
      }
    });
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "menu-reset-associations") {
    chrome.storage.sync.set(
      {
        relationships: {}
      },
      function () {
        console.log('Relationship reset');
      }
    );
  }

  if (info.menuItemId === "openair-link") {
    window.open('https://valtech.app.openair.com/timesheet.pl', '_blank')
  }
});