export const setUpScrollTrigger = configs => {
  configs.forEach(config => {
		setupMultipleTriggerRegions({
			...config
		});
	});
}

export const setupMultipleTriggerRegions = ({
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