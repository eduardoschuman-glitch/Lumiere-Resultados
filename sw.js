/* Instituto Lumière · Resultados
   Guarda a página e as fotos no aparelho para abrir mesmo sem internet.
   Ao trocar ou incluir fotos, aumente o número da versão abaixo,
   o ?v= das fotos em assets/js/app.js e acrescente os arquivos novos na lista. */
const VERSION = 'resultados-v6';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/style.css?v=2',
  'assets/js/app.js?v=6',
  'assets/brand/vetor-lockup-horizontal-branco.svg',
  'assets/brand/vetor-simbolo-rosa.svg',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'assets/img/caso-01-2-antes.webp?v=6',
  'assets/img/caso-01-2-depois.webp?v=6',
  'assets/img/caso-01-antes.webp?v=6',
  'assets/img/caso-01-depois.webp?v=6',
  'assets/img/caso-02-2-antes.webp?v=6',
  'assets/img/caso-02-2-depois.webp?v=6',
  'assets/img/caso-02-antes.webp?v=6',
  'assets/img/caso-02-depois.webp?v=6',
  'assets/img/caso-03-2-antes.webp?v=6',
  'assets/img/caso-03-2-depois.webp?v=6',
  'assets/img/caso-03-antes.webp?v=6',
  'assets/img/caso-03-depois.webp?v=6',
  'assets/img/caso-04-antes.webp?v=6',
  'assets/img/caso-04-depois.webp?v=6',
  'assets/img/caso-06-antes.webp?v=6',
  'assets/img/caso-06-depois.webp?v=6',
  'assets/img/caso-07-antes.webp?v=6',
  'assets/img/caso-07-depois.webp?v=6',
  'assets/img/caso-08-2-antes.webp?v=6',
  'assets/img/caso-08-2-depois.webp?v=6',
  'assets/img/caso-08-antes.webp?v=6',
  'assets/img/caso-08-depois.webp?v=6',
  'assets/img/caso-09-antes.webp?v=6',
  'assets/img/caso-09-depois.webp?v=6',
  'assets/img/caso-10-2-antes.webp?v=6',
  'assets/img/caso-10-2-depois.webp?v=6',
  'assets/img/caso-10-antes.webp?v=6',
  'assets/img/caso-10-depois.webp?v=6',
  'assets/img/caso-11-2-antes.webp?v=6',
  'assets/img/caso-11-2-depois.webp?v=6',
  'assets/img/caso-11-antes.webp?v=6',
  'assets/img/caso-11-depois.webp?v=6',
  'assets/img/caso-12-antes.webp?v=6',
  'assets/img/caso-12-depois.webp?v=6'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
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
