// Мини-клиент Upstash Redis через REST, без зависимостей.
// Переменные окружения Vercel создаёт сам при подключении Upstash Redis к проекту.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function pipeline(commands) {
  if (!URL_ || !TOKEN) throw new Error('Redis не подключён: нет KV_REST_API_URL / KV_REST_API_TOKEN');
  const res = await fetch(URL_.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error('Redis: HTTP ' + res.status);
  return (await res.json()).map((x) => x.result);
}

// Дата по Тбилиси, YYYY-MM-DD
function day(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tbilisi' }).format(d);
}

module.exports = { pipeline, day };
