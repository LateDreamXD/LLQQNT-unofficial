import defaultConfig from './default.json' with {type: 'json'};

const config = LiteLoader.api.config.get('uno_api', defaultConfig);

if(config.general.prevent_beacon_report) {
	const originalSendBeacon = navigator.sendBeacon;
	navigator.sendBeacon = function(url, data) {
		return false;
	};
}