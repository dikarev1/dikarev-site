// Принимает визит от /t.js и увеличивает счётчики.
const { pipeline, day } = require('./_redis');

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|telegram/i;
const KEEP_DAYS = 400 * 86400;

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') return Promise.resolve(JSON.parse(req.body));
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', (c) => { s += c; if (s.length > 2000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(s)); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).end();
  if (BOT.test(req.headers['user-agent'] || '')) return res.status(204).end();
  try {
    const body = await readBody(req);
    let p = String(body.p || '/').split(/[?#]/)[0].slice(0, 200);
    if (p.length > 1) p = p.replace(/\/+$/, '').replace(/\/index(\.html)?$/, '') || '/';
    if (!/^\/[\w\-\/.%~]*$/.test(p)) return res.status(204).end();
    const r = String(body.r || '').toLowerCase().slice(0, 100);
    const refOk = /^[a-z0-9.\-:]+$/.test(r);
    const d = day();
    const cmds = [
      ['HINCRBY', 'hits:all', p, 1],
      ['HINCRBY', 'hits:' + d, p, 1],
      ['EXPIRE', 'hits:' + d, KEEP_DAYS],
      ['LPUSH', 'recent', JSON.stringify({ t: Date.now(), p, r: refOk ? r : '' })],
      ['LTRIM', 'recent', 0, 199],
    ];
    if (refOk) cmds.push(['HINCRBY', 'refs:' + d, r, 1], ['EXPIRE', 'refs:' + d, KEEP_DAYS]);
    await pipeline(cmds);
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(204).end();
  }
};
