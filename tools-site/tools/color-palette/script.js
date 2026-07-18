/**
 * Color Palette Generator
 * ReboArt Tools
 */

// =============================================
// COLOR UTILITY CLASS
// =============================================
class ColorUtils {
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = Math.round(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    static rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    static hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color);
        };
        return { r: f(0), g: f(8), b: f(4) };
    }
    
    static hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        return rgb ? this.rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
    }
    
    static getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    
    static getContrastRatio(color1, color2) {
        const lum1 = this.getLuminance(color1.r, color1.g, color1.b);
        const lum2 = this.getLuminance(color2.r, color2.g, color2.b);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }
    
    static getTextColor(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return '#000000';
        const luminance = this.getLuminance(rgb.r, rgb.g, rgb.b);
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
    
    static rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);
        
        if (k === 1) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }
        
        c = Math.round(((c - k) / (1 - k)) * 100);
        m = Math.round(((m - k) / (1 - k)) * 100);
        y = Math.round(((y - k) / (1 - k)) * 100);
        k = Math.round(k * 100);
        
        return { c, m, y, k };
    }
}

// =============================================
// PALETTE GENERATOR CLASS
// =============================================
class PaletteGenerator {
    constructor() {
        this.currentPalette = [];
        this.lockedColors = new Set();
        this.currentHarmony = 'complementary';
        this.baseColor = '#6366f1';
        this.savedPalettes = this.loadSavedPalettes();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generatePalette();
        this.renderSavedPalettes();
        this.loadTheme();
    }
    
    bindEvents() {
        // Harmony buttons
        document.querySelectorAll('.harmony-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.harmony-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentHarmony = btn.dataset.harmony;
                this.generatePalette();
            });
        });
        
        // Color picker
        document.getElementById('baseColor').addEventListener('input', (e) => {
            this.baseColor = e.target.value;
            document.getElementById('hexInput').value = this.baseColor;
            this.generatePalette();
        });
        
        // Hex input
        document.getElementById('hexInput').addEventListener('input', (e) => {
            let value = e.target.value;
            if (!value.startsWith('#')) value = '#' + value;
            if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                this.baseColor = value;
                document.getElementById('baseColor').value = value;
                this.generatePalette();
            }
        });
        
        document.getElementById('hexInput').addEventListener('blur', (e) => {
            if (!/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                e.target.value = this.baseColor;
            }
        });
        
        // Random color
        document.getElementById('randomColorBtn').addEventListener('click', () => {
            this.randomColor();
        });
        
        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.randomColor();
        });
        
        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.openExportModal();
        });
        
        // Save button
        document.getElementById('savePaletteBtn').addEventListener('click', () => {
            this.savePalette();
        });
        
        // Clear saved
        document.getElementById('clearSavedBtn').addEventListener('click', () => {
            if (confirm('Hapus semua palet tersimpan?')) {
                this.clearSavedPalettes();
            }
        });
        
        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeExportModal();
        });
        
        document.getElementById('exportModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeExportModal();
        });
        
        // Copy buttons in modal
        document.querySelectorAll('.copy-code-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const codeBlock = document.getElementById(targetId);
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    this.showToast('Code copied!');
                });
            });
        });
        
        // Download buttons
        document.getElementById('downloadJson').addEventListener('click', () => {
            this.downloadJSON();
        });
        
        document.getElementById('downloadPng').addEventListener('click', () => {
            this.downloadPNG();
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && !e.target.closest('input')) {
                e.preventDefault();
                this.randomColor();
            }
            if (e.key === 'Escape') {
                this.closeExportModal();
            }
        });
    }
    
    generatePalette() {
        const baseRgb = ColorUtils.hexToRgb(this.baseColor);
        if (!baseRgb) return;
        
        const baseHsl = ColorUtils.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
        let paletteHsl = [];
        
        switch (this.currentHarmony) {
            case 'complementary':
                paletteHsl = this.getComplementary(baseHsl);
                break;
            case 'analogous':
                paletteHsl = this.getAnalogous(baseHsl);
                break;
            case 'triadic':
                paletteHsl = this.getTriadic(baseHsl);
                break;
            case 'tetradic':
                paletteHsl = this.getTetradic(baseHsl);
                break;
            case 'monochromatic':
                paletteHsl = this.getMonochromatic(baseHsl);
                break;
            case 'split-complementary':
                paletteHsl = this.getSplitComplementary(baseHsl);
                break;
            default:
                paletteHsl = this.getComplementary(baseHsl);
        }
        
        // Add variations for more colors
        const variations = this.addVariations(paletteHsl);
        
        // Keep locked colors
        const finalPalette = variations.map((hsl, index) => {
            if (this.lockedColors.has(index) && this.currentPalette[index]) {
                return this.currentPalette[index];
            }
            const rgb = ColorUtils.hslToRgb(hsl.h, hsl.s, hsl.l);
            return {
                hex: ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b),
                rgb,
                hsl,
                cmyk: ColorUtils.rgbToCmyk(rgb.r, rgb.g, rgb.b)
            };
        });
        
        this.currentPalette = finalPalette;
        this.renderPalette();
        this.updatePreviews();
        this.updateExportCode();
    }
    
    getComplementary(base) {
        return [
            base,
            { h: (base.h + 180) % 360, s: base.s, l: base.l }
        ];
    }
    
    getAnalogous(base) {
        return [
            { h: (base.h - 30 + 360) % 360, s: base.s, l: base.l },
            base,
            { h: (base.h + 30) % 360, s: base.s, l: base.l }
        ];
    }
    
    getTriadic(base) {
        return [
            base,
            { h: (base.h + 120) % 360, s: base.s, l: base.l },
            { h: (base.h + 240) % 360, s: base.s, l: base.l }
        ];
    }
    
    getTetradic(base) {
        return [
            base,
            { h: (base.h + 90) % 360, s: base.s, l: base.l },
            { h: (base.h + 180) % 360, s: base.s, l: base.l },
            { h: (base.h + 270) % 360, s: base.s, l: base.l }
        ];
    }
    
    getMonochromatic(base) {
        return [
            { h: base.h, s: base.s, l: Math.max(0, base.l - 30) },
            { h: base.h, s: base.s, l: Math.max(0, base.l - 15) },
            base,
            { h: base.h, s: base.s, l: Math.min(100, base.l + 15) },
            { h: base.h, s: base.s, l: Math.min(100, base.l + 30) }
        ];
    }
    
    getSplitComplementary(base) {
        return [
            base,
            { h: (base.h + 150) % 360, s: base.s, l: base.l },
            { h: (base.h + 210) % 360, s: base.s, l: base.l }
        ];
    }
    
    addVariations(colors) {
        const variations = [...colors];
        const count = colors.length;
        
        // Add lighter and darker variations
        for (let i = 0; i < Math.min(count, 5); i++) {
            if (variations.length < 8) {
                variations.push({
                    h: colors[i].h,
                    s: Math.min(100, colors[i].s + 10),
                    l: Math.min(95, colors[i].l + 10)
                });
            }
        }
        
        return variations.slice(0, 10);
    }
    
    renderPalette() {
        const container = document.getElementById('paletteContainer');
        
        container.innerHTML = this.currentPalette.map((color, index) => {
            const textColor = ColorUtils.getTextColor(color.hex);
            const isLocked = this.lockedColors.has(index);
            
            return `
                <div class="palette-color" 
                     style="background-color: ${color.hex}; color: ${textColor};"
                     onclick="paletteGenerator.copyColor('${color.hex}')">
                    <div class="color-info">
                        <div class="color-hex">${color.hex.toUpperCase()}</div>
                        <div class="color-name">rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})</div>
                        <div class="color-actions" onclick="event.stopPropagation()">
                            <button class="color-action-btn ${isLocked ? 'locked' : ''}" 
                                    onclick="paletteGenerator.toggleLock(${index})"
                                    title="${isLocked ? 'Unlock' : 'Lock'} color">
                                <i class="fas ${isLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
                            </button>
                            <button class="color-action-btn" 
                                    onclick="paletteGenerator.showColorDetails(${index})"
                                    title="View details">
                                <i class="fas fa-info"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    copyColor(hex) {
        navigator.clipboard.writeText(hex).then(() => {
            this.showToast(`Copied ${hex.toUpperCase()}!`);
            this.showColorDetailsByHex(hex);
        });
    }
    
    toggleLock(index) {
        if (this.lockedColors.has(index)) {
            this.lockedColors.delete(index);
        } else {
            this.lockedColors.add(index);
        }
        this.renderPalette();
    }
    
    showColorDetails(index) {
        const color = this.currentPalette[index];
        if (!color) return;
        
        document.getElementById('detailHex').textContent = color.hex.toUpperCase();
        document.getElementById('detailRgb').textContent = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        document.getElementById('detailHsl').textContent = `hsl(${color.hsl.h}°, ${color.hsl.s}%, ${color.hsl.l}%)`;
        document.getElementById('detailCmyk').textContent = `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`;
        
        // Highlight the color
        const paletteColors = document.querySelectorAll('.palette-color');
        paletteColors.forEach((el, i) => {
            el.style.outline = i === index ? '3px solid white' : 'none';
            el.style.outlineOffset = '-4px';
        });
    }
    
    showColorDetailsByHex(hex) {
        const index = this.currentPalette.findIndex(c => c.hex === hex);
        if (index !== -1) {
            this.showColorDetails(index);
        }
    }
    
    updatePreviews() {
        if (this.currentPalette.length < 3) return;
        
        // UI Preview
        const uiDemo = document.getElementById('uiDemo');
        uiDemo.querySelector('.ui-header').style.backgroundColor = this.currentPalette[0].hex;
        uiDemo.querySelector('.ui-header').style.color = ColorUtils.getTextColor(this.currentPalette[0].hex);
        uiDemo.querySelector('.ui-sidebar').style.backgroundColor = this.currentPalette[1].hex;
        uiDemo.querySelector('.ui-sidebar').style.color = ColorUtils.getTextColor(this.currentPalette[1].hex);
        uiDemo.querySelector('.ui-main').style.backgroundColor = this.currentPalette[2].hex;
        uiDemo.querySelector('.ui-main').style.color = ColorUtils.getTextColor(this.currentPalette[2].hex);
        
        uiDemo.querySelectorAll('.ui-card').forEach((card, i) => {
            const color = this.currentPalette[(i + 3) % this.currentPalette.length];
            card.style.backgroundColor = color.hex;
            card.style.color = ColorUtils.getTextColor(color.hex);
        });
        
        // Text Preview
        const textDemo = document.getElementById('textDemo');
        textDemo.style.backgroundColor = this.currentPalette[0].hex;
        textDemo.style.color = ColorUtils.getTextColor(this.currentPalette[0].hex);
        
        // Gradient Preview
        const gradientBox = document.querySelector('.gradient-box');
        gradientBox.style.background = `linear-gradient(135deg, ${this.currentPalette[0].hex}, ${this.currentPalette[this.currentPalette.length - 1].hex})`;
    }
    
    randomColor() {
        const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        this.baseColor = randomHex;
        document.getElementById('baseColor').value = randomHex;
        document.getElementById('hexInput').value = randomHex;
        this.generatePalette();
    }
    
    savePalette() {
        const palette = {
            id: Date.now(),
            colors: this.currentPalette.map(c => c.hex),
            harmony: this.currentHarmony,
            date: new Date().toISOString()
        };
        
        this.savedPalettes.unshift(palette);
        if (this.savedPalettes.length > 20) this.savedPalettes.pop();
        
        localStorage.setItem('savedPalettes', JSON.stringify(this.savedPalettes));
        this.renderSavedPalettes();
        this.showToast('Palette saved!');
    }
    
    loadSavedPalettes() {
        try {
            return JSON.parse(localStorage.getItem('savedPalettes')) || [];
        } catch {
            return [];
        }
    }
    
    renderSavedPalettes() {
        const grid = document.getElementById('savedGrid');
        
        if (this.savedPalettes.length === 0) {
            grid.innerHTML = `
                <div class="empty-saved">
                    <i class="fas fa-palette"></i>
                    <p>No saved palettes yet</p>
                    <span>Generate a palette and click save!</span>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.savedPalettes.map(palette => `
            <div class="saved-palette" onclick="paletteGenerator.loadPalette('${palette.id}')">
                ${palette.colors.map(color => `
                    <div class="saved-color" style="background-color: ${color};"></div>
                `).join('')}
            </div>
        `).join('');
    }
    
    loadPalette(id) {
        const palette = this.savedPalettes.find(p => p.id == id);
        if (!palette || palette.colors.length === 0) return;
        
        this.baseColor = palette.colors[0];
        this.currentHarmony = palette.harmony;
        
        document.getElementById('baseColor').value = this.baseColor;
        document.getElementById('hexInput').value = this.baseColor;
        
        // Update harmony button
        document.querySelectorAll('.harmony-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.harmony === palette.harmony);
        });
        
        this.lockedColors.clear();
        this.currentPalette = palette.colors.map(hex => {
            const rgb = ColorUtils.hexToRgb(hex);
            const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
            return {
                hex,
                rgb,
                hsl,
                cmyk: ColorUtils.rgbToCmyk(rgb.r, rgb.g, rgb.b)
            };
        });
        
        this.renderPalette();
        this.updatePreviews();
        this.updateExportCode();
    }
    
    clearSavedPalettes() {
        this.savedPalettes = [];
        localStorage.removeItem('savedPalettes');
        this.renderSavedPalettes();
        this.showToast('All palettes cleared!');
    }
    
    updateExportCode() {
        if (this.currentPalette.length === 0) return;
        
        // CSS Export
        const cssCode = this.currentPalette.map((c, i) => 
            `--color-${i + 1}: ${c.hex};`
        ).join('\n');
        document.getElementById('cssExport').querySelector('code').textContent = cssCode;
        
        // Tailwind Export
        const tailwindCode = `colors: {\n${this.currentPalette.map((c, i) => 
            `  'palette-${i + 1}': '${c.hex}',`
        ).join('\n')}\n}`;
        document.getElementById('tailwindExport').querySelector('code').textContent = tailwindCode;
    }
    
    openExportModal() {
        document.getElementById('exportModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeExportModal() {
        document.getElementById('exportModal').classList.remove('active');
        document.body.style.overflow = '';
    }
    
    downloadJSON() {
        const data = {
            name: 'Color Palette',
            harmony: this.currentHarmony,
            colors: this.currentPalette.map(c => ({
                hex: c.hex,
                rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
                hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
                cmyk: `cmyk(${c.cmyk.c}, ${c.cmyk.m}, ${c.cmyk.y}, ${c.cmyk.k})`
            }))
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-palette.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    downloadPNG() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const colorCount = this.currentPalette.length;
        const width = colorCount * 200;
        const height = 400;
        
        canvas.width = width;
        canvas.height = height;
        
        this.currentPalette.forEach((color, i) => {
            ctx.fillStyle = color.hex;
            ctx.fillRect(i * 200, 0, 200, 300);
            
            // Add hex text
            const textColor = ColorUtils.getTextColor(color.hex);
            ctx.fillStyle = textColor;
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(color.hex.toUpperCase(), i * 200 + 100, 360);
        });
        
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-palette.png';
        a.click();
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        document.getElementById('toastMessage').textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
    
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = document.querySelector('#themeToggle i');
        icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// =============================================
// INITIALIZE
// =============================================
let paletteGenerator;

document.addEventListener('DOMContentLoaded', () => {
    paletteGenerator = new PaletteGenerator();
    
    console.log('%c🎨 Color Palette Generator %cReady!',
        'font-size: 1.2em; font-weight: bold; color: #8b5cf6;',
        'color: #94a3b8;');
    console.log('%c💡 Tip: Tekan Spasi untuk generate random color', 'color: #94a3b8;');
});
