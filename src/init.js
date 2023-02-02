// @ts-check
import onChange from 'on-change';
import i18n from 'i18next';
import resources from './locales/index.js';
import render from './render.js';
import handleView from './controller.js';

export default () => {
  const elements = {
    schedulerContainer: document.querySelector('.scheduler-container'),
    dateContainer: document.querySelector('.date-container'),
    btnLeft: document.querySelector('button[data-toggle="left"]'),
    btnRight: document.querySelector('button[data-toggle="right"]'),
    taskContainer: document.querySelector('.container_task'),
  };

  const i18nInstance = i18n.createInstance();

  const state = {
    executors: [],
    tasks: [],
    date: null,
    week: [],
  };
  console.log(state);
  const watchState = onChange(state, render(elements, state, i18nInstance));

  return i18nInstance
    .init({
      lng: 'ru',
      debug: true,
      resources,
    })
    .then(handleView(elements, watchState, i18nInstance));
};
