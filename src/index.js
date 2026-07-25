// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Jika request ke root atau file statis, serve dari assets
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return env.ASSETS.fetch(request);
    }
    
    // Coba serve file statis dari assets
    try {
      return env.ASSETS.fetch(request);
    } catch (e) {
      // Jika tidak ditemukan, return index.html (SPA support)
      return env.ASSETS.fetch(new Request(url.origin + '/index.html', request));
    }
  }
};

// ===== ROUTE: 404 =====
if (pathname === '/404.html') {
  return env.ASSETS.fetch(request);
}

// ===== ROUTE: Fallback 404 =====
// Di akhir fetch, setelah semua route:
try {
  return env.ASSETS.fetch(request);
} catch (e) {
  // Redirect ke 404.html
  return env.ASSETS.fetch(new Request(url.origin + '/404.html', request));
};