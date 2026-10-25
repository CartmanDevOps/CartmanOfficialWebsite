import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';

// Keep the editable preview in dist; ship only optimized static files.
const outputRoot=path.resolve('build');
if(path.dirname(outputRoot)!==path.resolve(process.cwd())||path.basename(outputRoot)!=='build')throw new Error('Unsafe build output path');
await rm(outputRoot, {recursive:true,force:true});
await mkdir('build/static', { recursive: true });
await cp('dist/assets', 'build/assets', { recursive: true });
const scrollVendor='assets/vendor/lenis-1.3.27.min.js';
const scrollRuntime=await transform(await readFile(`dist/${scrollVendor}`,'utf8'),{loader:'js',minify:true,target:'es2020',legalComments:'none'});
await writeFile(`build/${scrollVendor}`,scrollRuntime.code);
await cp('dist/site.webmanifest', 'build/site.webmanifest');
let originalBytes = 0;
let shippedBytes = 0;
for (const page of ['index', 'order']) {
  let html = await readFile(`dist/${page}.html`, 'utf8');
  const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)];
  const scripts = [...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)];
  for (const [kind, matches] of [['css', styles], ['js', scripts]]) {
    const source = (await Promise.all(matches.map(m => readFile(`dist/${m[1]}`, 'utf8')))).join(kind === 'js' ? '\n;\n' : '\n');
    const result = await transform(source, { loader: kind, minify: true, ...(kind==='js'?{format:'iife'}:{}), legalComments: 'none', target: 'es2020' });
    const hash = createHash('sha256').update(result.code).digest('hex').slice(0, 10);
    const filename = `${page}.${hash}.${kind}`;
    await writeFile(`build/static/${filename}`, result.code);
    originalBytes += Buffer.byteLength(source);
    shippedBytes += Buffer.byteLength(result.code);
    const tag = kind === 'css' ? `<link rel="stylesheet" href="static/${filename}">` : `<script src="static/${filename}" defer></script>`;
    html = html.replace(matches[0][0], tag);
    for (const match of matches.slice(1)) html = html.replace(match[0], '');
  }
  html = html.replace(/\n\s*\n/g, '\n');
  await writeFile(`build/${page}.html`, html);
}
const theme = await transform(await readFile('dist/theme.js', 'utf8'), { loader: 'js', minify: true, target: 'es2020' });
await writeFile('build/theme.js', theme.code);
console.log(`Production CSS/JS: ${originalBytes.toLocaleString()} → ${shippedBytes.toLocaleString()} bytes (${Math.round((1 - shippedBytes / originalBytes) * 100)}% smaller).`);
