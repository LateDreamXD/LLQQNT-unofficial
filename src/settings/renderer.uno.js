import modules from './uno.modules/modules.json' with {type: 'json'};
import defaultConfig from '../uno/default.json' with {type: 'json'};

class UnoSettings {
	/** @type {HTMLElement} */
	view;
	/** @type {defaultConfig} */
	config;
	/** @deprecated */
	loaded_modules = [];

	constructor(view) {
		const customStyle = document.createElement('style');
		customStyle.innerHTML = `
			setting-panel .subtitle {
				font-size: 14px;
				font-weight: 500;
				padding-top: 8px;
				padding-bottom: 4px;
				opacity: 0.95;
			}`;
		view.appendChild(customStyle);
		this.view = view;
		this.init();
	}

	async init() {
		this.config = await (await LiteLoader.api.config.get('uno_api', defaultConfig));

		modules.forEach(async(module) => {
			const mod = await import(`./uno.modules/${module.id}.js`);
			this.load_module(module, mod);
		});
	}

	save_config = () => LiteLoader.api.config.set('uno_api', this.config);

	/** @param {{name: string, detail: string, id: string, color?: string} module  */
	load_module(module, mod) {
		const panel = document.createElement('setting-panel');
		const node = document.createElement('setting-list');
		node.dataset.direction = 'column';
		panel.appendChild(node);
		const subtitle = document.createElement('span');
		subtitle.classList.add('subtitle');
		subtitle.textContent = module.name;
		subtitle.title = module.detail;
		subtitle.style.color = module.color || 'inherit';
		node.appendChild(subtitle);
		mod.injectUno(this, node);
		this.view.appendChild(panel);
	}
}

export default UnoSettings;