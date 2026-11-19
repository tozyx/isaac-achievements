// 构建脚本：把前端静态资源 + functions + lib 组装进 build/ 目录
// Cloudflare Pages 会按约定编译 functions/ 目录中的函数，并托管 build/ 根目录的静态资源
import { cpSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const build = resolve(root, 'build');
const staticOnly = process.argv.includes('--static');

// 清理旧的 build 目录
rmSync(build, { recursive: true, force: true });
mkdirSync(build, { recursive: true });

// 1. 前端静态资源：index.html + public/ 内容平铺到根（sw.js、pwa/、assets/、data/、_headers）
cpSync(resolve(root, 'index.html'), resolve(build, 'index.html'));
cpSync(resolve(root, 'public'), build, { recursive: true });

if (!staticOnly) {
  // Cloudflare Pages Functions 及其依赖；GitHub Pages 只发布静态资源。
  cpSync(resolve(root, 'functions'), resolve(build, 'functions'), { recursive: true });
  cpSync(resolve(root, 'lib'), resolve(build, 'lib'), {
    recursive: true,
    filter: (source) => !source.endsWith('.test.ts'),
  });
}

console.log('✅ build/ 已生成：');
for (const entry of readdirSync(build)) {
  console.log(`   - ${entry}`);
}
