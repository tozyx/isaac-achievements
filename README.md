# 以撒的结合 全成就完成清单

> 《The Binding of Isaac》全成就 / 全角色通关进度追踪工具 · 支持 Steam 成就导入与存档解析

一个开箱即用的静态网页工具，帮你逐项追踪《以撒的结合》**全部 641 项成就**的完成情况（含普通角色 242、堕化角色 119、其余成就 93、完成挑战 48、Boss 击败 38 等分类）。所有数据保存在浏览器本地，无需注册登录，离线可用。

**本 Fork 的 GitHub Pages 地址**：<https://tozyx.github.io/isaac-achievements/>（首次访问前需按下文完成部署）

**原项目**：[Feather-bai/isaac-achievements](https://github.com/Feather-bai/isaac-achievements) · **原作者在线版**：<https://isaac-achievement.19x19.top/>

---

## ✨ 功能特性

- **完整成就清单**：按 9 大分类整理全部 641 项成就（角色解锁 / 通关 / 挑战 / Boss 等），每条附解锁条件，点击可跳转灰机 Wiki 详情
- **进度追踪**：勾选即自动保存到浏览器 `localStorage`，下次打开进度还在
- **Steam 成就导入**：粘贴 Steam 资料链接 / 17 位 ID / 自定义短链，一键拉取已解锁成就自动勾选（两种模式）
- **存档导入**：直接导入游戏本地存档文件（`persistentgamedata2.dat`），自动解析已解锁成就
- **优先级标记**：自定义标记哪些成就「想先做」，导出 / 导入优先级预设
- **主题切换**：深色 / 浅色 / 跟随系统
- **道具图鉴**：右下角「道具」按钮打开，含道具 721 / 饰品 188 / 胶囊 50 / 卡牌·符文 97，支持首字母索引、ID 排序、品质筛选，以及精确/模糊两栏搜索（别名、拼音、错字）
- **回到上次位置**：从 wiki 返回后自动恢复标签页与滚动位置
- **完全离线**：单页应用，图标与图鉴数据随页面按需加载，缓存后可断网使用；支持 PWA 安装到主屏幕

## 🚀 快速使用

1. 打开[本 Fork 在线版](https://tozyx.github.io/isaac-achievements/)，或按下文启动本地 HTTP 预览；不要直接双击 `index.html`，外置图集和 JSON 数据需要通过 HTTP 加载
2. 对照清单勾选你已完成的成就
3. 想从 Steam 同步？先部署下文的 Steam 代理，再在「更多操作」里粘贴 Steam 资料链接，点 **从 Steam 导入**；只部署 GitHub Pages 时可使用手动勾选和本地存档导入
4. 定期导出备份，换设备时导入即可恢复

### Steam 导入支持两种模式

| 模式 | 说明 |
|---|---|
| **合并导入**（默认） | 保留你当前已勾选的，把 Steam 已解锁的并集打勾 |
| **完全同步** | 以 Steam 为准，Steam 未解锁的成就会被取消勾选 |

勾选「记住我的 Steam 账号」后，下次打开面板自动回填。

### 支持的输入格式

- 17 位 SteamID64（如 `76561198015863878`）
- Steam 资料页链接（`steamcommunity.com/profiles/<id>` / `/id/<name>`）
- 自定义 URL 名（如 `multiplayerachievements`）
- 传统 `STEAM_x:y:z`、SteamID3 `[U:1:n]`

## 🛠 技术说明

| 项目 | 说明 |
|---|---|
| **前端** | 单页应用：HTML / CSS / 成就数据内联在 `index.html`；图标图集与图鉴数据按需加载（`./assets/*`、`./data/*.json`），由 Service Worker 缓存；相对路径兼容域名根目录和 GitHub Pages 项目子目录 |
| **数据来源** | 成就条件参考[灰机 Wiki《以撒的结合》](https://isaac.huijiwiki.com/wiki/%E6%88%90%E5%B0%B1) |
| **进度存储** | 浏览器 `localStorage`（`isaac_achieve_state_v1`），清除浏览器数据会丢失，请定期导出备份 |
| **Steam 导入** | 通过 Cloudflare Pages Function 代理拉取 `steamcommunity.com` 成就数据（绕过浏览器跨域限制） |
| **部署** | GitHub Pages（静态页面）或 Cloudflare Pages（静态页面 + Steam 代理 Functions） |

### 架构

```
functions/api/[[routes]].ts    # API 入口（Hono）
lib/hono/service/steamService.ts   # Steam 成就代理逻辑
public/                        # 静态资源（sw.js / manifest / 图标）
public/assets/                 # 图标图集（成就 / 道具 / 饰品 / 卡牌 / 符文 / 胶囊）
public/data/                   # 图鉴数据 codex.json、成就拼音表 ach-py.json
scripts/                       # 数据抓取、图集生成、构建与测试脚本
.github/workflows/pages.yml    # 推送 main 后自动打包并部署 GitHub Pages
index.html                     # 网页本体（含成就数据）
wrangler.toml                  # Pages 部署配置（pages_build_output_dir = "build"）
```

> ⚠️ **隐私提示**：Steam 导入需要读取你的 Steam 成就数据。Steam 资料设为**公开**才能正常导入；若资料私密，会返回「成就私密」提示。进度与 Steam ID 均只保存在你自己的浏览器本地，不会上传到任何服务器。

## 📦 部署到 GitHub Pages

1. 将本地修改提交并推送到 `tozyx/isaac-achievements` 的 `main` 分支。
2. 打开 [Settings → Pages](https://github.com/tozyx/isaac-achievements/settings/pages)，将 **Build and deployment → Source** 设为 **GitHub Actions**。
3. 打开 [Actions](https://github.com/tozyx/isaac-achievements/actions)，查看 **Deploy GitHub Pages** 工作流。如果首次推送时还没有设置 Pages，可在设置完成后点击 **Run workflow** 重新部署；如果 fork 的 Actions 被禁用，先按页面提示启用。
4. 部署成功后访问 <https://tozyx.github.io/isaac-achievements/>。以后每次推送 `main` 都会自动更新。

工作流直接执行 `node scripts/build.mjs --static`（也可在本地执行 `npm run build:pages`），把 `index.html` 和 `public/` **里面的内容**合并到 `build/`，只上传静态产物。这个步骤仅依赖 Node.js，不需要安装 npm 依赖。

不要选择从 `main / (root)` 直接发布源码：图集在 `public/assets/` 中，直接发布时网页请求的 `assets/` 路径没有对应文件。`docs/` 是开发文档，也不是网站产物。

### 图标不显示的原因与排查

2026-11-18 的 v2 更新将成就和物品图集从 HTML 内嵌图片改为 `public/assets/` 下的外置资源。旧版只发布 `index.html` 就能显示图标，新版必须同时发布图集和数据。原先写死的 `/assets/...` 还会从域名根目录加载，在 `/isaac-achievements/` 项目路径下请求错误地址。

本 Fork 使用 `./assets/`、`./data/` 等相对路径，并按当前站点作用域加载 Service Worker 缓存及 PWA 资源，兼容子目录部署。`scripts/patch-html.mjs` 生成的图集预加载地址也保持相对路径。

- 打开浏览器开发者工具 → Network，确认 `isaac-achievements/assets/atlas-ach.png` 和 `isaac-achievements/data/codex.json` 返回 `200`。
- 若请求成了域名根目录的 `/assets/...`，检查线上是否已部署最新版本；若路径正确仍然 `404`，检查是否上传了完整的 `build/`。
- 部署后仍显示旧版，可先强制刷新。仍未更新时，在开发者工具 → Application → Service Workers 注销本站旧 worker，再刷新；不要清除 Local Storage，否则会删除本地成就进度。

### Steam 导入

GitHub Pages 不运行 `functions/` 中的后端代码。要使用 Steam 在线导入，请按下文部署自己的 Cloudflare Pages 服务，并在 GitHub Pages 网页的浏览器控制台设置：

```js
localStorage.setItem('isaac_steam_proxy', 'https://你的项目.pages.dev');
location.reload();
```

填写服务域名，不包含 `/api/steam`。不配置代理不影响手动勾选、本地存档导入和图鉴。

## 💻 本地开发 / Cloudflare 部署

安装 Node.js 24（含 npm）后，在仓库目录运行：

```bash
npm ci
npm run dev
```

打开终端输出的本地地址。Vite 会将 `public/` 的资源作为站点根目录提供；此模式只预览前端，Steam API 使用下面的 `preview-api` 或独立代理。

```bash
# 单元测试（SteamID 解析、成就 XML 解析等）
npm test

# Cloudflare 构建产物（生成 build/）
npm run build

# 本地预览（静态页 + API 一起跑）
npm run preview-api

# 部署到 Cloudflare Pages
npm run deploy
```

也可以把仓库推到 GitHub，在 Cloudflare Dashboard → **Workers & Pages → 创建 → Pages → 连接 Git 仓库**，构建命令填 `npm run build`，输出目录填 `build`，之后每次 push 自动重新部署。

## 📄 数据说明

- 共 **641 项成就**，按类型分为：普通角色 242 · 堕化角色 119 · 其余成就 93 · 完成挑战 48 · Boss 击败 38 · 解锁挑战 34 · 角色解锁 33 · 通过关卡 20 · 解锁关卡 14
- 成就 ID 与 Steam 内部 `apiname` 对应，用于 Steam 导入时匹配

## 🙏 数据来源

- 物品图标与元数据：[IsaacGuru](https://isaacguru.com/)
- 中文名称与描述：[External Item Descriptions](https://github.com/wofsauge/External-Item-Descriptions)（社区维护）
- wiki 链接：灰机 wiki

## 📃 License

MIT
