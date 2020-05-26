// TO DO
(function (config) {
  let ok = false;

  const { taskToFill } = config;

  testlist = [
    {
      "date": "2020-05-26",
      "duration": 4.6,
      "filled": false,
      "key": "FCCB-21",
      "value": "Task2Air"
    }, {
      "date": "2020-05-26",
      "duration": 3,
      "filled": false,
      "key": "FCCB-21",
      "value": "Task2Air"
    }, {
      "date": "2020-05-26",
      "duration": 2,
      "filled": false,
      "key": "FCCB-21",
      "value": "Task2Air"
    },]


  testlist.forEach(task => {
    // rule to fill ...
    fillAvailableInput(task.duration, task.key);
    task.filled = true;
  });

  setRelationships();

  return {
    ok: (ok = true), ok,
    filledTasks: taskToFill
  };
})(config);

function fillAvailableInput(hours, description) {
  var todayColumns = document.getElementsByClassName('timesheetFixedColumn' + (8 - (new Date().getDay())) + ' timesheetHours');
  console.log('today columns', todayColumns);
  for (let i = 0; i < todayColumns.length; i++) {
    const element = todayColumns[i];
    var input = element.children[0];
    var descriptionBtn = element.children[1];

    if (!input.value) {
      element.style.border = '1px solid red';

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

      break;
    }

  }
}

async function setRelationships() {
  var todayColumns = document.getElementsByClassName('timesheetFixedColumn' + (8 - (new Date().getDay())) + ' timesheetHours');
  for (let i = 0; i < todayColumns.length; i++) {
    const element = todayColumns[i];
    var input = element.children[0];
    var descriptionBtn = element.children[1];

    if (input.value) {
      var inputId = input.id;
      console.log('input id', inputId);

      var inputRow = inputId.split('r')[1][0];
      console.log(inputRow);
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

      // console.log('values', projectValue, taskValue);

      if (hasTaskCode) {
        await addRelationship(projectValue, taskValue, taskCode);
      }

    }
  }
}


// TODO: REMOVE THIS AND USE THE ONE FROM STORAGE JS
async function addRelationship(projectInfo, taskInfo, taskCode) {
  return new Promise(async (resolve) => {
    var relationships = {};
    chrome.storage.sync.get(['relationships'], function (result) {
      console.log('got this', result);
      relationships = result;
      if (!relationships) {
        relationships = {};
      }

      relationships[taskCode] = {
        projectInfo: projectInfo,
        taskInfo: taskInfo
      }

      // console.log(relationships);

      chrome.storage.sync.set(
        {
          relationships: relationships
        },
        function () {
          console.log('Relationship is set', relationships);
          resolve();
        }
      );
    });
  });
}
