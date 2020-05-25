function saveJiraTask() {
  chrome.tabs.executeScript({
    file: 'save-jira-task.js'
  });
}

// Check for Openair to display Filling Button
chrome.tabs.getSelected(null, function (tab) {
  if (tab.url.includes('valtech.app.openair.com/timesheet.pl')) {
    document.getElementById('btn-openair').style.display = 'block';
  }
});

document.getElementById('clickme').addEventListener('click', saveJiraTask);
