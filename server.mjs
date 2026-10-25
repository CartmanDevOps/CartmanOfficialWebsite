import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { createReadStream } from 'node:fs';

const root = path.resolve(process.env.STATIC_DIR || 'dist');
const port = Number(process.env.PORT || 4173);
const types = {html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json',webmanifest:'application/manifest+json',png:'image/png',webp:'image/webp',svg:'image/svg+xml',woff2:'font/woff2',mp4:'video/mp4',webm:'video/webm',vtt:'text/vtt; charset=utf-8'};

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Vary', 'Accept-Encoding');
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, {Allow:'GET, HEAD'});
    return res.end('Method not allowed');
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const resolved = path.resolve(root, '.' + pathname);
    const relative = path.relative(root, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Outside document root');
    const file = resolved === root ? path.join(root, 'index.html') : resolved;
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    const extension = path.extname(file).slice(1);
    const etag = `W/"${info.size}-${Math.trunc(info.mtimeMs)}"`;
    res.setHeader('ETag', etag);
    res.setHeader('Content-Type', types[extension] || 'application/octet-stream');
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304);
      return res.end();
    }
    if (['mp4','webm'].includes(extension)) {
      res.setHeader('Accept-Ranges','bytes');
      const range=req.headers.range;
      let start=0,end=info.size-1;
      if(range){
        const match=/^bytes=(\d*)-(\d*)$/.exec(range);
        if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end()}
        if(!match[1])start=Math.max(0,info.size-Number(match[2]));
        else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]))}
        if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end()}
        res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${info.size}`);
      }
      res.setHeader('Content-Length',end-start+1);
      if(req.method==='HEAD')return res.end();
      const stream=createReadStream(file,{start,end});
      stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());
      return stream.pipe(res);
    }
    if (req.method === 'HEAD') return res.end();
    const data = await readFile(file);
    if (/\bgzip\b/.test(req.headers['accept-encoding'] || '') && ['html','css','js','svg','json'].includes(extension)) {
      res.setHeader('Content-Encoding', 'gzip');
      return res.end(gzipSync(data));
    }
    res.end(data);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    res.end('This file could not be found.');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Cartman local preview: http://localhost:${port}`));
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Set PORT to choose another.` : error.message);
  process.exitCode = 1;
});
