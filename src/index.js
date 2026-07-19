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