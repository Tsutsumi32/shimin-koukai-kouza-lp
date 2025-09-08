import { initScrollTriggerFadeAnimation } from "../modules/scrollTrrigerFadeAnimation.js";


export function initPage() {
  initScrollTriggerFadeAnimation();

  // ontouchstart を body に設定
  document.body.setAttribute('ontouchstart', '');

  // img保存策
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    img.addEventListener('selectstart', function (e) {
      e.preventDefault();
    });
    img.addEventListener('mousedown', function (e) {
      e.preventDefault();
    });
  });
}