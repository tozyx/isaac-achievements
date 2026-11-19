# 以撒的结合成就清单

简体中文 · [English](README.en.md)

《以撒的结合》玩家自制网页，收录 641 项成就。你可以查找解锁条件、记录完成进度，也可以从 Steam 或本地存档导入。

[在线使用（支持 Steam 导入）](https://isaac641.pages.dev/) · [GitHub Pages 静态版](https://tozyx.github.io/isaac-achievements/) · [问题反馈](https://github.com/tozyx/isaac-achievements/issues)

## 使用方法

- **记录进度**：按角色、挑战、关卡等分类浏览，搜索成就名或解锁条件，并勾选已完成的成就。可以给成就设置优先级，以及导入或导出优先级预设。
- **导入存档**：点「导入成就」，选择本地游戏存档，例如 `rep_persistentgamedata1.dat`。存档在浏览器内解析。
- **从 Steam 导入**：在同一面板粘贴 Steam 个人资料链接、17 位 SteamID64 或自定义短链。Steam 隐私设置中的「游戏详情」需要公开。默认保留现有勾选并合并 Steam 进度。取消勾选「保留当前已勾选的成就」会用 Steam 结果替换当前清单的完成记录。
- **查看道具图鉴**：点右下角的「道具」，查找道具、饰品、卡牌、符文和胶囊。搜索支持名称、ID、别名和拼音。

完成记录保存在当前浏览器和网站地址下。换浏览器、换域名或清除站点数据后，原有记录不会出现在新环境中。离线使用依赖已缓存的资源，Steam 导入需要联网，并会将你输入的 Steam 资料链接或 ID 发给代理用于查询。

## 本地运行

使用 Node.js 24 和 npm，在仓库根目录执行：

```sh
npm ci
npm run dev
```

打开终端显示的地址。运行 `npm test` 执行测试，或运行 `npm run preview-api` 在本地预览前端和 Steam API。网页通过 HTTP 加载图集和 JSON 数据。

## 部署

| 平台 | 配置 |
| --- | --- |
| Cloudflare Pages | 连接仓库，生产分支设为 `main`，构建命令填 `npm run build`，输出目录填 `build`。启用 Git 自动部署后，推送到生产分支会触发更新。 |
| GitHub Pages | 在 **Settings → Pages** 将发布源设为 **GitHub Actions**，使用 `Deploy GitHub Pages` 工作流构建静态站点。 |

GitHub Pages 静态版可使用清单、图鉴和本地存档导入。Steam 在线导入需要 Cloudflare Pages Functions 提供 `/api/steam`。如需在静态版上使用单独部署的代理，可在该页面的浏览器控制台设置代理来源，再刷新页面：

```js
localStorage.setItem('isaac_steam_proxy', 'https://your-project.pages.dev');
location.reload();
```

网页入口是 `index.html`。图集、图鉴数据和离线缓存脚本位于 `public/`，Steam 代理位于 `functions/` 和 `lib/hono/`，构建和数据生成脚本位于 `scripts/`。

## 反馈与许可

请通过网页工具栏的「问题反馈」或仓库 Issues 提交。问题报告和功能建议均提供双语模板，任选中文或英文填写即可。[GitHub Issues](https://github.com/tozyx/isaac-achievements/issues)

本项目基于 [Feather-bai/isaac-achievements](https://github.com/Feather-bai/isaac-achievements)，成就资料参考[灰机 Wiki](https://isaac.huijiwiki.com/wiki/成就)，物品资料与图标参考 [IsaacGuru](https://isaacguru.com/)，中文名称和描述参考 [External Item Descriptions](https://github.com/wofsauge/External-Item-Descriptions)。

本项目有权授权的软件代码和文档采用 [MIT 许可证](LICENSE)。第三方素材及数据适用其各自的权利与许可。
