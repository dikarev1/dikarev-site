#!/usr/bin/env node
/*
  Мини-блог для статического сайта. Без зависимостей — нужен только Node.js.

  Как пользоваться:
    1. Создай файл blog-posts/my-post.md (имя файла = адрес поста: /blog/my-post/)
    2. В начале файла — шапка:
         ---
         title: Заголовок поста
         date: 2026-11-18
         description: Короткое описание для списка постов
         ---
       (добавь draft: true, чтобы пост не публиковался)
    3. Запусти:  node build-blog.js
    4. Закоммить и запушь — Vercel обновит сайт.
*/

const fs = require('fs');
const path = require('path');

// ---------- Настройки ----------
const SITE = {
  url: 'https://dikarev.site',
  blogTitle: 'Блог',
  author: 'Паша Дикарёв',
  lang: 'ru',
  // Юзернейм Telegram-канала без @ — для ссылок «Оригинал в Telegram» у импортированных постов
  telegram: 'dikarempasha',
  // Ссылки в шапке блога — поменяй под свой сайт
  nav: [
    { href: '/', label: 'Главная' },
    { href: '/blog/', label: 'Блог' },
    { href: '/photos/', label: 'Фотографии' },
    { href: '/padel/', label: 'Падел' },
    { href: '/career/', label: 'Карьера' },
  ],
};

const ROOT = __dirname;
// Исходники постов (Markdown) — вне public, чтобы не публиковались как есть
const POSTS_DIR = path.join(ROOT, 'blog-posts');
// Готовые страницы блога
const OUT_DIR = path.join(ROOT, 'blog');

// ---------- Утилиты ----------
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function parseFrontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    meta[key] = val;
  }
  return { meta, body: src.slice(m[0].length) };
}

// ---------- Мини-Markdown ----------
function inline(text) {
  const codes = [];
  // \* \_ \` и т.п. — символ выводится как есть, без форматирования
  text = text.replace(/\\([\\`*_~\[\]()#>!-])/g, (_, c) => {
    codes.push(esc(c));
    return `\u0000${codes.length - 1}\u0000`;
  });
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${esc(c)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  text = esc(text);
  text = text
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
      const ext = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${href}"${ext}>${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/(^|\W)_([^_\s][^_]*)_(?=\W|$)/g, '$1<em>$2</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[i]);
}

function markdown(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const isBlockStart = (l) =>
    /^(#{1,6}\s|```|>\s?|[-*+]\s|\d+\.\s|---+\s*$|\*\*\*+\s*$|!\[)/.test(l) || l.trim() === '';

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // Блок кода
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++;
      out.push(`<pre><code${lang ? ` class="language-${esc(lang)}"` : ''}>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }

    // Заголовок
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }

    // Разделитель
    if (/^(---+|\*\*\*+)\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    // Цитата
    if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdown(q.join('\n'))}</blockquote>`);
      continue;
    }

    // Списки
    const ul = /^[-*+]\s+/, ol = /^\d+\.\s+/;
    if (ul.test(line) || ol.test(line)) {
      const re = ul.test(line) ? ul : ol;
      const tag = re === ul ? 'ul' : 'ol';
      const items = [];
      while (i < lines.length && re.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(re, ''))}</li>`);
      out.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    // Картинка отдельной строкой → figure с подписью из alt
    const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/);
    if (img) {
      out.push(`<figure><img src="${img[2]}" alt="${esc(img[1])}" loading="lazy">${img[1] ? `<figcaption>${esc(img[1])}</figcaption>` : ''}</figure>`);
      i++;
      continue;
    }

    // Абзац
    const p = [line];
    i++;
    while (i < lines.length && !isBlockStart(lines[i])) p.push(lines[i++]);
    out.push(`<p>${inline(p.join('\n')).replace(/\n/g, '<br>\n')}</p>`);
  }
  return out.join('\n');
}

// ---------- Шаблоны ----------
function layout({ title, description, body, canonical }) {
  const nav = SITE.nav.map((n) => {
    const a = `<a href="${n.href}"${n.href === '/blog/' ? ' class="active"' : ''}>${esc(n.label)}</a>`;
    return n.href === '/padel/' ? `<span class="nav-drop">${a}<span class="drop"><a href="/padel/etiquette/">Этикет падела</a><a href="/padel/tournament/">Впечатления от победного турнира</a><a href="/padel/#padel-utopia">Padel Utopia</a></span></span>` : a;
  }).join('');
  return `<!DOCTYPE html>
<html lang="${SITE.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || '')}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description || '')}">
<meta property="og:url" content="${canonical}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" type="application/rss+xml" title="${esc(SITE.blogTitle)}" href="/blog/feed.xml">
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/style.css">
<script defer src="/t.js"></script>
</head>
<body>
<header class="site-header"><a class="logo" href="/" aria-label="На главную"><img src="/logo.png" alt="" width="22" height="22"></a><nav>${nav}</nav></header>
<main class="blog">
${body}
</main>
<footer class="site-footer"><img class="footer-logo" src="/logo.png" alt="" width="16" height="16"> © ${new Date().getFullYear()} ${esc(SITE.author)}</footer>
</body>
</html>
`;
}

// ---------- Сборка ----------
function build() {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const posts = fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const { meta, body } = parseFrontMatter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
      if (!meta.title) console.warn(`⚠️  ${file}: нет title в шапке`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date || '')) {
        console.warn(`⚠️  ${file}: date должна быть в формате ГГГГ-ММ-ДД, ставлю сегодняшнюю`);
        meta.date = new Date().toISOString().slice(0, 10);
      }
      if (!meta.source && meta.tg_id && SITE.telegram) meta.source = `https://t.me/${SITE.telegram}/${meta.tg_id}`;
      return { slug, ...meta, title: meta.title || slug, html: markdown(body) };
    })
    .filter((p) => p.draft !== true)
    .sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));

  // Удаляем папки постов, которых больше нет
  const keep = new Set(posts.map((p) => p.slug));
  for (const entry of fs.readdirSync(OUT_DIR, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'posts' && !keep.has(entry.name)
        && fs.existsSync(path.join(OUT_DIR, entry.name, '.generated'))) {
      fs.rmSync(path.join(OUT_DIR, entry.name), { recursive: true });
    }
  }

  // Страницы постов
  posts.forEach((p, idx) => {
    const newer = posts[idx - 1], older = posts[idx + 1];
    const pager = `<nav class="pager">
  ${older ? `<a class="prev" href="/blog/${older.slug}/">← ${esc(older.title)}</a>` : '<span></span>'}
  ${newer ? `<a class="next" href="/blog/${newer.slug}/">${esc(newer.title)} →</a>` : '<span></span>'}
</nav>`;
    const body = `<article class="post">
  <a class="back" href="/blog/">← Все посты</a>
  <h1>${esc(p.title)}</h1>
  <time datetime="${p.date}">${formatDate(p.date)}</time>
  <div class="post-content">
${p.html}
  </div>
  ${p.source ? `<p class="source"><a href="${esc(p.source)}" target="_blank" rel="noopener">Оригинал в Telegram →</a></p>` : ''}
</article>
${pager}`;
    const dir = path.join(OUT_DIR, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, '.generated'), '');
    fs.writeFileSync(path.join(dir, 'index.html'), layout({
      title: `${p.title} — ${SITE.blogTitle}`,
      description: p.description,
      body,
      canonical: `${SITE.url}/blog/${p.slug}/`,
    }));
  });

  // Список постов
  const list = posts.length
    ? `<ul class="post-list">${posts.map((p) => `
  <li>
    <time datetime="${p.date}">${formatDate(p.date)}</time>
    <a href="/blog/${p.slug}/">${esc(p.title)}</a>
    ${p.description ? `<p>${esc(p.description)}</p>` : ''}
  </li>`).join('')}
</ul>`
    : '<p>Пока здесь пусто.</p>';
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), layout({
    title: SITE.blogTitle,
    description: `${SITE.blogTitle} — ${SITE.author}`,
    body: `<section class="blog-hero">
  <img class="portrait" src="/images/pasha.jpg" alt="Паша Дикарёв" width="800" height="842">
  <div>
    <p class="hero-name">Паша Дикарёв</p>
    <p class="hero-lead">Привет, это дубль моего блога, который я веду в Телеграм по адресу <a href="https://t.me/dikarempasha" target="_blank" rel="noopener">t.me/dikarempasha</a></p>
    <p class="hero-label">Обо мне вне работы</p>
    <p class="hero-about">32 года, фотографирую, хорошо играю в падел, обожаю истории.</p>
  </div>
</section>
<h1 class="blog-title">${esc(SITE.blogTitle)}</h1>\n${list}`,
    canonical: `${SITE.url}/blog/`,
  }));

  // RSS
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(SITE.blogTitle)} — ${esc(SITE.author)}</title>
<link>${SITE.url}/blog/</link>
<description>${esc(SITE.blogTitle)}</description>
${posts.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE.url}/blog/${p.slug}/</link><guid>${SITE.url}/blog/${p.slug}/</guid><pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate><description>${esc(p.description || '')}</description></item>`).join('\n')}
</channel></rss>
`;
  fs.writeFileSync(path.join(OUT_DIR, 'feed.xml'), rss);

  // Последние посты на главной (между метками в index.html)
  const homePath = path.join(ROOT, 'index.html');
  if (fs.existsSync(homePath)) {
    const home = fs.readFileSync(homePath, 'utf8');
    const latest = `<ul class="post-list">${posts.slice(0, 3).map((p) => `
    <li><time datetime="${p.date}">${formatDate(p.date)}</time><a href="/blog/${p.slug}/">${esc(p.title)}</a>${p.description ? `<p>${esc(p.description)}</p>` : ''}</li>`).join('')}
  </ul>`;
    const updated = home.replace(
      /(<!-- latest-posts[^>]*-->)[\s\S]*?(<!-- \/latest-posts -->)/,
      `$1\n  ${latest}\n  $2`);
    fs.writeFileSync(homePath, updated);
  }

  console.log(`✅ Готово: ${posts.length} пост(ов) → /blog/`);
}

build();
