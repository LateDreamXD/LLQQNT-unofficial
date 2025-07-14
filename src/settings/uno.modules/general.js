import createElement from '../utils/create_element.js';

const features = [
	{
		displayName: '拦截渲染进程 beacon',
		detail: '拦截腾讯发送 beacon 记录, 也许没什么用(逃',
		data: {key: 'prevent_beacon_report', type: 'setting-switch'}
	}
]

export function injectUno(ctx, node) {
	features.forEach(feature => {
		const item = document.createElement('setting-item');
		const content = document.createElement('div');
		const label = document.createElement('setting-text');
		label.textContent = feature.displayName;
		content.appendChild(label);
		const label2 = document.createElement('setting-text');
		label2.dataset.type = 'secondary';
		label2.textContent = feature.detail;
		content.appendChild(label2);
		item.appendChild(content);
		createElement(feature, ctx.config.general, item, ctx.save_config);
		node.appendChild(item);
	});
}