// TO DO
(function(){
  let ok = false;
  let taskToFill = null;

  const key = document.querySelector('#key-val');
  const value = document.querySelector('#summary-val');

  if (key && value) {
    taskToFill = {
      date: new Date().toJSON().slice(0,10),
      key: key.innerText,
      value: value.innerText,
      duration: 0,
      filled: false
    }
  }

  return {
    ok: (ok = !!taskToFill), ok,
    taskToFill
  };
})();