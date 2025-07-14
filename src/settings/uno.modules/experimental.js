import createElement from '../utils/create_element.js';

const features = [
	{
		displayName: '开启插件热加载',
		detail: '开启插件热加载功能, 即修改插件代码后, 无需重启即可生效',
		data: {key: 'enable_plugin_hotload', type: 'setting-switch'},
		disabled: true,
		disabledReason: '预计下个版本可用'
	},
	{
		displayName: '使用 UnoApi 进行插件安装',
		detail: '将插件安装过程改为使用 UnoApi 进行, 以实现插件安装后的热加载',
		data: {key: 'enable_plugin_install', type: 'setting-switch'},
		requires: ['enable_plugin_hotload']
	},
]


/**
 * 
 * @param {import('../renderer.uno').default} ctx 
 * @param {HTMLElement} node 
 */
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
		createElement(feature, ctx.config.experimental, item, ctx.save_config);
		node.appendChild(item);
	});
}
