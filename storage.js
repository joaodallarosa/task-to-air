export default {
  getDate: () => new Date().toJSON().slice(0, 10),

  clearAllTasks: async () => {
    return new Promise(resolve => {
      chrome.storage.sync.set({ dataSource: [] }, () => {
        resolve();
      });
    });
  },

  getAllTasks: async () => {
    return new Promise(resolve => {
      chrome.storage.sync.get('dataSource', (resp) => {
        resolve(resp.dataSource);
      })
    });
  },

  getTaskByDate: async function (day) {
    const data = await this.getAllTasks();
    return data.filter(item => item.date === day);
  },

  getTaskByKey: async function (key) {
    const data = await this.getTaskByDate(this.getDate());
    return data.find(item => item.key === key);
  },

  updateTask: async function (task) {
    return new Promise(async (resolve) => {
      const data = await this.getTaskByDate(task.date);

      chrome.storage.sync.set({ 
        dataSource: data.map((item) => {
          if (item.key !== task.key) return item;
          return Object.assign(item, task), item;
        }) 
      }, () => {
        resolve(task);
      });
    });
  },

  checkIfTaskExists: async function (task) {
    const data = await this.getTaskByDate(task.date);
    return data.some(item => item.key === task.key);
  },

  addTask: async function (task) {
    return new Promise(async (resolve) => {
      const hasTask = await this.checkIfTaskExists(task);

      if (hasTask) return resolve();

      const data = await this.getTaskByDate(task.date);

      chrome.storage.sync.set({ 
        dataSource: data.concat(task) 
      }, () => {
        resolve(task);
      });
    });
  },

  // Remove task
  removeTask: async function (task) {
    return new Promise(async (resolve) => {
      const data = await this.getTaskByDate(task.date);

      chrome.storage.sync.set({
        dataSource: data.filter(item => item.key !== task.key)
      }, () => {
        resolve(task);
      })
    });
  },

  // Remove filled tasks
  removeTaskList: async function (tasks) {
    return new Promise(async (resolve) => {
      const data = await this.getTaskByDate(this.getDate());

      chrome.storage.sync.set({
        dataSource: data.filter(item => {
          return tasks.some(task => task.key !== item.key && !task.filled);
        })
      }, () => {
        resolve(tasks);
      });
    });
  }
}
