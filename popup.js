function saveJiraTask() {
  chrome.tabs.executeScript({
    file: 'save-jira-task.js'
  }); 
}

document.getElementById('clickme').addEventListener('click', saveJiraTask);
