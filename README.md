# 🛠️ ReboArt Tools

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange)](https://pages.cloudflare.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Kumpulan tools online gratis untuk developer, designer, dan content creator.

## ✨ Live Demo
🔗 [https://tools.reboart.net](https://tools.reboart.net)

## 🎯 Tools Tersedia

| Tool | Status | Deskripsi |
|------|--------|-----------|
| QR Code Generator | ✅ Live | QR code dengan logo, warna, download |
| Color Palette Generator | ✅ Live | Palet warna harmonis, export CSS |
| JSON Formatter | 🔜 Soon | Format & validasi JSON |
| Password Generator | 🔜 Soon | Generate password aman |
| Base64 Encoder | 🔜 Soon | Encode/decode Base64 |

## 🚀 Tech Stack

- HTML5 (semantic)
- CSS3 (custom properties, grid)
- Vanilla JavaScript (ES6+)
- Font Awesome 6
- Zero dependencies
- Deployed on Cloudflare Pages

## ⚡ Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1s
- Total Size: < 50KB
- No frameworks
- Inline critical CSS

## 📦 Deployment

### Cloudflare Pages (Recommended)
1. Fork repository ini
2. Connect ke Cloudflare Pages
3. Set build settings:
   - Build command: (leave empty)
   - Output directory: /
4. Add custom domain: tools.reboart.net
5. Deploy!

### Local Development
```bash
# Clone repository
git clone https://github.com/reboart/tools-reboart.git

# Run with any static server
npx serve .
# or
python3 -m http.server 8080
