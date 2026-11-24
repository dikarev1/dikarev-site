// Счётчик визитов: отправляет адрес страницы на /api/hit. Без cookies.
// Свои визиты не считаются, если хоть раз открыть /stats в этом браузере.
(function () {
  try {
    if (localStorage.getItem('notrack') === '1') return;
  } catch (e) {}
  if (navigator.webdriver) return;
  var ref = '';
  try {
    if (document.referrer) {
      var r = new URL(document.referrer);
      if (r.host !== location.host) ref = r.host;
    }
  } catch (e) {}
  var data = JSON.stringify({ p: location.pathname, r: ref });
  if (navigator.sendBeacon) navigator.sendBeacon('/api/hit', data);
  else fetch('/api/hit', { method: 'POST', body: data, keepalive: true });
})();
