import { el, empty } from './helpers';
import { saveLecture, getSavedLectures } from './saved';
import {
  youtube, text, quote, list, code, heading, image,
} from './lectureItem';

export default class Lecture {
  constructor() {
    this.container = document.querySelector('.lecture');
    this.url = 'lectures.json';
  }

  loadLecture(slug) {
    return fetch(this.url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not get the lecture');
        }
        return res.json();
      })
      .then((data) => {
        const found = data.lectures.find(i => i.slug === slug);
        if (!found) {
          throw new Error('Could not find the lecture');
        }
        return found;
      });
  }

  makeContent(...content) {
    empty(this.container);
    content.forEach((item) => {
      const content = typeof item === 'string'
        ? document.createTextNode(item) : item;
      this.container.appendChild(content);
    });
  }

  makeError(error) {
    const header = this.makeHeader({ category: 'Error', title: error });
    const footer = this.makeFooter();
    this.makeContent(header, footer);
  }

  makeHeader(data) {
    const category = el('span', data.category);
    category.classList.add('header__category');
    const heading = el('h2', data.title);
    heading.classList.add('header__title');
    const header = el('div', category, heading);
    header.classList.add('header');
    if (data.image) {
      header.style.backgroundImage = `url(${data.image})`;
    }
    return header;
  }

  fillContent(content) {
    const col = el('div');
    col.classList.add('lecture__col');
    const row = el('div', col);
    row.classList.add('lecture__row');
    const lectureContent = el('div', row);
    lectureContent.classList.add('lecture__content');
    content.forEach((i) => {
      let item;
      switch (i.type) {
        case 'heading':
            item = heading(i.data);
            break;
        case 'text':
            item = text(i.data);
            break;    
        case 'quote':
            item = quote(i.data, i.attribute);
            break;
        case 'image':
            item = image(i.data, i.caption);
            break;        
        case 'list':
            item = list(i.data);
            break;
        case 'youtube':
            item = youtube(i.data);
            break;
        case 'code':
            item = code(i.data);
            break;
        default:
            item = el('div', i.type);
      }

      col.appendChild(item);
    });
    return lectureContent;
  }

  makeFooter(slug, finished) {
    const finish = el('button', finished ? '✓ Fyrirlestur kláraður' : 'Klára fyrirlestur');
    finish.classList.add('lecture__finish');
    if (finished) {
      finish.classList.add('lecture__finish--finished');
    }
    finish.addEventListener('click', this.markFinished.bind(this, slug));
    const goBack = el('a', 'Til baka');
    goBack.classList.add('lecture__goBack');
    goBack.setAttribute('href', '/');
    const footer = el('footer', finish, back);
    footer.classList.add('lecture__footer');
    return footer;
  }

  markFinished(slug, element) {
    const { target } = element;
    const isFinished = target.classList.contains('lecture__finish--finished');
    if (isFinished) {
      target.textContent = 'Klára fyrirlestur';
    } else {
      target.textContent = '✓ Fyrirlestur kláraður';
    }
    target.classList.toggle('lecture__finish--finished');
    saveLecture(slug, !isFinished);
  }

  checkFinished(slug) {
    const saved = loadSavedLectures();
    return saved.indexOf(slug) >= 0;
  }

  showLecture(data) {
    const header = this.makeHeader(data);
    const content = this.fillContent(data.content);
    const footer = this.makeFooter(data.slug, this.checkFinished(data.slug));
    this.makeContent(header, content, footer);
  }

  load() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (!slug || slug === '') {
      this.makeError('Lecture not defined');
      return;
    }

    this.loadLecture(slug)
      .then(data => this.showLecture(data))
      .catch((error) => {
        console.error(error);
        this.makeError(error.message);
      });
  }
}