chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Reset Project Associations',
    id: 'menu-reset-associations', // you'll use this in the handler function to identify this context menu item
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    title: 'Open Timesheet',
    id: 'openair-link', // you'll use this in the handler function to identify this context menu item
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
  if (info.menuItemId === "menu-reset-associations") { // here's where you'll need the ID
    chrome.storage.sync.set(
      {
        relationships: {}
      },
      function () {
        console.log('Relationship reset');
      }
    );
  }

  if (info.menuItemId === "openair-link") { // here's where you'll need the ID
    window.open('https://valtech.app.openair.com/timesheet.pl', '_blank')
  }
});