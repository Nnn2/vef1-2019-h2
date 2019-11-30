const SAVED_KEY = 'saved_lectures';

export function getSavedLectures() {
    const savedLectures = localStorage.getItem(SAVED_KEY);
    const saved = JSON.parse(savedLectures) || [];
    return saved;
}

export function saveLecture(slug) {
  const saved = getSavedLectures();
  const index = saved.indexOf(slug);
  if (index < 0) {
    saved.push(slug);
  } else {
    saved.splice(index, 1);
  }
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
}
