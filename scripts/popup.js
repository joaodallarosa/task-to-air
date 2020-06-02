import storage from './storage.js';

(function () {
  chrome.tabs.getSelected(null, function (tab) {
    if (tab.url.includes('valtech.app.openair.com/timesheet.pl')) {
      document.getElementById('btn-openair').style.display = 'block';
    }

    if (tab.url.includes('azure')) {
      document.getElementById('btn-add-task').style.display = 'block';
    }

    if (tab.url.includes('jira')) {
      document.getElementById('btn-add-task').style.display = 'block';
    }
  });

  async function onClickToAddTask() {
    var result = await getTaskFromJira();
    var azureResult = await getTaskFromAzure();

    if (result && result.ok) {
      const addedTask = await storage.addTask(result.taskToFill);
      if (!addedTask) return;
      putTemplateTask(addedTask);
    }

    if (azureResult && azureResult.ok) {
      const azureAddedTask = await storage.addTask(azureResult.taskToFill);
      if (!azureAddedTask) return;
      putTemplateTask(azureAddedTask);
    }

    return
  };

  async function removeFilledTasks(tasks) {
    const removedTasks = await storage.removeTaskList(tasks);

    if (!removedTasks) return;

    removedTasks.forEach(task => removeTemplateTask(task.key));
  }

  async function onClickToFillTasks() {
    const taskToFill = await storage.getTaskByDate(storage.getDate());

    chrome.tabs.executeScript(null, {
      code: `var config = ${JSON.stringify({ taskToFill })}`
    }, () => {
      chrome.tabs.executeScript(null,
        {
          file: 'scripts/fill-open-air.js'
        }, async (data) => {
          const result = data[0];
          if (!result.ok) return;

          removeFilledTasks(result.filledTasks);
        });
    });
  }

  function getTaskTemplate(item) {
    return `<div class="task-item" data-item="${item.key}">
              <span class="task-item-label">
                ${item.key}: ${item.value}
              </span>
              <input class="task-item-time" step="0.25" type="number" placeholder="Hours" value="${item.duration}" />
              <div class="remove icon"></div>
            </div>`;
  }

  function showOrHideEmptyList() {
    const task = document.querySelector('.task-item');

    if (!task) {
      document.body.classList.add('no-data')
    } else {
      document.body.classList.remove('no-data')
    }
  }

  function removeTemplateTask(key) {
    const wrapTasks = document.getElementById('wrap-tasks');

    wrapTasks
      .querySelector(`[data-item="${key}"]`)
      .remove();
  }

  async function onClickToRemoveTask() {
    const key = event.target.parentElement.dataset['item'];

    var task = await storage.getTaskByKey(key);

    if (!task) return;

    storage.removeTask(task);
    removeTemplateTask(key);
    showOrHideEmptyList();
  }

  async function onChangeTaskDuration() {
    const item = event.target;
    const key = item.parentElement.dataset['item'];

    var task = await storage.getTaskByKey(key);

    if (!task) return;

    task.duration = item.value;
    storage.updateTask(task);
  }

  function putTemplateTask(item) {
    const wrap = document.getElementById('wrap-tasks');
    wrap.insertAdjacentHTML('beforeend', getTaskTemplate(item));

    const inputHour = wrap.querySelector(`[data-item="${item.key}"] input[type="number"]`);
    const btnRemove = wrap.querySelector(`[data-item="${item.key}"] .remove`);

    inputHour.addEventListener('input', onChangeTaskDuration);
    btnRemove.addEventListener('click', onClickToRemoveTask);

    showOrHideEmptyList();
  }

  function populateTaskList(tasks) {
    if (!tasks.length) return;

    tasks.forEach(task => {
      putTemplateTask(task);
    });
  }

  function getTaskFromJira() {
    return new Promise(resolve => {
      chrome.tabs.executeScript({
        file: 'scripts/get-jira-task.js'
      }, (data) => {
        resolve(data[0]);
      });
    });
  }

  function getTaskFromAzure() {
    return new Promise(resolve => {
      chrome.tabs.executeScript({
        file: 'scripts/get-azure-task.js'
      }, (data) => {
        resolve(data[0]);
      });
    });
  }

  async function onInitializePopup() {
    console.log('DOM fully loaded');

    const actionToAdd = document.getElementById('btn-add-task');
    const actionFill = document.getElementById('btn-openair');

    populateTaskList(await storage.getTaskByDate(storage.getDate()));

    var task = await getTaskFromJira();
    var azureTask = await getTaskFromAzure();

    if (task && task.ok) {
      document.getElementById('title').innerText = task.taskToFill.key;
    }

    if (azureTask && azureTask.ok) {
      document.getElementById('title').innerText = azureTask.taskToFill.key;
    }

    actionToAdd.addEventListener('click', onClickToAddTask);
    actionFill.addEventListener('click', onClickToFillTasks);
  }

  document.addEventListener('DOMContentLoaded', onInitializePopup);
})();