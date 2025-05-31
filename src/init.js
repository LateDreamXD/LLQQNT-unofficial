const path = require('path');
const fs = require('fs');
require("./liteloader_api/main.js");
require("./loader_core/plugin_loader.js");
require("./main.js");
require('./uno_api/main.js');

const version = LiteLoader.package.qqnt.buildVersion;
const app_launcher_path = path.join(process.resourcesPath, "app/app_launcher/");

if(!fs.existsSync(app_launcher_path)) {
    fs.mkdirSync(app_launcher_path, {recursive: true});
    fs.cpSync(
        `${LiteLoader.path.root}/src/app_launchers/34xxx/app_launcher/`,
        app_launcher_path,
        {recursive: true}
    );
}

require(`${app_launcher_path}/index.js`);

setImmediate(() => {
    global.launcher.installPathPkgJson.main = (() => {
        if (version >= 29271) return "./application.asar/app_launcher/index.js";
        if (version >= 28060) return "./application/app_launcher/index.js";
        return "./app_launcher/index.js";
    })();
});