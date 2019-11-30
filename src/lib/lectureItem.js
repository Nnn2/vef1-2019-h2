import { el } from './helpers';

function item(type, ...data) {
  const content = el('div', ...data);
  content.classList.add('item__content');
  const typeOfItem = el('div', content);
  typeOfItem.classList.add('item', `item--${type}`);
  return typeOfItem;
}

export function heading(data) {
    const element = el('h3', data);
    element.classList.add('item__heading');
    return item('heading', element);
}

export function text(data) {
  const split = data.split('\n');
  const texts = split.map((t) => {
    const p = el('p', t);
    p.classList.add('item__text');
    return p;
  });
  return item('text', ...texts);
}

export function quote(data, attribute) {
  const qText = el('p', data);
  qText.classList.add('item__quote');
  const qAttribute = el('p', attribute);
  qAttribute.classList.add('item__attribute');
  const block = el('blockquote', qText, qAttribute);
  return item('blockquote', block);
}

export function image(data, caption) {
    const image = el('img');
    image.classList.add('image__img');
    image.setAttribute('alt', caption);
    image.setAttribute('src', data);
    const imageCaption = el('p', caption);
    imageCaption.classList.add('item__caption');
    const fullImage = el('div', image, imageCaption);
    return item('image', fullImage);
  }

export function list(data) {
  const items = data.map((i) => {
    const li = el('li', i);
    li.classList.add('item__li');
    return li;
  });
  const ul = el('ul', ...items);
  ul.classList.add('item__ul');
  return item('list', ul);
}

export function youtube(url) {
    const frame = el('frame');
    frame.classList.add('item__frame');
    frame.setAttribute('src', url);
    frame.setAttribute('frameborder', 0);
    frame.setAttribute('allowfullscreen', true);
    return item('youtube', frame);
  }

export function code(data) {
  const element = el('pre', data);
  element.classList.add('item__code');
  return item('code', element);
}
