const {join} = require('path');
const {existsSync} = require('fs');
require("./liteloader_api/main.js");
require("./loader_core/plugin_loader.js");
require("./main.js");

const version = LiteLoader.package.qqnt.buildVersion;
const app_launcher_path = join(process.resourcesPath, "app/app_launcher/");

if(existsSync(join(app_launcher_path, 'index.js')))
    require(join(app_launcher_path, 'index.js'));
else
    require('./app_launcher/index.js');

setImmediate(() => {
    global.launcher.installPathPkgJson.main = (() => {
        if (version >= 29271) return "./application.asar/app_launcher/index.js";
        if (version >= 28060) return "./application/app_launcher/index.js";
        return "./app_launcher/index.js";
    })();
});