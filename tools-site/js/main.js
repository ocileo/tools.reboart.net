// Data tools
const tools = [
    {
        id: 1,
        name: "JSON Formatter",
        description: "Format, validasi, dan beautify JSON dengan mudah",
        icon: "fa-code",
        category: "Developer Tools",
        url: "#"
    },
    {
        id: 2,
        name: "Base64 Encoder/Decoder",
        description: "Encode dan decode teks ke Base64 format",
        icon: "fa-lock",
        category: "Encoder",
        url: "#"
    },
    {
        id: 3,
        name: "URL Encoder/Decoder",
        description: "Encode dan decode URL dengan aman",
        icon: "fa-link",
        category: "Encoder",
        url: "#"
    },
    {
        id: 4,
        name: "Color Converter",
        description: "Konversi warna antara HEX, RGB, HSL format",
        icon: "fa-palette",
        category: "Design Tools",
        url: "#"
    },
    {
        id: 5,
        name: "Password Generator",
        description: "Generate password yang kuat dan aman",
        icon: "fa-key",
        category: "Security",
        url: "#"
    },
    {
        id: 6,
        name: "Text Counter",
        description: "Hitung jumlah kata, karakter, dan paragraf",
        icon: "fa-calculator",
        category: "Text Tools",
        url: "#"
    },
    {
        id: 7,
        name: "Markdown Preview",
        description: "Preview dan convert markdown ke HTML",
        icon: "fa-markdown",
        category: "Developer Tools",
        url: "#"
    },
    {
        id: 8,
        name: "QR Code Generator",
        description: "Generate QR code dari teks atau URL",
        icon: "fa-qrcode",
        category: "Generator",
        url: "#"
    },
    {
        id: 9,
        name: "Timestamp Converter",
        description: "Konversi Unix timestamp ke tanggal",
        icon: "fa-clock",
        category: "Developer Tools",
        url: "#"
    },
    {
        id: 10,
        name: "Image Compressor",
        description: "Kompres ukuran gambar tanpa mengurangi kualitas",
        icon: "fa-image",
        category: "Image Tools",
        url: "#"
    },
    {
        id: 11,
        name: "Minifier CSS/JS",
        description: "Minify kode CSS dan JavaScript",
        icon: "fa-compress",
        category: "Developer Tools",
        url: "#"
    },
    {
        id: 12,
        name: "UUID Generator",
        description: "Generate UUID v4 secara random",
        icon: "fa-fingerprint",
        category: "Generator",
        url: "#"
    }
];

// Fungsi untuk render tools
function renderTools(toolsToRender) {
    const toolsGrid = document.getElementById('toolsGrid');
    toolsGrid.innerHTML = '';

    toolsToRender.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <div class="tool-icon">
                <i class="fas ${tool.icon}"></i>
            </div>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <span class="tool-category">${tool.category}</span>
            <br>
            <a href="${tool.url}" class="use-tool-btn">Gunakan Tool</a>
        `;
        toolsGrid.appendChild(toolCard);
    });
}

// Fungsi search
document.getElementById('searchTool').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm)
    );
    renderTools(filteredTools);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scroll untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Render semua tools saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderTools(tools);
});

// Sticky header shadow on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 0) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'var(--shadow)';
    }
});
