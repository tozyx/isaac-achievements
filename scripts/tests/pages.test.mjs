import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, mkdirSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const worker = readFileSync(join(root, 'public/sw.js'), 'utf8');

test('静态构建平铺 public，Cloudflare 构建排除测试文件，支持 Windows', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'isaac-pages-'));
  try {
    mkdirSync(join(fixture, 'scripts'));
    cpSync(join(root, 'scripts/build.mjs'), join(fixture, 'scripts/build.mjs'));
    for (const name of ['index.html', 'public', 'functions', 'lib']) {
      cpSync(join(root, name), join(fixture, name), { recursive: true });
    }
    execFileSync(process.execPath, [join(fixture, 'scripts/build.mjs'), '--static']);
    const build = join(fixture, 'build');
    for (const path of ['index.html', 'assets/atlas-ach.png', 'data/codex.json', 'sw.js', 'pwa/manifest.json']) {
      assert.ok(existsSync(join(build, path)), path);
    }
    assert.equal(existsSync(join(build, 'public')), false);
    assert.equal(existsSync(join(build, 'functions')), false);
    assert.equal(existsSync(join(build, 'lib')), false);
    execFileSync(process.execPath, [join(fixture, 'scripts/build.mjs')]);
    assert.ok(existsSync(join(build, 'functions/api/[[routes]].ts')));
    assert.ok(!readdirSync(join(build, 'lib'), { recursive: true }).some((p) => p.endsWith('.test.ts')));
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

for (const path of ['/', '/isaac-achievements/']) {
  test(`页面/PWA/离线图集在 ${path} 下使用站点内真实资源`, async () => {
    const base = 'https://example.test' + path;
    const resolveFile = (url) => {
      const href = typeof url === 'string' ? url : url.url;
      assert.ok(href.startsWith(base), '资源越过站点作用域: ' + href);
      const relative = new URL(href).pathname.slice(path.length);
      return join(root, relative === '' || relative === 'index.html' ? 'index.html' : 'public/' + relative);
    };
    const network = async (url) => {
      const file = resolveFile(url);
      assert.ok(existsSync(file), '缺失资源: ' + file);
      return new Response(readFileSync(file));
    };
    const assets = JSON.parse(html.match(/^const ASSETS = (.*);$/m)[1]);
    // 执行页面实际使用的图集 URL 函数，再验证文件存在及预加载地址一致。
    const assetUrl = vm.runInNewContext('(' + html.match(/function assetUrl\(file\) \{[\s\S]*?\n\}/)[0] + ')', { ASSETS: assets });
    for (const sheet of Object.values(assets).filter((s) => s && s.file)) {
      await network(new URL(assetUrl(sheet.file), base).href);
    }
    const preload = html.match(/rel="preload" as="image" href="([^"]+)"/)[1];
    assert.equal(preload, assetUrl(assets['atlas-ach'].file));
    for (const match of html.matchAll(/fetch\('([^']+\.json)'\)/g)) {
      await network(new URL(match[1], base).href);
    }
    const manifestUrl = new URL(html.match(/rel="manifest" href="([^"]+)"/)[1], base);
    const manifest = JSON.parse(await (await network(manifestUrl.href)).text());
    assert.equal(new URL(manifest.start_url, manifestUrl).href, base);
    assert.equal(new URL(manifest.scope, manifestUrl).href, base);
    for (const icon of manifest.icons) await network(new URL(icon.src, manifestUrl).href);

    const events = {};
    const cacheData = new Map();
    const deleted = [];
    const key = (request) => typeof request === 'string' ? request : request.url;
    const cache = {
      async addAll(urls) { for (const url of urls) cacheData.set(url, await network(url)); },
      async put(url, response) { cacheData.set(key(url), response); },
      async match(url) { return cacheData.get(key(url))?.clone(); },
    };
    const cachePrefix = 'isaac-checklist:' + base + ':';
    const context = vm.createContext({
      URL,
      fetch: network,
      self: {
        registration: { scope: base },
        addEventListener: (name, fn) => { events[name] = fn; },
        skipWaiting: async () => {}, clients: { claim: async () => {} },
      },
      caches: {
        open: async () => cache,
        keys: async () => [cachePrefix + 'v7', cachePrefix + 'v8', 'another-site-cache'],
        delete: async (name) => { deleted.push(name); },
      },
    });
    vm.runInContext(worker, context);
    let pending;
    events.install({ waitUntil: (promise) => { pending = promise; } });
    await pending;
    events.activate({ waitUntil: (promise) => { pending = promise; } });
    await pending;
    assert.deepEqual(deleted, [cachePrefix + 'v7']);
    // 安装后切断网络，图集、数据和首页均应从缓存读取。
    context.fetch = async () => { throw new Error('offline'); };
    for (const relative of ['assets/atlas-ach.png?v=' + assets.version, 'data/codex.json', 'index.html', '']) {
      let response;
      events.fetch({
        request: { method: 'GET', url: base + relative, mode: 'navigate' },
        respondWith: (promise) => { response = promise; },
      });
      assert.equal((await response).status, 200, relative);
    }
    let intercepted = false;
    events.fetch({ request: { method: 'GET', url: base + 'api/steam' }, respondWith: () => { intercepted = true; } });
    assert.equal(intercepted, false);
  });
}
