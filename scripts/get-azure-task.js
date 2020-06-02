(function () {
  let ok = false;
  let taskToFill = null;
  const key = document.querySelector('.work-item-form-id').children[0];
  const value = document.querySelector('.work-item-form-title').children[0].children[0].children[0];

  if (key && value) {
    taskToFill = {
      date: new Date().toJSON().slice(0, 10),
      key: key.innerText,
      value: value.value,
      duration: 0,
      filled: false
    }
  }

  return {
    ok: (ok = !!taskToFill), ok,
    taskToFill
  };
})();

