import parserNumber from './parserNumber.js';
import filterDate from './filterDate.js';

const renderСalendar = (elements, state) => {
  const nowDateNumber = new Date(state.date);
  const elementsDates = [];
  const elementCorner = document.createElement('span');
  elementCorner.classList.add('corner');
  for (let i = 0; i < 7; i += 1) {
    const elementDiv = document.createElement('div');
    elementDiv.classList.add('date');
    const month = parserNumber(nowDateNumber.getMonth() + 1);
    const day = parserNumber(nowDateNumber.getDate());
    elementDiv.textContent = `${day}.${month}`;
    elementsDates.push(elementDiv);
    nowDateNumber.setDate(nowDateNumber.getDate() + 1);
  }
  elements.dateContainer.replaceChildren(elementCorner, ...elementsDates);
};

const updateTaskExecutors = (elements, state) => {
  const taskExec = state.tasks.filter((task) => task.idExecutor !== null);
  taskExec.forEach((task) => {
    const container = document.getElementById(`${task.idExecutor}`);
    const containerTasks = container.querySelectorAll('.task-executor');
    containerTasks.forEach((item) => item.replaceChildren());
  });
  const tasks = filterDate(state.date, taskExec);
  for (let i = 0; i < tasks.length; i += 1) {
    const startDate = new Date(tasks[i].planStartDate);
    const weekDay = startDate.getDay();
    const elementDiv = document.createElement('div');
    elementDiv.classList.add('plan');
    elementDiv.textContent = `${tasks[i].title}`;
    const container = document.getElementById(`${tasks[i].idExecutor}`);

    const containerTasks = container.querySelectorAll('.task-executor');
    containerTasks[weekDay - 1].replaceChildren(elementDiv);
  }
};

const renderTasks = (elements, state) => {
  const elementTasks = state.tasks
    .filter((task) => task.idExecutor === null)
    .map((task) => {
      const elementDiv = document.createElement('div');
      elementDiv.classList.add('task');
      elementDiv.id = task.id;
      elementDiv.dataset.dataTooltip = 'Перемести задачу на календарь';
      const elementTitle = document.createElement('h4');
      elementTitle.classList.add('task-title');
      elementTitle.textContent = task.title;
      const elementDescription = document.createElement('p');
      elementDescription.classList.add('task-description');
      elementDescription.textContent = task.description;
      elementDiv.append(elementTitle, elementDescription);
      return elementDiv;
    });
  elements.taskContainer.replaceChildren(...elementTasks);
  const taskElements = elements.taskContainer.querySelectorAll('.task');
  for (const task of taskElements) {
    task.draggable = true;
  }
  elements.taskContainer.addEventListener('dragstart', (evt) => {
    evt.target.classList.add('selected');
    evt.dataTransfer.setData('taskDrag', evt.target.id);
  });

  elements.taskContainer.addEventListener('dragend', (evt) => {
    evt.target.classList.remove('selected');
  });

  const executorContainers = document.querySelectorAll('.executor-container');
  executorContainers.forEach((exec) => {
    exec.addEventListener('dragover', (evt) => {
      evt.preventDefault();
    });
    exec.addEventListener('drop', (evt) => {
      const dragId = evt.dataTransfer.getData('taskDrag');
      const taskIndex = state.tasks.findIndex((item) => item.id === dragId);
      state.tasks[taskIndex].idExecutor = exec.id;
      if (evt.target.classList.contains('task-executor')) {
        const elementDiv = document.createElement('div');
        elementDiv.classList.add('plan');
        elementDiv.textContent = `${state.tasks[taskIndex].title}`;
        elementDiv.dataset.taskId = state.tasks[taskIndex].id;
        evt.target.replaceChildren(elementDiv);
        const listContainerTask = exec.querySelectorAll('.task-executor');
        listContainerTask.forEach((item, index) => {
          const el = item.firstChild;
          if (el && el.dataset.taskId === state.tasks[taskIndex].id) {
            const startWeek = new Date(state.date);
            startWeek.setDate(startWeek.getDate() + index);
            state.tasks[taskIndex].planStartDate = startWeek;
          }
        });
        renderTasks(elements, state);
      }
      if (evt.target.classList.contains('executor')) {
        updateTaskExecutors(elements, state);
        renderTasks(elements, state);
      }
    });
  });
};

const renderExecutors = (elements, state) => {
  const executorsRow = state.executors.map((executor) => {
    const executorContainer = document.createElement('div');
    executorContainer.classList.add('executor-container');
    executorContainer.id = executor.id;
    const elementName = document.createElement('span');
    elementName.classList.add('executor');
    elementName.textContent = `${executor.firstName} ${executor.surname}`;
    const elementsTaskExecutor = [];
    for (let i = 0; i < 7; i += 1) {
      const elementDiv = document.createElement('div');
      elementDiv.classList.add('task-executor');
      elementsTaskExecutor.push(elementDiv);
    }
    executorContainer.append(elementName, ...elementsTaskExecutor);
    return executorContainer;
  });
  elements.schedulerContainer.append(...executorsRow);
};

const renderSearch = (elements, state) => {
  const listTasks = document.querySelectorAll('.task .task-title');
  const listTasksArr = [...listTasks].filter((task) => {
    if (!task.textContent.toLowerCase().startsWith(state.valueSearch)) {
      task.parentElement.classList.add('hide');
      return false;
    }
    return true;
  });
  for (const listTask of listTasksArr) {
    listTask.parentElement.classList.remove('hide');
  }
};

export default (elements, state, i18n) => (path) => {
  switch (path) {
    case 'date':
      renderСalendar(elements, state, i18n);
      updateTaskExecutors(elements, state);
      break;
    case 'executors':
      renderExecutors(elements, state);
      break;
    case 'tasks':
      renderTasks(elements, state);
      updateTaskExecutors(elements, state);
      break;
    case 'valueSearch':
      renderSearch(elements, state);
      break;
    default:
      break;
  }
};
