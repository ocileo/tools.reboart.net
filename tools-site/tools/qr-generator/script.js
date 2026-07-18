/**
 * QR Code Generator
 * ReboArt Tools
 */

class QRGenerator {
    constructor() {
        this.qrData = '';
        this.qrOptions = {
            width: 300,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        };
        this.currentType = 'url';
        this.logoImage = null;
        this.qrHistory = this.loadHistory();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadTheme();
        this.renderHistory();
        this.autoGenerate();
    }
    
    bindEvents() {
        // Content type selector
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchContentType(btn.dataset.type);
            });
        });
        
        // Input changes - auto generate
        const inputs = ['qrUrl', 'qrText', 'qrEmail', 'qrEmailSubject', 'qrEmailBody',
                       'qrPhone', 'qrWifiSsid', 'qrWifiPassword', 'qrVcardName',
                       'qrVcardOrg', 'qrVcardPhone', 'qrVcardEmail', 'qrVcardUrl'];
        
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => this.autoGenerate());
            }
        });
        
        document.getElementById('qrWifiSecurity')?.addEventListener('change', () => this.autoGenerate());
        
        // Color inputs
        document.getElementById('qrFgColor')?.addEventListener('input', (e) => {
            document.getElementById('qrFgHex').value = e.target.value;
            this.qrOptions.color.dark = e.target.value;
            this.generateQR();
        });
        
        document.getElementById('qrBgColor')?.addEventListener('input', (e) => {
            document.getElementById('qrBgHex').value = e.target.value;
            this.qrOptions.color.light = e.target.value;
            this.generateQR();
        });
        
        document.getElementById('qrFgHex')?.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                document.getElementById('qrFgColor').value = e.target.value;
                this.qrOptions.color.dark = e.target.value;
                this.generateQR();
            }
        });
        
        document.getElementById('qrBgHex')?.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                document.getElementById('qrBgColor').value = e.target.value;
                this.qrOptions.color.light = e.target.value;
                this.generateQR();
            }
        });
        
        // Size slider
        document.getElementById('qrSize')?.addEventListener('input', (e) => {
            document.getElementById('sizeValue').textContent = e.target.value;
            this.qrOptions.width = parseInt(e.target.value);
            this.generateQR();
        });
        
        // Error correction
        document.querySelectorAll('.ec-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.ec-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.qrOptions.errorCorrectionLevel = btn.dataset.ec;
                this.generateQR();
                this.updateInfo();
            });
        });
        
        // Logo upload
        document.getElementById('logoUploadArea')?.addEventListener('click', () => {
            document.getElementById('logoInput').click();
        });
        
        document.getElementById('logoInput')?.addEventListener('change', (e) => {
            this.handleLogoUpload(e.target.files[0]);
        });
        
        document.getElementById('removeLogoBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeLogo();
        });
        
        // Generate button
        document.getElementById('generateBtn')?.addEventListener('click', () => {
            this.generateQR();
        });
        
        // Download buttons
        document.getElementById('downloadPng')?.addEventListener('click', () => this.downloadQR('png'));
        document.getElementById('downloadSvg')?.addEventListener('click', () => this.downloadQR('svg'));
        document.getElementById('downloadJpg')?.addEventListener('click', () => this.downloadQR('jpg'));
        document.getElementById('downloadWebp')?.addEventListener('click', () => this.downloadQR('webp'));
        
        // Copy button
        document.getElementById('copyQrBtn')?.addEventListener('click', () => this.copyQRToClipboard());
        
        // Clear history
        document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
            if (confirm('Clear all QR history?')) {
                this.clearHistory();
            }
        });
        
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Drag and drop logo
        const uploadArea = document.getElementById('logoUploadArea');
        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--accent)';
        });
        
        uploadArea?.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-glass)';
        });
        
        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-glass)';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleLogoUpload(file);
            }
        });
    }
    
    switchContentType(type) {
        this.currentType = type;
        
        // Update buttons
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        // Hide all inputs
        const inputGroups = ['urlInput', 'textInput', 'emailInput', 'phoneInput', 'wifiInput', 'vcardInput'];
        inputGroups.forEach(id => {
            document.getElementById(id)?.classList.add('hidden');
        });
        
        // Show selected input
        document.getElementById(`${type}Input`)?.classList.remove('hidden');
        
        this.updateInfo();
        this.autoGenerate();
    }
    
    getQRContent() {
        switch (this.currentType) {
            case 'url':
                return document.getElementById('qrUrl')?.value || '';
            
            case 'text':
                return document.getElementById('qrText')?.value || '';
            
            case 'email':
                const email = document.getElementById('qrEmail')?.value || '';
                const subject = document.getElementById('qrEmailSubject')?.value || '';
                const body = document.getElementById('qrEmailBody')?.value || '';
                return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            case 'phone':
                const phone = document.getElementById('qrPhone')?.value || '';
                return `tel:${phone}`;
            
            case 'wifi':
                const ssid = document.getElementById('qrWifiSsid')?.value || '';
                const security = document.getElementById('qrWifiSecurity')?.value || '';
                const password = document.getElementById('qrWifiPassword')?.value || '';
                return `WIFI:S:${ssid};T:${security};P:${password};;`;
            
            case 'vcard':
                const name = document.getElementById('qrVcardName')?.value || '';
                const org = document.getElementById('qrVcardOrg')?.value || '';
                const vPhone = document.getElementById('qrVcardPhone')?.value || '';
                const vEmail = document.getElementById('qrVcardEmail')?.value || '';
                const vUrl = document.getElementById('qrVcardUrl')?.value || '';
                return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${org}\nTEL:${vPhone}\nEMAIL:${vEmail}\nURL:${vUrl}\nEND:VCARD`;
            
            default:
                return '';
        }
    }
    
    autoGenerate() {
        const content = this.getQRContent();
        if (content && content !== this.qrData) {
            this.qrData = content;
            this.generateQR();
        }
    }
    
    async generateQR() {
        const content = this.getQRContent();
        if (!content) return;
        
        this.qrData = content;
        const canvas = document.getElementById('qrCanvas');
        const placeholder = document.getElementById('qrPlaceholder');
        
        try {
            // Clear canvas
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Generate QR code
            await QRCode.toCanvas(canvas, content, this.qrOptions);
            
            // Add logo if exists
            if (this.logoImage) {
                await this.addLogoToQR(canvas);
            }
            
            // Hide placeholder
            placeholder.style.display = 'none';
            canvas.style.display = 'block';
            
            // Update info
            this.updateInfo();
            
            // Add to history
            this.addToHistory(canvas);
            
        } catch (error) {
            console.error('QR Generation failed:', error);
            this.showToast('Failed to generate QR code');
        }
    }
    
    addLogoToQR(canvas) {
        return new Promise((resolve) => {
            const ctx = canvas.getContext('2d');
            const logoSize = canvas.width * 0.2;
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            
            const img = new Image();
            img.onload = () => {
                // White background for logo
                ctx.fillStyle = this.qrOptions.color.light;
                ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
                
                // Draw logo
                ctx.drawImage(img, x, y, logoSize, logoSize);
                resolve();
            };
            img.src = this.logoImage;
        });
    }
    
    handleLogoUpload(file) {
        if (!file) return;
        
        if (file.size > 1024 * 1024) {
            this.showToast('Logo must be less than 1MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.logoImage = e.target.result;
            document.getElementById('logoImage').src = e.target.result;
            document.getElementById('uploadContent').classList.add('hidden');
            document.getElementById('logoPreview').classList.remove('hidden');
            this.generateQR();
        };
        reader.readAsDataURL(file);
    }
    
    removeLogo() {
        this.logoImage = null;
        document.getElementById('logoInput').value = '';
        document.getElementById('uploadContent').classList.remove('hidden');
        document.getElementById('logoPreview').classList.add('hidden');
        this.generateQR();
    }
    
    updateInfo() {
        document.getElementById('infoType').textContent = this.currentType.toUpperCase();
        document.getElementById('infoSize').textContent = `${this.qrOptions.width}x${this.qrOptions.width}`;
        
        const ecLabels = {
            'L': 'L (7%)',
            'M': 'M (15%)',
            'Q': 'Q (25%)',
            'H': 'H (30%)'
        };
        document.getElementById('infoEc').textContent = ecLabels[this.qrOptions.errorCorrectionLevel];
    }
    
    downloadQR(format) {
        const canvas = document.getElementById('qrCanvas');
        if (!canvas || !this.qrData) {
            this.showToast('Generate QR code first');
            return;
        }
        
        let url;
        let filename;
        
        switch (format) {
            case 'png':
                url = canvas.toDataURL('image/png');
                filename = 'qr-code.png';
                break;
            
            case 'jpg':
                url = canvas.toDataURL('image/jpeg', 0.95);
                filename = 'qr-code.jpg';
                break;
            
            case 'webp':
                url = canvas.toDataURL('image/webp', 0.95);
                filename = 'qr-code.webp';
                break;
            
            case 'svg':
                this.downloadSVG();
                return;
            
            default:
                url = canvas.toDataURL('image/png');
                filename = 'qr-code.png';
        }
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        
        this.showToast(`Downloaded as ${format.toUpperCase()}!`);
    }
    
    downloadSVG() {
        // Create SVG from QR data
        QRCode.toString(this.qrData, {
            type: 'svg',
            color: this.qrOptions.color,
            errorCorrectionLevel: this.qrOptions.errorCorrectionLevel
        }, (err, svg) => {
            if (err) return;
            
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'qr-code.svg';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            this.showToast('Downloaded as SVG!');
        });
    }
    
    async copyQRToClipboard() {
        const canvas = document.getElementById('qrCanvas');
        if (!canvas || !this.qrData) {
            this.showToast('Generate QR code first');
            return;
        }
        
        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            this.showToast('QR Code copied to clipboard!');
        } catch (error) {
            this.showToast('Failed to copy QR code');
        }
    }
    
    addToHistory(canvas) {
        if (!this.qrData) return;
        
        const dataUrl = canvas.toDataURL('image/png');
        
        // Remove duplicate
        this.qrHistory = this.qrHistory.filter(item => item.data !== this.qrData);
        
        // Add new entry
        this.qrHistory.unshift({
            data: this.qrData,
            image: dataUrl,
            type: this.currentType,
            timestamp: Date.now()
        });
        
        // Keep last 20
        if (this.qrHistory.length > 20) {
            this.qrHistory = this.qrHistory.slice(0, 20);
        }
        
        localStorage.setItem('qrHistory', JSON.stringify(this.qrHistory));
        this.renderHistory();
    }
    
    loadHistory() {
        try {
            return JSON.parse(localStorage.getItem('qrHistory')) || [];
        } catch {
            return [];
        }
    }
    
    renderHistory() {
        const grid = document.getElementById('historyGrid');
        
        if (this.qrHistory.length === 0) {
            grid.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-clock-rotate-left"></i>
                    <p>No history yet</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.qrHistory.slice(0, 8).map(item => `
            <div class="history-item" onclick="qrGenerator.loadFromHistory('${item.data}', '${item.type}')" 
                 title="${item.type.toUpperCase()}: ${item.data.substring(0, 50)}">
                <img src="${item.image}" alt="QR Code">
            </div>
        `).join('');
    }
    
    loadFromHistory(data, type) {
        this.switchContentType(type);
        
        // Parse data based on type
        setTimeout(() => {
            switch (type) {
                case 'url':
                    document.getElementById('qrUrl').value = data;
                    break;
                case 'text':
                    document.getElementById('qrText').value = data;
                    break;
                case 'email':
                    const emailMatch = data.match(/mailto:([^?]+)/);
                    if (emailMatch) document.getElementById('qrEmail').value = emailMatch[1];
                    break;
                case 'phone':
                    const phoneMatch = data.match(/tel:(.+)/);
                    if (phoneMatch) document.getElementById('qrPhone').value = phoneMatch[1];
                    break;
                case 'wifi':
                    const ssidMatch = data.match(/S:([^;]+)/);
                    const passMatch = data.match(/P:([^;]+)/);
                    if (ssidMatch) document.getElementById('qrWifiSsid').value = ssidMatch[1];
                    if (passMatch) document.getElementById('qrWifiPassword').value = passMatch[1];
                    break;
                case 'vcard':
                    const nameMatch = data.match(/FN:(.+)/);
                    if (nameMatch) document.getElementById('qrVcardName').value = nameMatch[1];
                    break;
            }
            
            this.qrData = data;
            this.generateQR();
        }, 100);
    }
    
    clearHistory() {
        this.qrHistory = [];
        localStorage.removeItem('qrHistory');
        this.renderHistory();
        this.showToast('History cleared!');
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        document.getElementById('toastMessage').textContent = message;
        toast.classList.add('show');
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
    }
    
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Update QR colors for light theme
        if (newTheme === 'light') {
            this.qrOptions.color.dark = '#1e293b';
            this.qrOptions.color.light = '#ffffff';
        } else {
            this.qrOptions.color.dark = '#000000';
            this.qrOptions.color.light = '#ffffff';
        }
        
        document.getElementById('qrFgColor').value = this.qrOptions.color.dark;
        document.getElementById('qrFgHex').value = this.qrOptions.color.dark;
        document.getElementById('qrBgColor').value = this.qrOptions.color.light;
        document.getElementById('qrBgHex').value = this.qrOptions.color.light;
        
        this.generateQR();
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = document.querySelector('#themeToggle i');
        icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize
let qrGenerator;

document.addEventListener('DOMContentLoaded', () => {
    qrGenerator = new QRGenerator();
    
    console.log('%c📱 QR Code Generator %cReady!',
        'font-size: 1.2em; font-weight: bold; color: #6366f1;',
        'color: #94a3b8;');
});
