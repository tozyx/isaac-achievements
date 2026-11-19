# The Binding of Isaac Achievement Checklist

[简体中文](README.md) · English

A fan-made checklist for 641 achievements in *The Binding of Isaac*. Look up unlock requirements, track your progress, and import achievements from Steam or a local save.

[Open the site with Steam import](https://isaac641.pages.dev/) · [Static GitHub Pages edition](https://tozyx.github.io/isaac-achievements/) · [Give feedback](https://github.com/tozyx/isaac-achievements/issues)

The site follows your browser language on the first visit. Use **English** or **中文** in the header to switch. The English checklist includes names, unlock requirements, and rewards for all 641 achievements. The item catalog uses English names and alphabetical ordering where available. Item descriptions and entries without an English name still display their Chinese text. Achievement terminology follows the [English Rebirth Wiki](https://bindingofisaacrebirth.wiki.gg/wiki/Completion_Marks).

## How to use

- **Track progress.** Browse by character, challenge, stage, and more. Search achievement names or unlock requirements, mark achievements complete, and set priorities. Priority presets can be imported and exported.
- **Import a save.** Open **导入成就** (Import achievements) and select a local game save such as `rep_persistentgamedata1.dat`. The browser reads the file locally.
- **Import from Steam.** In the same panel, enter a Steam profile URL, a 17-digit SteamID64, or a custom profile name. Set **Game details** to **Public** in Steam's privacy settings. The default mode merges Steam progress with the existing checklist. Clearing the merge checkbox replaces the current completion record with the Steam result.
- **Browse the item catalog.** Select **道具** (Items) in the bottom right to look up collectibles, trinkets, cards, runes, and pills. Search supports names, IDs, aliases, and pinyin.

Completion records are stored in the current browser for the current site address. Switching browsers or domains, or clearing site data, affects access to those records. Offline use depends on cached resources. Steam import requires an internet connection and sends the supplied profile URL or ID to the proxy to look up achievements.

## Run locally

With Node.js 24 and npm, run the following from the repository root.

```sh
npm ci
npm run dev
```

Open the URL printed in the terminal. Use `npm test` to run the tests or `npm run preview-api` to preview the frontend and Steam API together. The page loads sprite sheets and JSON over HTTP.

## Deploy

| Platform | Configuration |
| --- | --- |
| Cloudflare Pages | Connect the repository, set the production branch to `main`, use `npm run build` as the build command, and set the output directory to `build`. With automatic deployments enabled, pushes to the production branch trigger a deployment. |
| GitHub Pages | Set the publishing source to **GitHub Actions** under **Settings → Pages**. The **Deploy GitHub Pages** workflow builds the static site. |

The static edition supports the checklist, item catalog, and local save imports. Online Steam import uses `/api/steam`, provided by Cloudflare Pages Functions. To use a separately deployed proxy with the static edition, set its origin in the browser console and reload the page.

```js
localStorage.setItem('isaac_steam_proxy', 'https://your-project.pages.dev');
location.reload();
```

The frontend starts at `index.html`. Static assets, catalog data, and the service worker live in `public/`. The Steam proxy lives in `functions/` and `lib/hono/`, and build and data generation scripts live in `scripts/`.

## Feedback and license

Use **问题反馈** (Feedback) in the website toolbar or open a GitHub issue. Bug and feature templates are bilingual. You can write in either English or Chinese. [GitHub Issues](https://github.com/tozyx/isaac-achievements/issues)

This project is based on [Feather-bai/isaac-achievements](https://github.com/Feather-bai/isaac-achievements). Achievement information references the [Huiji Wiki](https://isaac.huijiwiki.com/wiki/成就). Item data and icons reference [IsaacGuru](https://isaacguru.com/), and Chinese names and descriptions reference [External Item Descriptions](https://github.com/wofsauge/External-Item-Descriptions).

Software and documentation that this project is entitled to license are available under the [MIT License](LICENSE). Third-party assets and data are subject to their respective rights and licenses.
