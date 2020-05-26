// TO DO
(function(config){
  let ok = false;

  const { taskToFill } = config;

  taskToFill.forEach(task => {
    // rule to fill ...
    task.filled = true;
  });

  return {
    ok: (ok = true), ok,
    filledTasks: taskToFill
  };
})(config);