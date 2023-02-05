import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';

const routes = {
  executors:
    'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users',
  tasks:
    'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks',
};

const getExecutors = (state, link, i18n) => {
  axios
    .get(link)
    .then((response) => {
      state.executors = [...response.data];
    })
    .catch(() => {
      state.error = 'errors.netErrors';
      throw new Error(i18n.t(state.error));
    });
};

const getTasks = (state, link, i18n) => {
  axios
    .get(link)
    .then((response) => {
      const tasks = [...response.data];
      state.tasks = tasks.map((task) => ({
        id: uniqueId(),
        title: task.subject,
        description: task.description,
        idExecutor: task.executor,
        planStartDate: task.planStartDate,
        planEndDate: task.planEndDate,
      }));
    })
    .catch(() => {
      state.error = 'errors.netErrors';
      throw new Error(i18n.t(state.error));
    });
};

const handleView = (elements, state, i18n) => {
  const date = new Date();
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() - 1);
  }
  state.date = date;
  getExecutors(state, routes.executors, i18n);
  getTasks(state, routes.tasks, i18n);

  elements.btnLeft.addEventListener('click', (e) => {
    e.preventDefault();
    const prevDate = state.date;
    prevDate.setDate(state.date.getDate() - 7);
    state.data = prevDate;
  });
  elements.btnRight.addEventListener('click', (e) => {
    e.preventDefault();
    const nextDate = state.date;
    nextDate.setDate(state.date.getDate() + 7);
    state.data = nextDate;
  });
  elements.inputSearch.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    state.valueSearch = `${value}`;
  });

  elements.formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('search').trim();
    state.valueSearch = `${value}`;
  });
};

export default handleView;
