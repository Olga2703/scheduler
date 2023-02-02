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
  const task = filterDate(state.date, state.tasks);
  console.log(task);
};

const renderTasks = (elements, state) => {
  const elementTasks = state.tasks
    .filter((task) => task.idExecutor === null)
    .map((task) => {
      const elementDiv = document.createElement('div');
      elementDiv.classList.add('task');
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
  const task = filterDate(state.date, state.tasks);
  console.log(task);
};

const renderExecutors = (elements, state) => {
  const executorsRow = state.executors.map((executor) => {
    const executorContainer = document.createElement('div');
    executorContainer.classList.add('executor-container');
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
export default (elements, state, i18n) => (path, value) => {
  switch (path) {
    case 'date':
      renderСalendar(elements, state, i18n);
      break;
    case 'executors':
      renderExecutors(elements, state);
      break;
    case 'tasks':
      renderTasks(elements, state);
      break;
  }
};
