#!/usr/bin/env node
/*
  Импорт постов из Telegram-канала в блог. Без зависимостей — нужен только Node.js.

  1. В Telegram Desktop открой канал → ⋮ → «Экспорт истории чата»
     (Export chat history). Отметь «Фото», формат — «Машиночитаемый JSON».
     Telegram создаст папку вроде ChatExport_2026-11-18 с файлом result.json.
  2. Запусти из папки сайта:
       node import-telegram.js ~/Downloads/Telegram\ Desktop/ChatExport_2026-11-18 --channel имя_канала
     (--channel — юзернейм канала без @, нужен для ссылки «Оригинал в Telegram»)
  3. Запусти  node build-blog.js  — и коммить.

  Дополнительные опции:
    --min-length 50   пропускать посты короче 50 символов (по умолчанию 0 — брать все)
    --since 2025-01-01  брать только посты начиная с этой даты
    --titles t.json   свои заголовки постов: { "21": "Мечта исполнилась" }
    --drafts 3,17     эти посты импортировать как черновики
    --force           перезаписать уже импортированные посты
                      (по умолчанию они не трогаются — твои правки сохраняются)
*/

const fs = require('fs');
const path = require('path');

// ---------- Аргументы ----------
const args = process.argv.slice(2);
const exportDir = args.find((a) => !a.startsWith('--') && !isOptionValue(a));
function opt(name) {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
}
function isOptionValue(a) {
  const i = args.indexOf(a);
  return i > 0 && ['--channel', '--min-length', '--since', '--titles', '--drafts'].includes(args[i - 1]);
}
const CHANNEL = opt('channel');
const MIN_LENGTH = Number(opt('min-length') || 0);
const SINCE = opt('since') || '0000-00-00';
const FORCE = args.includes('--force');
// --titles titles.json — свои заголовки: { "номер_поста": "Заголовок" }. Текст поста тогда остаётся целиком
const TITLES = opt('titles') ? JSON.parse(fs.readFileSync(opt('titles'), 'utf8')) : {};
// --drafts 3,17,18 — эти посты импортировать как черновики (на сайте не появятся)
const DRAFTS = new Set((opt('drafts') || '').split(',').filter(Boolean).map(Number));

if (!exportDir) {
  console.error('Укажи папку экспорта: node import-telegram.js <папка ChatExport_...> --channel имя_канала');
  process.exit(1);
}
const resultPath = path.join(exportDir, 'result.json');
if (!fs.existsSync(resultPath)) {
  console.error(`Не нашёл ${resultPath}. При экспорте выбери формат «Машиночитаемый JSON».`);
  process.exit(1);
}

const ROOT = __dirname;
// Исходники постов (Markdown) — вне public, чтобы не публиковались как есть
const POSTS_DIR = path.join(ROOT, 'blog-posts');
const IMAGES_DIR = path.join(ROOT, 'blog', 'images', 'tg');
fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// ---------- Текст Telegram → Markdown ----------
const escapeMd = (s) => s.replace(/([\\`*_~\[\]])/g, '\\$1');

// Оборачиваем, не захватывая пробелы и переносы по краям: "**жирный** " а не "**жирный **"
function wrap(text, mark) {
  return text.split('\n').map((line) => {
    const m = line.match(/^(\s*)(.*?)(\s*)$/);
    return m[2] ? `${m[1]}${mark}${m[2]}${mark}${m[3]}` : line;
  }).join('\n');
}

function entityToMd(e) {
  const t = e.text || '';
  switch (e.type) {
    case 'bold': return wrap(escapeMd(t), '**');
    case 'italic': return wrap(escapeMd(t), '*');
    case 'strikethrough': return wrap(escapeMd(t), '~~');
    case 'code': return t.includes('\n') ? `\n\`\`\`\n${t}\n\`\`\`\n` : `\`${t}\``;
    case 'pre': return `\n\`\`\`${e.language || ''}\n${t}\n\`\`\`\n`;
    case 'text_link': return `[${escapeMd(t)}](${e.href})`;
    case 'link': {
      const href = /^https?:\/\//.test(t) ? t : `https://${t}`;
      return `[${escapeMd(t)}](${href})`;
    }
    case 'mention': return `[${escapeMd(t)}](https://t.me/${t.replace(/^@/, '')})`;
    case 'email': return `[${escapeMd(t)}](mailto:${t})`;
    case 'blockquote': return '\n' + t.split('\n').map((l) => `> ${escapeMd(l)}`).join('\n') + '\n';
    default: return escapeMd(t); // plain, hashtag, underline, spoiler, custom_emoji и т.д.
  }
}

function messageToMd(msg) {
  const entities = msg.text_entities
    || (Array.isArray(msg.text) ? msg.text.map((x) => (typeof x === 'string' ? { type: 'plain', text: x } : x))
      : [{ type: 'plain', text: msg.text || '' }]);
  return entities.map(entityToMd).join('')
    .split('\n')
    .map((line) => {
      // Линии из ___ / --- / *\_\_\_* → разделитель
      if (/^[\s*\\_-]+$/.test(line) && (line.match(/[_-]/g) || []).length >= 3) return '\n---\n';
      // Маркеры • → пункты списка
      return line.replace(/^\s*[•·]\s*/, '- ');
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function plainText(msg) {
  if (typeof msg.text === 'string') return msg.text;
  return (msg.text || []).map((x) => (typeof x === 'string' ? x : x.text)).join('');
}

// ---------- Заголовок, слаг ----------
const TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
function slugify(s) {
  return s.toLowerCase().split('').map((c) => (TR[c] !== undefined ? TR[c] : c)).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 6).join('-');
}

const cleanLine = (s) => s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').replace(/\s+/g, ' ').trim();

// Первая строка поста становится заголовком, если она короткая; иначе — первые слова
function splitTitle(plain, md) {
  const firstLine = cleanLine(plain.split('\n')[0] || '');
  if (firstLine && firstLine.length <= 90 && plain.includes('\n')) {
    const mdLines = md.split('\n');
    return { title: firstLine, body: mdLines.slice(1).join('\n').trim() };
  }
  const words = cleanLine(plain).split(' ');
  const title = words.slice(0, 8).join(' ') + (words.length > 8 ? '…' : '');
  return { title: title || 'Без названия', body: md };
}

function description(text) {
  const s = cleanLine(text.replace(/#\S+/g, '').replace(/[_-]{3,}/g, ' '));
  return s.length > 160 ? s.slice(0, 157).replace(/\s+\S*$/, '') + '…' : s;
}

// ---------- Фото ----------
function copyMedia(rel) {
  if (!rel || rel.startsWith('(')) return null; // "(File not included...)" — фото не выгружено
  const src = path.join(exportDir, rel);
  if (!fs.existsSync(src)) return null;
  const name = path.basename(rel).replace(/[^\w.@-]/g, '_');
  fs.copyFileSync(src, path.join(IMAGES_DIR, name));
  return `/blog/images/tg/${name}`;
}

// ---------- Импорт ----------
const data = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
const messages = (data.messages || []).filter((m) => m.type === 'message');

// Склеиваем альбомы: фото без текста, отправленные в ту же минуту, что и пост, — часть этого поста
const posts = [];
for (const m of messages) {
  const prev = posts[posts.length - 1];
  const sameMoment = prev && Math.abs(Number(m.date_unixtime) - Number(prev.main.date_unixtime)) <= 60;
  const hasText = plainText(m).trim().length > 0;
  // Длинный пост, который Telegram разбил на несколько сообщений с одинаковым временем
  if (prev && hasText && plainText(prev.main).trim() && m.date_unixtime === prev.main.date_unixtime) {
    prev.continuation.push(m);
    if (m.photo || m.media_type) prev.extra.push(m);
    continue;
  }
  if (sameMoment && (m.photo || m.media_type) && (!hasText || !plainText(prev.main).trim())) {
    prev.extra.push(m);
    if (!plainText(prev.main).trim() && hasText) { prev.extra.unshift(prev.main); prev.main = m; }
    continue;
  }
  posts.push({ main: m, extra: [], continuation: [] });
}

let created = 0, skipped = 0, existing = 0;
for (const { main, extra, continuation } of posts) {
  const date = String(main.date).slice(0, 10);
  const time = String(main.date).slice(11, 16);
  const plain = [main, ...continuation].map(plainText).join('\n\n');
  if (date < SINCE || plain.trim().length < MIN_LENGTH || (!plain.trim() && !main.photo && !extra.length)) { skipped++; continue; }

  const md = [main, ...continuation].map(messageToMd).join('\n\n');
  let { title, body } = TITLES[main.id] ? { title: TITLES[main.id], body: md } : splitTitle(plain, md);
  title = title.replace(/[.\s]+$/, '');
  title = title.charAt(0).toUpperCase() + title.slice(1);
  const slug = `${date}-${slugify(title) || 'post'}-${main.id}`;
  const file = path.join(POSTS_DIR, `${slug}.md`);

  if (fs.existsSync(file) && !FORCE) { existing++; continue; }

  const media = [main, ...extra];
  const images = media.map((m) => copyMedia(m.photo || (m.mime_type?.startsWith('image/') ? m.file : null))).filter(Boolean);
  const hasOtherMedia = media.some((m) => m.media_type && m.media_type !== 'sticker' && !m.photo);
  const source = CHANNEL ? `https://t.me/${CHANNEL.replace(/^@/, '')}/${main.id}` : '';
  // tg_id — номер поста в канале. Если канал не указан, ссылку построит build-blog.js из SITE.telegram

  const parts = [];
  if (images[0]) parts.push(`![](${images[0]})`);
  if (body) parts.push(body);
  for (const img of images.slice(1)) parts.push(`![](${img})`);
  if (hasOtherMedia) {
    parts.push(source ? `*В посте есть видео или файл — [смотреть в Telegram](${source}).*` : '*В оригинальном посте в Telegram есть видео.*');
  }

  const front = [
    '---',
    `title: ${title.replace(/\n/g, ' ')}`,
    `date: ${date}`,
    `time: ${time}`,
    // если первая строка ушла в заголовок — описание берём со второй строки
    `description: ${description(body !== md ? plain.slice(plain.indexOf('\n') + 1) : plain)}`,
    source ? `source: ${source}` : null,
    `tg_id: ${main.id}`,
    DRAFTS.has(main.id) ? 'draft: true' : null,
    '---',
  ].filter((l) => l !== null).join('\n');

  fs.writeFileSync(file, `${front}\n\n${parts.join('\n\n')}\n`);
  created++;
}

console.log(`✅ Импортировано: ${created}` +
  (existing ? ` · уже были: ${existing} (добавь --force, чтобы перезаписать)` : '') +
  (skipped ? ` · пропущено: ${skipped}` : ''));
console.log('Теперь запусти: node build-blog.js');
