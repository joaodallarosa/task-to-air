import storage from './storage.js';

(function() {
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

  async function onClickToAddTask() {
    chrome.tabs.executeScript({
      file: 'get-jira-task.js'
    }, async (data) => {
      // to do...
      const result = data[0];
      if (!result.ok) return;

      const taskAdded = await storage.addTask(result.taskToFill);

      if (!taskAdded) return;
      
      window.alert(JSON.stringify(taskAdded));
    });
  };

  async function onClickToFillTasks() {
    const taskToFill = await storage.getTaskByDate(storage.getDate());

    chrome.tabs.executeScript(null, {
      code: `var config = ${JSON.stringify({ taskToFill })}`
    }, () => {
      chrome.tabs.executeScript(null,
        {
          file: 'fill-open-air.js',
        }, async (data) => {
          // to do...

          const result = data[0];
          if (!result.ok) return;

          const removedTasks = await storage.removeTaskList(result.filledTasks);

          if (!removedTasks) return;
          
          // window.alert(JSON.stringify(result.filledTasks));
        });
    });
  }

  async function initialize() {
    console.log('DOM fully loaded');

    // To do 

    const actionToAdd = document.getElementById('clickme');
    const actionFill = document.getElementById('btn-openair');

    var items = await storage.getTaskByDate(storage.getDate());
    
    // window.alert(JSON.stringify(items));

    actionToAdd.addEventListener('click', onClickToAddTask);
    actionFill.addEventListener('click', onClickToFillTasks);
  }

  document.addEventListener('DOMContentLoaded', initialize);
  
  // document.getElementById('clickme').addEventListener('click', saveJiraTask);
})();
