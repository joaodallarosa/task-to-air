(function (config) {
  let ok = false;

  const { taskToFill } = config;

  taskToFill.forEach(task => {
    fillAvailableInput(task.duration, `${task.key}:${task.value}`);
    task.filled = true;
  });

  document.getElementById('timesheet_savebutton').addEventListener('click', setRelationships);

  return {
    ok: (ok = true), ok,
    filledTasks: taskToFill
  };
})(config);

function fillAvailableInput(hours, description) {
  var todayColumns = document.getElementsByClassName('timesheetFixedColumn' + (8 - (new Date().getDay())) + ' timesheetHours');
  chrome.storage.sync.get(['relationships'], function (result) {
    var relationships = result.relationships;

    for (let i = 0; i < todayColumns.length; i++) {
      const element = todayColumns[i];
      var input = element.children[0];

      var inputId = input.id;
      var inputRow = inputId.split('r')[1][0];
      var taskSelect = document.getElementById('ts_c2_r' + inputRow);
      var projectSelect = document.getElementById('ts_c1_r' + inputRow);
      var taskCode = description.split('-')[0];

      if (input.value) {
        continue;
      }

      if (projectSelect.selectedIndex <= 0) {

        if (relationships && relationships[taskCode]) {
          projectSelect.value = relationships[taskCode].projectInfo;
          projectSelect.style.borderLeft = '4px solid #f5b709';

          projectSelect.dispatchEvent(new Event('change', {
            view: window,
            bubbles: true,
            cancelable: true
          }));
          taskSelect.value = relationships[taskCode].taskInfo;
          taskSelect.style.borderLeft = '4px solid #f5b709';
          taskSelect.dispatchEvent(new Event('change', {
            view: window,
            bubbles: true,
            cancelable: true
          }));
          fillInput(element, hours, description);
          break;
        } else {
          fillInput(element, hours, description);
          break;
        }

      } else {
        if (relationships && relationships[taskCode]) {
          if (projectSelect.options[projectSelect.selectedIndex].value == relationships[taskCode].projectInfo &&
            taskSelect.options[taskSelect.selectedIndex].value == relationships[taskCode].taskInfo) {
            fillInput(element, hours, description);
            break;
          } else {
            continue;
          }

        } else {
          continue;
        }
      }
    }
  });

}

function fillInput(element, hours, description) {
  var input = element.children[0];
  input.style.borderLeft = '4px solid #f5b709';
  var descriptionBtn = element.children[1];

  input.value = hours;

  input.dispatchEvent(new Event('change', {
    view: window,
    bubbles: true,
    cancelable: true
  }));

  descriptionBtn.dispatchEvent(new Event('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));

  var textarea = document.getElementById('tm_notes');
  var okBtn = document.getElementsByClassName('btn-oa dialogOkButton')[0];
  textarea.value = description;

  okBtn.dispatchEvent(new Event('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));

}

async function setRelationships() {
  var todayColumns = document.getElementsByClassName('timesheetFixedColumn' + (8 - (new Date().getDay())) + ' timesheetHours');
  for (let i = 0; i < todayColumns.length; i++) {
    const element = todayColumns[i];
    var input = element.children[0];
    var descriptionBtn = element.children[1];

    if (input.value) {
      var inputId = input.id;
      var inputRow = inputId.split('r')[1][0];
      var taskSelect = document.getElementById('ts_c2_r' + inputRow);
      var projectSelect = document.getElementById('ts_c1_r' + inputRow);

      var projectValue = projectSelect.options[projectSelect.selectedIndex].value;
      var taskValue = taskSelect.options[taskSelect.selectedIndex].value;

      descriptionBtn.dispatchEvent(new Event('click', {
        view: window,
        bubbles: true,
        cancelable: true
      }));

      var hasTaskCode = document.getElementById('tm_notes').value.split('-').length > 0;
      var taskCode = document.getElementById('tm_notes').value.split('-')[0];
      var okBtn = document.getElementsByClassName('btn-oa dialogOkButton')[0];

      okBtn.dispatchEvent(new Event('click', {
        view: window,
        bubbles: true,
        cancelable: true
      }));

      if (hasTaskCode) {
        await addRelationship(projectValue, taskValue, taskCode);
      }

    }
  }
}

async function addRelationship(projectInfo, taskInfo, taskCode) {
  return new Promise(async (resolve) => {
    var relationships = {};
    chrome.storage.sync.get(['relationships'], function (result) {
      relationships = result.relationships;
      if (!relationships) {
        relationships = {};
      }

      relationships[taskCode] = {
        projectInfo: projectInfo,
        taskInfo: taskInfo
      }

      chrome.storage.sync.set(
        {
          relationships: relationships
        },
        function () {
          resolve();
        }
      );
    });
  });
}
