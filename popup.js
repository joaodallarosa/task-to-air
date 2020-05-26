import storage from './storage.js';

(function () {

  function getTaskTemplate(item) {
    return `<div class="task-item" data-item="${item.key}">
              <span class="task-item-label">
                ${item.key}: ${item.value}
              </span>
              <input class="task-item-time" type="number" placeholder="Hours" value="${item.duration}" />
              <div class="remove icon"></div>
            </div>`;
  }

  function putTemplateTask(item) {
    const wrapTasks = document.getElementById('wrap-tasks');

    wrapTasks.insertAdjacentHTML('beforeend', getTaskTemplate(item));

    const inputHour = wrapTasks.querySelector(`[data-item="${item.key}"] input[type="number"]`);
    const btnRemove = wrapTasks.querySelector(`[data-item="${item.key}"] .remove`);

    inputHour.addEventListener('input', onChangeTaskDuration);
    btnRemove.addEventListener('click', onClickToRemoveTask);
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
  }

  async function onChangeTaskDuration() {
    const item = event.target;
    const key = item.parentElement.dataset['item'];

    var task = await storage.getTaskByKey(key);

    if (!task) return;

    task.duration = item.value;
    storage.updateTask(task);
  }

  async function onClickToAddTask() {
    chrome.tabs.executeScript({
      file: 'get-jira-task.js'
    }, async (data) => {
      const result = data[0];
      if (!result.ok) return;

      var taskAdded = await storage.addTask(result.taskToFill);

      if (!taskAdded) return;

      putTemplateTask(taskAdded);
    });
  };

  async function onClickToFillTasks() {
    const taskToFill = await storage.getTaskByDate(storage.getDate());

    chrome.tabs.executeScript(null, {
      code: `var config = ${JSON.stringify({ taskToFill })}`
    }, () => {
      chrome.tabs.executeScript(null,
        {
          file: 'fill-open-air.js'
        }, (data) => {
          const result = data[0];
          if (!result.ok) return;

          storage.removeTaskList(result.filledTasks);

          result.filledTasks.forEach((filledTask) => {
            removeTemplateTask(filledTask.key);
          });

          window.alert(JSON.stringify(result.filledTasks));
        });
    });
  }

  async function initialize() {
    console.log('DOM fully loaded');

    const actionToAdd = document.getElementById('clickme');
    const actionFill = document.getElementById('clickme2');

    var items = await storage.getTaskByDate(storage.getDate());

    items.forEach(item => {
      putTemplateTask(item);     
    });

    actionToAdd.addEventListener('click', onClickToAddTask);
    actionFill.addEventListener('click', onClickToFillTasks);
  }

  document.addEventListener('DOMContentLoaded', initialize);

})();