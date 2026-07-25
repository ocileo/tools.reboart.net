// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Jika request ke root atau index.html, serve dari assets
    if (pathname === '/' || pathname === '/index.html') {
      return env.ASSETS.fetch(request);
    }
    
    // Serve file statis dari assets
    try {
      const response = await env.ASSETS.fetch(request);
      // Jika response 404, redirect ke 404.html
      if (response.status === 404) {
        return env.ASSETS.fetch(new Request(url.origin + '/404.html', request));
      }
      return response;
    } catch (e) {
      // Jika error, serve 404.html
      return env.ASSETS.fetch(new Request(url.origin + '/404.html', request));
    }
  }
};
