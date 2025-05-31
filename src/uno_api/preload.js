const {ipcRenderer, contextBridge} = require('electron');

function invokeUNO(name, method, args) {
	return ipcRenderer.invoke('LiteLoader.unofficial.api', name, method, args);
}

contextBridge.exposeInMainWorld('LLQQNTuno', {
	api: {
		plugin: {
			rmdata(...args) {return invokeUNO('plugin', 'rmdata', args);}
		}
	}
});
