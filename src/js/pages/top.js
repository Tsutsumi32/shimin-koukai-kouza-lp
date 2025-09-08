import { initPage } from "../core/initPage.js";

export const init = () => {
  initPage();
  mvAnimation();
}

const mvAnimation = () => {
  const text = document.querySelector('.js_mv_text');
  const decorations = document.querySelectorAll('.js_mv_decoration');
  const textTime = 800;
  const decorationDelayTime = 200;

  text.classList.add('is_active');

  setTimeout(() => {
    decorations.forEach((item, index) => {
      const delay = item.getAttribute('data-delay');
      setTimeout(() => {
        item.classList.add('is_active');
      }, delay * decorationDelayTime)
    });
  }, textTime)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
