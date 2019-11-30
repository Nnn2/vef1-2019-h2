import { el, empty } from './helpers';
import { getSavedLectures } from './saved';


export default class List {
  constructor() {
    this.container = document.querySelector('.list');
    this.filters = document.querySelectorAll('.filters__filter');
    this.url = 'lectures.json';
  }

  makeContent(...content) {
    empty(this.container);
    content.forEach((item) => {
      const contentToShow = typeof item === 'string'
        ? document.createTextNode(item) : item;
      this.container.appendChild(contentToShow);
    }
    );
  }

  makeError(error) {
    const errorEl = el('div', error);
    errorEl.classList.add('list__error');
    this.makeContent(errorElement);
  }  

  loadLectures() {
    return fetch(this.url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not get the lecture');
        }
        return res.json();
      });
  }

  addSavedLectures(data) {
    const saved = getSavedLectures();
    return data.map((i) => {
      i.finished = saved.indexOf(i.slug) >= 0;
      return i;
    });
  }

  filteredLectures(data) {
    const activeFilters = Array.from(this.filters)
      .filter(i => i.classList.contains('filters__filter--active'))
      .map(i => i.dataset.category);
    return data.filter(i => activeFilters.length === 0 || activeFilters.indexOf(i.category) >= 0);
  }

  showLecture(data) {
    const title = el('h2', data.title);
    title.classList.add('list__lecture__title');
    const category = el('span', data.category);
    category.classList.add('list__lecture__category');
    const image = el('div');
    image.classList.add('list__lecture__image');
    if (data.thumbnail) {
      const img = el('img');
      img.setAttribute('src', data.thumbnail);
      img.setAttribute('alt', '');
      image.appendChild(img);
    } else {
      image.classList.add('list__lecture__image--empty');
    }
    const textElements = el('div', category, title);
    textElements.classList.add('list__lecture__texts');
    const text = el('div', textElements);
    text.classList.add('list__lecture__text');
    if (data.finished) {
      const finished = el('div', '✓');
      finished.classList.add('list__lecture__finished');
      text.appendChild(finished);
    }
    const item = el('a', image, text);
    item.classList.add('list__lecture');
    item.setAttribute('href', `fyrirlestur.html?slug=${data.slug}`);
    return item;
  }

  showLectures(data) {
    const items = data.map((item) => {
      const col = el('div', this.showLecture(item));
      col.classList.add('list__col');
      return col;
    });
    const row = el('div', ...items);
    row.classList.add('list__row');
    this.makeContent(row);
  }

  activateFilter(event) {
    const { target } = event;
    target.classList.toggle('filters__filter--active');
    this.loadLectures()
      .then(data => this.addSavedLectures(data.lectures))
      .then(data => this.filteredLectures(data))
      .then(data => this.showLectures(data))
      .catch((error) => {
        console.error(error);
        this.makeError(error.message);
      });
  }

  createFilters() {
    this.filters.forEach((filter) => {
      filter.addEventListener('click', this.activateFilter.bind(this));
    });
  }

  load() {
    /* empty(this.container); */
    this.loadLectures()
      .then(data => this.addSavedLectures(data.lectures))
      .then(data => this.filteredLectures(data))
      .then(data => this.showLectures(data))
      .catch((error) => {
        console.error(error);
        this.makeError(error.message);
      });

    this.createFilters();
  }
}
