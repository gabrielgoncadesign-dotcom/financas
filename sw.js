/* Service worker: deixa o app abrir mesmo sem internet.
   - Arquivos do próprio app: busca na rede primeiro (para pegar atualizações)
     e usa a cópia guardada quando estiver offline.
   - Bibliotecas e fontes externas: usa a cópia guardada e atualiza em segundo plano.
   - Chamadas ao Supabase (dados e login) nunca são guardadas. */
const VERSAO = 'financas-v1';
const ARQUIVOS = [
  './',
  './index.html',
  './config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== VERSAO).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.hostname.endsWith('supabase.co') || url.hostname.endsWith('supabase.in')) return;

  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp.ok && !url.search) {
            const copia = resp.clone();
            caches.open(VERSAO).then((c) => c.put(req, copia));
          }
          return resp;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))
        )
    );
    return;
  }

  if (url.hostname === 'cdn.jsdelivr.net' || url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    e.respondWith(
      caches.open(VERSAO).then((c) =>
        c.match(req).then((guardado) => {
          const rede = fetch(req)
            .then((resp) => { if (resp.ok || resp.type === 'opaque') c.put(req, resp.clone()); return resp; })
            .catch(() => guardado);
          return guardado || rede;
        })
      )
    );
  }
});
