/**
 * Auto-Generate Sitemap Script
 * 
 * Script ini secara otomatis memindai folder /public
 * dan membuat sitemap.xml berdasarkan file HTML yang ditemukan.
 * 
 * Cara pakai: node scripts/generate-sitemap.js
 * Terintegrasi: npm run deploy → otomatis regenerate sitemap
 */

const fs = require('fs');
const path = require('path');

// ===== KONFIGURASI =====
const BASE_URL = 'https://tools.reboart.net';
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const OUTPUT_FILE = path.resolve(PUBLIC_DIR, 'sitemap.xml');

// File yang di-exclude dari sitemap
const EXCLUDE_FILES = new Set([
  '404.html',
  'robots.txt',
  'sitemap.xml',
]);

// Priority mapping berdasarkan path
function getPriority(filePath) {
  const name = path.basename(filePath, '.html');
  
  // Halaman utama
  if (name === 'index' && path.dirname(filePath) === PUBLIC_DIR) return '1.0';
  
  // Halaman tools individual
  if (filePath.includes('/tools/pdf/')) return '0.8';
  if (filePath.includes('/tools/')) return '0.8';
  
  // Halaman kategori utama (root .html)
  const highPriority = [
    'color-picker', 'password-generator', 'unit-converter',
    'qr-maker', 'json-formatter', 'promt'
  ];
  if (highPriority.includes(name)) return '0.9';
  
  // Halaman utilitas
  return '0.8';
}

// Changefreq mapping
function getChangefreq(filePath) {
  const name = path.basename(filePath, '.html');
  
  if (name === 'index' && path.dirname(filePath) === PUBLIC_DIR) return 'daily';
  if (name === '404') return 'never';
  
  return 'weekly';
}

// Dapatkan lokasi relatif dari PUBLIC_DIR
function getRelativePath(absolutePath) {
  return absolutePath.replace(PUBLIC_DIR, '').replace(/\\/g, '/');
}

// Generate URL dari file path
function fileToUrl(relativePath) {
  // Index page
  if (relativePath === '/index.html') return BASE_URL + '/';
  
  // Convert /something.html → /something.html
  return BASE_URL + relativePath;
}

// Generate today's date in YYYY-MM-DD
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===== MAIN =====
function generateSitemap() {
  console.log('🔍 Scanning HTML files in:', PUBLIC_DIR);
  
  const today = getTodayDate();
  const urls = [];
  
  // Recursively scan directory
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html') && !EXCLUDE_FILES.has(entry.name)) {
        const relativePath = getRelativePath(fullPath);
        const url = fileToUrl(relativePath);
        const priority = getPriority(fullPath);
        const changefreq = getChangefreq(fullPath);
        
        urls.push({ url, priority, changefreq });
        console.log(`  ✅ ${relativePath} → ${url} (${priority})`);
      }
    }
  }
  
  scanDir(PUBLIC_DIR);
  
  // Sort URLs: priority descending, then alphabetically
  urls.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority.localeCompare(a.priority);
    return a.url.localeCompare(b.url);
  });
  
  // ===== GENERATE XML =====
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  
  // Write file
  fs.writeFileSync(OUTPUT_FILE, xml, 'utf-8');
  
  console.log('\n📊 Summary:');
  console.log(`  Total URLs: ${urls.length}`);
  console.log(`  Output: ${OUTPUT_FILE}`);
  console.log('✅ Sitemap generated successfully!');
}

// Run
generateSitemap();

