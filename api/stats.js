// Закрытая страница статистики: /stats (логин и пароль — STATS_USER / STATS_PASSWORD в настройках Vercel).
const crypto = require('crypto');
const { pipeline, day } = require('./_redis');

const PERIODS = { today: ['Сегодня', 1], week: ['7 дней', 7], month: ['30 дней', 30], all: ['Всё время', 0] };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function same(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

function authorized(req) {
  const user = process.env.STATS_USER, pass = process.env.STATS_PASSWORD;
  if (!user || !pass) return false;
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  const [u, ...rest] = Buffer.from(h.slice(6), 'base64').toString().split(':');
  return same(u, user) & same(rest.join(':'), pass);
}

function pairs(arr) {
  const o = {};
  for (let i = 0; arr && i < arr.length; i += 2) o[arr[i]] = Number(arr[i + 1]);
  return o;
}

function sum(list) {
  const total = {};
  for (const o of list) for (const k in o) total[k] = (total[k] || 0) + o[k];
  return Object.entries(total).sort((a, b) => b[1] - a[1]);
}

function table(rows, head, link) {
  if (!rows.length) return '<p class="empty">Пока пусто</p>';
  const max = rows[0][1];
  return `<table><tr><th>${head}</th><th>Визиты</th></tr>${rows
    .map(([k, v]) => `<tr><td><div class="bar" style="width:${(v / max) * 100}%"></div>${link ? `<a href="${esc(k)}" target="_blank">${esc(k)}</a>` : `<span>${esc(k)}</span>`}</td><td>${v}</td></tr>`)
    .join('')}</table>`;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (!authorized(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="stats", charset="UTF-8"');
    return res.status(401).send('Нужен логин и пароль');
  }

  const period = PERIODS[req.query.p] ? req.query.p : 'week';
  const n = PERIODS[period][1];
  const days = [];
  for (let i = 0; i < n; i++) days.push(day(new Date(Date.now() - i * 86400000)));

  let html;
  try {
    const cmds = n ? days.flatMap((d) => [['HGETALL', 'hits:' + d], ['HGETALL', 'refs:' + d]]) : [['HGETALL', 'hits:all']];
    cmds.push(['LRANGE', 'recent', 0, 49]);
    // реферы за «всё время» не храним — для этого периода показываем за 30 дней
    if (!n) for (let i = 0; i < 30; i++) cmds.push(['HGETALL', 'refs:' + day(new Date(Date.now() - i * 86400000))]);
    const out = await pipeline(cmds);

    let hits, refs, recent;
    if (n) {
      hits = sum(days.map((_, i) => pairs(out[i * 2])));
      refs = sum(days.map((_, i) => pairs(out[i * 2 + 1])));
      recent = out[n * 2];
    } else {
      hits = sum([pairs(out[0])]);
      recent = out[1];
      refs = sum(out.slice(2).map(pairs));
    }
    const total = hits.reduce((s, [, v]) => s + v, 0);
    const fmt = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Tbilisi', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const recentRows = (recent || []).map((s) => JSON.parse(s)).map((v) =>
      `<tr><td class="time">${fmt.format(new Date(v.t))}</td><td>${esc(v.p)}</td><td class="muted">${esc(v.r || '')}</td></tr>`).join('');

    html = `
<nav class="periods">${Object.entries(PERIODS).map(([k, [label]]) => k === period ? `<b>${label}</b>` : `<a href="?p=${k}">${label}</a>`).join('')}</nav>
<p class="total"><span>${total}</span> визитов</p>
<h2>Страницы</h2>${table(hits, 'Страница', true)}
<h2>Откуда пришли${n ? '' : ' (за 30 дней)'}</h2>${table(refs, 'Сайт')}
<h2>Последние визиты</h2>${recentRows ? `<table class="recent">${recentRows}</table>` : '<p class="empty">Пока пусто</p>'}`;
  } catch (e) {
    console.error(e);
    html = `<p class="empty">Не удалось прочитать статистику: ${esc(e.message)}</p>`;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Статистика</title>
<link rel="icon" type="image/png" href="/favicon.png"><link rel="stylesheet" href="/style.css">
<script>try{localStorage.setItem('notrack','1')}catch(e){}</script>
<style>
.stats{max-width:var(--width);margin:0 auto;padding:0 20px 60px;font-family:var(--font-ui);font-size:15px}
.stats h1{font-size:1.6rem;margin:40px 0 4px}
.stats h2{font-size:1rem;margin:36px 0 8px;color:var(--muted);font-weight:500}
.periods{display:flex;gap:16px;margin-top:16px}.periods a{color:var(--muted);text-decoration:none}
.total{margin:20px 0 0;color:var(--muted)}.total span{font-size:2.4rem;color:var(--text);font-weight:600;margin-right:6px}
table{width:100%;border-collapse:collapse}td,th{padding:7px 0;border-top:1px solid var(--border);text-align:left;vertical-align:top}
th{font-weight:500;color:var(--muted);font-size:13px}td:last-child,th:last-child{text-align:right;width:70px}
td{position:relative;z-index:0}.bar{position:absolute;left:0;top:3px;bottom:3px;background:var(--code-bg);z-index:-1;border-radius:3px}
td a,td span{padding-left:6px}td a{color:var(--text);text-decoration:none}td a:hover{color:var(--accent)}
.recent td{padding:5px 0}.recent td:last-child{width:auto}.time{width:120px;color:var(--muted)}.muted{color:var(--muted)}
.empty{color:var(--muted)}
</style></head>
<body><main class="stats"><h1>Статистика</h1>${html}
<p class="muted" style="margin-top:40px;font-size:13px">Твои визиты из этого браузера не считаются.</p></main></body></html>`);
};
