/* Instituto Lumière · Resultados
   Guarda a página e as fotos no aparelho para abrir mesmo sem internet.
   Ao trocar ou incluir fotos, aumente o número da versão abaixo e
   acrescente os arquivos novos na lista. */
const VERSION = 'resultados-v1';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/style.css?v=1',
  'assets/js/app.js?v=1',
  'assets/brand/vetor-lockup-horizontal-branco.svg',
  'assets/brand/vetor-simbolo-rosa.svg',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'assets/img/caso-01-antes.webp',
  'assets/img/caso-01-depois.webp',
  'assets/img/caso-02-antes.webp',
  'assets/img/caso-02-depois.webp',
  'assets/img/caso-03-antes.webp',
  'assets/img/caso-03-depois.webp',
  'assets/img/caso-04-antes.webp',
  'assets/img/caso-04-depois.webp',
  'assets/img/caso-06-antes.webp',
  'assets/img/caso-06-depois.webp',
  'assets/img/caso-07-antes.webp',
  'assets/img/caso-07-depois.webp',
  'assets/img/caso-10-antes.webp',
  'assets/img/caso-10-depois.webp',
  'assets/img/caso-11-antes.webp',
  'assets/img/caso-11-depois.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// página: tenta a rede primeiro (para pegar casos novos) e cai no que está guardado
// fotos, estilos e fontes: usa o guardado e atualiza em segundo plano
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone();
      caches.open(VERSION).then(c => c.put('index.html', copy));
      return r;
    }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});
