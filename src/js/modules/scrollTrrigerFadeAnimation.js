import { setUpScrollTrigger } from "../utils/setUpScrollTrigger.js";

export const initScrollTriggerFadeAnimation = () => {
  const flowItems = document.querySelectorAll('.js_fade');

  if (!flowItems) return;

  const animeFadeConfig = {
    initial: {
      opacity: '0',
    },
    active: {
      opacity: '1',
    },
    transition: 'opacity .8s ease-in-out'
  };

  const animeFadeInit = el => {
    Object.assign(el.style, animeFadeConfig.initial);
    el.style.transition = animeFadeConfig.transition;
  }

  const animeFade = el => {
    Object.assign(el.style, animeFadeConfig.active);
  }

  const scrollAnimationConfig = [
    // 初期表示
    {
      startSelector: '.js_fade',
      mode: 'scroll',
      anchor: { position: 'bottom', offset: 0 },
      startAnchor: { position: 'top', offset: 130 },
      // endAnchor: { position: 'bottom', offset: 0 },
      rangeMode: 'after',
      once: false,
      onEnter: (index, { startEl }) => {
        animeFade(startEl);
      },
      onOut: (index, { startEl }) => {
        animeFadeInit(startEl);
      },
    },
  ]

  flowItems.forEach(item => {
      animeFadeInit(item);
    })

  // 初期で見えているもの対処で数秒遅らせる
  setTimeout(() => {
    setUpScrollTrigger(scrollAnimationConfig);
  }, 400)
}