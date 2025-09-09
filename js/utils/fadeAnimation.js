export const fadeIn = (element, duration = 300, display = true) => {
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

export const fadeOut = (element, duration = 300, display = true) => {
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