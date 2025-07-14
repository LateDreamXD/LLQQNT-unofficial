function disableItem(itemEl, disable) {
	itemEl.toggleAttribute('is-disabled', !!disable);
	return itemEl;
}

export default function createElement(feature, config, parent, callback) {
	/** @type {HTMLElement} */
	const el = document.createElement(feature.data.type);

	switch (feature.data.type) {
		case 'setting-switch':
			config[feature.data.key] && el.toggleAttribute('is-active');
			if (feature.disabled) {
				disableItem(parent, true);
				parent.title = feature.disabledReason || '功能暂未开放'; // input.title 不显示
				break;
			}
			if (feature.requires?.length > 0) {
				const requires = feature.requires.map((key) => config[key]);
				disableItem(parent, requires.includes(false));
				parent.title = `依赖于: ${feature.requires.map((key) => key).join('、')}`;
				break;
			}
			el.addEventListener('click', () => {
				el.toggleAttribute('is-active', !el.hasAttribute('is-active'));
				config[feature.data.key] = el.hasAttribute('is-active');
				callback();
			});
			break;
		default:
			break;
	}
	if (parent) parent.appendChild(el);
	return el;
}