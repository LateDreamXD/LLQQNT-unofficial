import default_config from "./static/config.json" with {type: "json"};


export class SettingInterface {
    #liteloader_nav_bar = document.createElement("div");
    #liteloader_setting_view = document.createElement("div");
    #setting_view = document.querySelector(".setting-main .q-scroll-view");
    #setting_title = document.querySelector(".setting-main .setting-title");

    constructor() {
        this.#liteloader_nav_bar.classList.add("nav-bar", "liteloader");
        this.#liteloader_setting_view.classList.add("q-scroll-view", "scroll-view--show-scrollbar", "liteloader");
        this.#liteloader_setting_view.style.display = "none";
        document.querySelector(".setting-tab").append(this.#liteloader_nav_bar);
        document.querySelector(".setting-main .setting-main__content").append(this.#liteloader_setting_view);
        document.querySelector(".setting-tab").addEventListener("click", event => {
            const nav_item = event.target.closest(".nav-item");
            if (nav_item) {
                // 内容显示
                if (nav_item.parentElement.classList.contains("liteloader")) {
                    this.#setting_view.style.display = "none";
                    this.#liteloader_setting_view.style.display = "block";
                }
                else {
                    this.#setting_view.style.display = "block";
                    this.#liteloader_setting_view.style.display = "none";
                }
                // 重新设定激活状态
                this.#setting_title.childNodes[1].textContent = nav_item.querySelector(".name").textContent;
                document.querySelectorAll(".setting-tab .nav-item").forEach(element => {
                    element.classList.remove("nav-item-active");
                });
                nav_item.classList.add("nav-item-active");
            }
        });
    }

    add(plugin) {
        const default_thumb = `local://root/src/settings/static/default.svg`;
        const plugin_thumb = `local:///${plugin.path.plugin}/${plugin.manifest?.thumb}`;
        const thumb = plugin.manifest.thumb ? plugin_thumb : default_thumb;
        const nav_item = document.querySelector(".setting-tab .nav-item").cloneNode(true);
        const view = document.createElement("div");
        nav_item.classList.remove("nav-item-active");
        nav_item.setAttribute("data-slug", plugin.manifest.slug);
        appropriateIcon(thumb).then(async text => nav_item.querySelector(".q-icon").innerHTML = text);
        nav_item.querySelector(".name").textContent = plugin.manifest.name;
        nav_item.addEventListener("click", event => {
            if (!event.currentTarget.classList.contains("nav-item-active")) {
                this.#liteloader_setting_view.textContent = null;
                this.#liteloader_setting_view.append(view);
            }
        });
        this.#liteloader_nav_bar.append(nav_item);
        view.classList.add("tab-view", plugin.manifest.slug);
        return view;
    }

    SettingInit() {
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.type = "text/css";
        style.href = "local://root/src/settings/static/style.css";
        document.head.append(style);
        const view = this.add({
            manifest: {
                slug: "config_view",
                name: "LLQQNTuno",
                thumb: "./src/settings/static/default.svg"
            },
            path: {
                plugin: LiteLoader.path.root
            }
        });
        fetch("local://root/src/settings/static/view.html").then(async res => {
            view.innerHTML = await res.text();
            initVersions(view);
            initPluginList(view);
            initPath(view);
            initUno(view);
            initAbout(view);
        });
    }

    createErrorView(error, slug, view) {
        const navItem = document.querySelector(`.nav-item[data-slug="${slug}"]`);
        navItem.classList.add("error");
        navItem.title = "插件加载出错";

        view.classList.add("error");
        view.innerHTML =
            `<h2>🙀 插件加载出错！</h2>
            <p>可能是版本不兼容、Bug、冲突或文件损坏等导致的</p>
            🐞 错误信息
            <textarea readonly rows="8">${error.message}\n${error.stack}</textarea>
            🧩 插件信息
            <textarea readonly rows="12">${JSON.stringify(LiteLoader.plugins[slug])}</textarea>
            <textarea readonly rows="3">${JSON.stringify(Object.keys(LiteLoader.plugins))}</textarea>
            🖥️ 环境信息
            <textarea readonly rows="3">${JSON.stringify({ ...LiteLoader.versions, ...LiteLoader.os })}</textarea>
            <small>* 此页面仅在插件加载出现问题出现，不代表插件本身有设置页</small>`; // 没必要格式化json，方便截图
    }
}


async function appropriateIcon(pluginIconUrlUsingLocalPotocol) {
    if (pluginIconUrlUsingLocalPotocol.endsWith('.svg')) {
        return await (await fetch(pluginIconUrlUsingLocalPotocol)).text();
    } else {
        return `<img src="${pluginIconUrlUsingLocalPotocol}"/>`;
    }
}


async function initVersions(view) {
    const liteloader = view.querySelectorAll(".versions .current .liteloader setting-text");
    const qqnt = view.querySelectorAll(".versions .current .qqnt setting-text");
    const electron = view.querySelectorAll(".versions .current .electron setting-text");
    const chromium = view.querySelectorAll(".versions .current .chromium setting-text");
    const nodejs = view.querySelectorAll(".versions .current .nodejs setting-text");

    liteloader[1].textContent = LiteLoader.versions.liteloader;
    qqnt[1].textContent = LiteLoader.versions.qqnt;
    electron[1].textContent = LiteLoader.versions.electron;
    chromium[1].textContent = LiteLoader.versions.chrome;
    nodejs[1].textContent = LiteLoader.versions.node;

    const title = view.querySelector(".versions .new setting-text");
    const update_btn = view.querySelector(".versions .new setting-button");

    const jump_link = () => LiteLoader.api.openExternal(update_btn.value);
    const try_again = () => {
        // 初始化 显示
        title.textContent = "正在瞅一眼 LLQQNTuno 是否有新版本";
        update_btn.textContent = "你先别急";
        update_btn.value = null;
        update_btn.removeEventListener("click", jump_link);
        update_btn.removeEventListener("click", try_again);
        // 检测是否有新版
        const repo_url = LiteLoader.package.liteloader.repository.url;
        const release_latest_url = `${repo_url.slice(0, repo_url.lastIndexOf(".git"))}/releases/latest`;
        fetch(release_latest_url).then((res) => {
            const new_version = res.url.slice(res.url.lastIndexOf("/") + 1);
            // 比较版本号
            const compareVersions = (v1, v2) => {
                const v1Parts = v1.split(/[.-]/).map(part => isNaN(part) ? 0 : Number(part));
                const v2Parts = v2.split(/[.-]/).map(part => isNaN(part) ? 0 : Number(part));
                for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
                    const p1 = v1Parts[i] || 0;
                    const p2 = v2Parts[i] || 0;
                    if (p1 !== p2) return p1 < p2;
                }
                return false;
            };
            // 有新版
            if (compareVersions(LiteLoader.versions.liteloader, new_version)) {
                title.textContent = `发现新版本 ${new_version}`;
                update_btn.textContent = "去瞅一眼";
                update_btn.value = res.url;
                update_btn.removeEventListener("click", try_again);
                update_btn.addEventListener("click", jump_link);
            }
            // 没新版
            else {
                title.textContent = "暂未发现新版本，目前已是最新";
                update_btn.textContent = "再瞅一眼";
                update_btn.value = null;
                update_btn.removeEventListener("click", jump_link);
                update_btn.addEventListener("click", try_again);
            }
        }).catch((e) => {
            title.textContent = `啊嘞, 检查更新失败了... (${e})`;
            update_btn.textContent = "再试一次";
            update_btn.value = null;
            update_btn.removeEventListener("click", jump_link);
            update_btn.addEventListener("click", try_again);
        });
    };

    try_again();
}


async function initPluginList(view) {
    const plugin_item_template = view.querySelector("#plugin-item");
    const plugin_install_button = view.querySelector(".plugins .plugin .install setting-button");
    const plugin_loader_switch = view.querySelector(".plugins .plugin .loader setting-switch");
    const plugin_lists = {
        extension: view.querySelector(".plugins .extension"),
        theme: view.querySelector(".plugins .theme"),
        framework: view.querySelector(".plugins .framework"),
    };

    const input_file = document.createElement("input");
    input_file.type = "file";
    input_file.accept = ".zip,.json";
    input_file.addEventListener("change", async () => {
        const filepath = input_file.files?.[0]?.path;
        const config = await LiteLoader.api.config.get("LiteLoader", default_config);
        const has_install = Object.values(config.installing_plugins).some(item => item.plugin_path == filepath);
        const is_install = await LiteLoader.api.plugin.install(filepath, has_install);
        alert(is_install ? (has_install ? "已取消安装此插件" : "将在下次启动时安装") : "无效插件, 安装失败");
        input_file.value = null;
    });
    plugin_install_button.addEventListener("click", () => input_file.click());

    const config = await LiteLoader.api.config.get("LiteLoader", default_config);
    plugin_loader_switch.toggleAttribute("is-active", config.enable_plugins);
    plugin_loader_switch.addEventListener("click", () => {
        const isActive = plugin_loader_switch.hasAttribute("is-active");
        plugin_loader_switch.toggleAttribute("is-active", !isActive);
        config.enable_plugins = !isActive;
        LiteLoader.api.config.set("LiteLoader", config);
    });

    const plugin_counts = {
        extension: [0, 0],
        theme: [0, 0],
        framework: [0, 0],
        total: [0, 0]
    }

    for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
        // 跳过不兼容插件
        if (plugin.incompatible) {
            continue;
        }

        const default_icon = `local://root/src/settings/static/default.png`;
        const plugin_icon = `local:///${plugin.path.plugin}/${plugin.manifest?.icon}`;
        const icon = plugin.manifest?.icon ? plugin_icon : default_icon;

        const plugin_list = plugin_lists[plugin.manifest.type] || plugin_lists.extension;
        const plugin_item = plugin_item_template.content.cloneNode(true);

        const plugin_item_icon = plugin_item.querySelector(".icon");
        const plugin_item_name = plugin_item.querySelector(".name");
        const plugin_item_description = plugin_item.querySelector(".description");
        const plugin_item_version = plugin_item.querySelector(".version");
        const plugin_item_authors = plugin_item.querySelector(".authors");
        const plugin_item_repo = plugin_item.querySelector(".repo");
        const plugin_item_manager = plugin_item.querySelector(".manager");
        const plugin_item_manager_modal = plugin_item.querySelector(".manager-modal");
        const manager_modal_enable = plugin_item_manager_modal.querySelector(".enable");
        const manager_modal_delete_data = plugin_item_manager_modal.querySelector(".delete-data");
        const manager_modal_uninstall = plugin_item_manager_modal.querySelector(".uninstall");
        const manager_modal_keep_data = plugin_item_manager_modal.querySelector(".keep-data");

        plugin_item_icon.innerHTML = await appropriateIcon(icon);
        plugin_item_name.textContent = plugin.builtin?
            `${plugin.manifest.name} (内置)`:
            plugin.manifest.name;
        plugin_item_name.title = plugin.manifest.name;
        plugin_item_description.textContent = plugin.manifest.description;
        plugin_item_description.title = plugin.manifest.description;

        const version_link = document.createElement("setting-link");
        version_link.textContent = plugin.manifest.version;
        plugin_item_version.append(version_link);

        plugin.manifest.authors?.forEach((author, index, array) => {
            const author_link = document.createElement("setting-link");
            author_link.textContent = author.name;
            author_link.dataset["value"] = author.link;
            plugin_item_authors.append(author_link);
            if (index < array.length - 1) {
                plugin_item_authors.append(" | ");
            }
        });

        if (plugin.manifest.repository) {
            const { repo, branch } = plugin.manifest.repository
            const repo_link = document.createElement("setting-link");
            repo_link.textContent = repo;
            repo_link.dataset["value"] = `https://github.com/${repo}/tree/${branch}`;
            plugin_item_repo.append(repo_link);
        } else plugin_item_repo.textContent = "🈚";

        plugin_item_manager_modal.dataset["title"] = plugin.manifest.name;

        plugin_item_manager.addEventListener("click", () => {
            plugin_item_manager_modal.toggleAttribute("is-active");
        });

        manager_modal_enable.toggleAttribute('is-disabled',
            !!plugin.builtin && plugin.manifest.type === 'framework');
        manager_modal_enable.toggleAttribute("is-active", !config.disabled_plugins.includes(slug));
        manager_modal_enable.addEventListener("click", () => {
            const isActive = manager_modal_enable.hasAttribute("is-active");
            manager_modal_enable.toggleAttribute("is-active", !isActive);
            LiteLoader.api.plugin.disable(slug, !isActive);
        });

        manager_modal_delete_data.toggleAttribute('is-disabled', !!plugin.builtin);
        manager_modal_delete_data.addEventListener('click', () => {
            if(!confirm(`(→_→) ? 确定删除插件 ${plugin.manifest.name} 全部数据?`))
                return;
            if(Object.prototype.hasOwnProperty.call(LiteLoader.plugins, 'uno_api')) {
                LLQQNTuno.api.plugin.rmdata(slug);
                alert(`已删除 ${plugin.manifest.name} 全部数据`);
            } else {
                alert('xwx 请先安装 LLQQNT-uno_api !');
            }
        });

        manager_modal_keep_data.toggleAttribute('is-disabled', !!plugin.builtin);
        if(!!config.deleting_plugins?.[slug])
            manager_modal_keep_data.toggleAttribute('is-active',
            !config.deleting_plugins?.[slug]?.data_path);
        manager_modal_keep_data.addEventListener('click', async() => {
            const config = await LiteLoader.api.config.get("LiteLoader", default_config);
            manager_modal_keep_data.toggleAttribute("is-active");
            config.deleting_plugins[slug].data_path = manager_modal_keep_data.hasAttribute("is-active")?
                null : plugin.path.data;
            LiteLoader.api.config.set("LiteLoader", config);
        });

        manager_modal_uninstall.toggleAttribute('is-disabled', !!plugin.builtin);
        manager_modal_uninstall.toggleAttribute("is-active", !!config.deleting_plugins?.[slug]);
        manager_modal_uninstall.addEventListener("click", () => {
            manager_modal_uninstall.toggleAttribute("is-active");
            const keepdata = manager_modal_keep_data.hasAttribute("is-active");
            LiteLoader.api.plugin.delete(slug, !keepdata, !manager_modal_uninstall.hasAttribute("is-active"));
        });

        plugin_list.append(plugin_item);

        plugin.disabled? plugin_counts.total[1]++:
            plugin_counts.total.forEach((n, i) => plugin_counts.total[i]++);
        plugin.disabled? plugin_counts[plugin.manifest.type][1]++:
            plugin_counts[plugin.manifest.type].forEach((n, i) => plugin_counts[plugin.manifest.type][i]++);
    }

    plugin_lists.extension.dataset["title"] = `扩展 (${plugin_counts.extension.join('/')})`;
    plugin_lists.theme.dataset["title"] = `主题 (${plugin_counts.theme.join('/')})`;
    plugin_lists.framework.dataset["title"] = `依赖 (${plugin_counts.framework.join('/')})`;
}

async function initUno(view) {
    view = view.querySelector('#uno');
    const uno_config = await LiteLoader.api.config.get('llqqnt-uno');
    if(!Object.prototype.hasOwnProperty.call(LiteLoader.plugins, 'uno_api')) {
        if(uno_config.hide_uno_api_if_not_installed) {
            view.remove();
            return null;
        }
        view.innerHTML = `<style>#uno>.no-plugin{background-color: rgba(89, 89, 89, 0.25);backdrop-filter: blur(6px);border: 0px solid rgba(255, 255, 255, 0.18);box-shadow: rgba(14, 14, 14, 0.19) 0px 6px 15px 0px;border-radius: 12px;color: rgb(128, 128, 128);display:block;text-align:center;font-size:1.25em;padding-top:2em;padding-bottom:2em;margin-bottom:1em;}</style>
<div class="no-plugin">😿 未安装 Uno API 插件, 该功能不可用<br /><br />
<setting-button id="upgrade" data-type="primary">升级到完整版</setting-button>
<setting-button id="not-show" data-type="secondary">不再显示</setting-button></div>`;
        view.querySelector('#upgrade').addEventListener('click', () => LiteLoader.api.openExternal(`${LiteLoader.package.liteloader.repository.url.replace('.git', '')}/releases/latest`));
        view.querySelector('#not-show').addEventListener('click', () => {
            LiteLoader.api.config.set('llqqnt-uno', {...uno_config, hide_uno_api_if_not_installed: true});
            view.remove();
        });
        return null;
    }
    const uno = new (await import('./renderer.uno.js')).default(view);
    return uno;
}

async function initPath(view) {
    const root_path_content = view.querySelectorAll(".path .root setting-text")[2];
    const root_path_button = view.querySelector(".path .root setting-button");
    const profile_path_content = view.querySelectorAll(".path .profile setting-text")[2];
    const profile_path_button = view.querySelector(".path .profile setting-button");

    root_path_content.textContent = LiteLoader.path.root;
    root_path_button.addEventListener("click", () => LiteLoader.api.openPath(LiteLoader.path.root));
    profile_path_content.textContent = LiteLoader.path.profile;
    profile_path_button.addEventListener("click", () => LiteLoader.api.openPath(LiteLoader.path.profile));
}


async function initAbout(view) {
    const liteloaderqqnt = view.querySelector(".about .liteloaderqqnt");
    const github = view.querySelector(".about .github");

    liteloaderqqnt.addEventListener("click", () => LiteLoader.api.openExternal("https://liteloaderqqnt.github.io"));
    github.addEventListener('click', () => LiteLoader.api.openExternal('https://github.com/LateDreamXD/LLQQNT-unofficial'))
    view.querySelector('.about .github-upstream').addEventListener("click", () => LiteLoader.api.openExternal("https://github.com/LiteLoaderQQNT/LiteLoaderQQNT"));
    view.querySelector('.about .discord-channel').addEventListener('click', () => LiteLoader.api.openExternal('https://discord.gg/pv9NKPSsYZ'));

    // Hitokoto - 一言
    let visible = true;
    const hitokoto_text = view.querySelector(".about .hitokoto_text");
    const hitokoto_author = view.querySelector(".about .hitokoto_author");
    const observer = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
    });
    observer.observe(hitokoto_text);
    async function trueUpdate() {
        const { hitokoto, creator } = await (await fetch("https://v1.hitokoto.cn")).json();
        hitokoto_text.textContent = hitokoto;
        hitokoto_author.textContent = creator;
    }
    async function fetchHitokoto() {
        // 页面不可见或一言不可见时不更新
        if (document.hidden || !visible) {
            return;
        }
        await trueUpdate();
    };
    trueUpdate();
    setInterval(fetchHitokoto, 1000 * 15);
}
