// fadeAnimation.js の内容
const fadeIn = (element, duration = 300, display = true) => {
	// element.style.opacity = 0;
	display && (element.style.display = "block");
	const startTime = performance.now();
	const animation = currentTime => {
		const elapsedTime = currentTime - startTime;
		const progress = Math.min(elapsedTime / duration, 1); // 0～1の範囲に制限
		element.style.opacity = progress;
		if (progress < 1) {
			requestAnimationFrame(animation);
		}
	}
	requestAnimationFrame(animation);
}

const fadeOut = (element, duration = 300, display = true) => {
	const startTime = performance.now();
	const animation = currentTime => {
		const elapsedTime = currentTime - startTime;
		const progress = Math.min(elapsedTime / duration, 1); // 0～1の範囲に制限
		element.style.opacity = 1 - progress;

		if (progress < 1) {
			requestAnimationFrame(animation);
		} else {
			// 完全に透明になったら非表示
			display && (element.style.display = "none");
		}
	}

	requestAnimationFrame(animation);
}

// setUpScrollTrigger.js の内容
const setUpScrollTrigger = configs => {
  configs.forEach(config => {
		setupMultipleTriggerRegions({
			...config
		});
	});
}

const setupMultipleTriggerRegions = ({
	startSelector,       // 例: '#start1' or '.start'
	endSelector = null,  // 例: '#end1' or '.end'
	targetSelector,      // 例: '#target' or '.target'
	mode = 'target',
	anchor = { position: 'center', offset: 0 },
	startAnchor = { position: 'top', offset: 0 },
	endAnchor = { position: 'bottom', offset: 0 },
	rangeMode = 'between',
	once = true,
	onEnter = (index, elements) => { },
	onOut = (index, elements) => { },
}) => {
	const startEls = document.querySelectorAll(startSelector);
	const endEls = endSelector ? document.querySelectorAll(endSelector) : [];
	const targetEls = document.querySelectorAll(targetSelector);

	// 複数ターゲットに対応（または最初の1つにする）
	const getTargetEl = (i) => {
		if (targetEls.length === 1) return targetEls[0];
		return targetEls[i] || targetEls[targetEls.length - 1];
	};

	startEls.forEach((startEl, i) => {
		const endEl = endSelector ? endEls[i] || endEls[endEls.length - 1] : null;
		const targetEl = getTargetEl(i);

		setupTriggerBetweenElements({
			mode,
			anchor,
			startAnchor,
			endAnchor,
			startEl,
			endEl,
			targetEl,
			rangeMode,
			once,
			onEnter: () => onEnter(i, { startEl, endEl, targetEl }),
			onOut: () => onOut(i, { startEl, endEl, targetEl }),
		});
	});
}

const setupTriggerBetweenElements = ({
	startEl,
	endEl = null,
	targetEl,
	mode = 'scroll',
	anchor = { position: 'center', offset: 0 },
	startAnchor = { position: 'top', offset: 0 },
	endAnchor = { position: 'top', offset: 0 },
	rangeMode = 'between', // 'between' or 'after'
	once = true,
	onEnter = () => { },
	onOut = () => { }
}) => {
	const getElementY = (el, anchor) => {
		const rect = el.getBoundingClientRect();
		const scrollY = window.scrollY;
		const base = {
			top: rect.top,
			center: rect.top + rect.height / 2,
			bottom: rect.bottom,
		}[anchor.position || 'top'];
		return scrollY + base + (anchor.offset || 0);
	};

	const getViewportY = (anchor) => {
		const scrollY = window.scrollY;
		const base = {
			top: 0,
			center: window.innerHeight / 2,
			bottom: window.innerHeight,
		}[anchor.position || 'center'];
		return scrollY + base + (anchor.offset || 0);
	};

	let hasFired = false;

	const handleCheck = () => {
		const startY = getElementY(startEl, startAnchor);
		const endY = endEl ? getElementY(endEl, endAnchor) : null;

		let checkY = mode === 'scroll'
			? getViewportY(anchor)
			: getElementY(targetEl, anchor);

		let isInRange = false;

		if (rangeMode === 'between') {
			if (!endEl) return;
			isInRange = checkY >= startY && checkY <= endY;
		} else if (rangeMode === 'after') {
			isInRange = checkY >= startY;
		}

		if (isInRange && !hasFired) {
			onEnter();
			hasFired = true;
		}

		if (!isInRange && (!once && hasFired)) {
			onOut();
			hasFired = false;
		}
	};

	window.addEventListener('scroll', handleCheck);

	// resizeはdebounceで最適化（任意）
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(handleCheck, 100);
	});

	// 初回チェック
	handleCheck();
}

// scrollTrrigerFadeAnimation.js の内容
const initScrollTriggerFadeAnimation = () => {
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

// initPage.js の内容
const initPage = () => {
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

// top.js の内容
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

const init = () => {
  initPage();
  mvAnimation();
}

// DOMContentLoaded イベントの処理
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
