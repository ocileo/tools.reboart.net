/**
 * ReboArt Tools - Main JavaScript
 * Version: 2.0
 */

// =============================================
// TOOLS DATA
// =============================================
const toolsData = [
    {
        id: 1,
        name: "JSON Formatter",
        description: "Format, validasi, dan beautify JSON dengan tree view interaktif dan syntax highlighting",
        icon: "fa-solid fa-code",
        category: "Developer",
        url: "#",
        featured: true,
        tags: ["json", "formatter", "validator", "beautifier"]
    },
    {
        id: 2,
        name: "Base64 Encoder/Decoder",
        description: "Encode dan decode teks atau file ke Base64 format dengan mudah dan cepat",
        icon: "fa-solid fa-shield-halved",
        category: "Converter",
        url: "#",
        featured: true,
        tags: ["base64", "encode", "decode", "converter"]
    },
    {
        id: 3,
        name: "Color Palette Generator",
        description: "Generate palet warna harmonis dengan AI-powered color theory untuk design",
        icon: "fa-solid fa-palette",
        category: "Design",
        url: "#",
        featured: true,
        tags: ["color", "palette", "design", "generator"]
    },
    {
        id: 4,
        name: "Password Generator",
        description: "Generate password kuat dengan kustomisasi panjang, karakter, dan simbol",
        icon: "fa-solid fa-key",
        category: "Security",
        url: "#",
        featured: false,
        tags: ["password", "generator", "security", "strong"]
    },
    {
        id: 5,
        name: "Markdown Editor",
        description: "Live preview markdown dengan syntax highlighting dan export ke HTML/PDF",
        icon: "fa-brands fa-markdown",
        category: "Developer",
        url: "#",
        featured: true,
        tags: ["markdown", "editor", "preview", "md"]
    },
    {
        id: 6,
        name: "QR Code Generator",
        description: "Generate QR code kustom dengan logo, warna, dan berbagai format output",
        icon: "fa-solid fa-qrcode",
        category: "Generator",
        url: "#",
        featured: false,
        tags: ["qr", "code", "generator", "barcode"]
    },
    {
        id: 7,
        name: "Image Compressor",
        description: "Kompres gambar JPEG, PNG, WebP tanpa kehilangan kualitas signifikan",
        icon: "fa-solid fa-image",
        category: "Image",
        url: "#",
        featured: false,
        tags: ["image", "compress", "optimize", "webp"]
    },
    {
        id: 8,
        name: "URL Shortener",
        description: "Perpendek URL panjang dengan custom alias dan tracking klik",
        icon: "fa-solid fa-link",
        category: "Utility",
        url: "#",
        featured: false,
        tags: ["url", "shortener", "link", "short"]
    },
    {
        id: 9,
        name: "Code Formatter",
        description: "Format dan beautify HTML, CSS, JavaScript, TypeScript otomatis",
        icon: "fa-solid fa-code",
        category: "Developer",
        url: "#",
        featured: true,
        tags: ["code", "formatter", "beautify", "prettier"]
    },
    {
        id: 10,
        name: "Text Diff Checker",
        description: "Bandingkan dua teks dengan highlight perbedaan secara visual",
        icon: "fa-solid fa-not-equal",
        category: "Utility",
        url: "#",
        featured: false,
        tags: ["diff", "compare", "text", "checker"]
    },
    {
        id: 11,
        name: "UUID Generator",
        description: "Generate UUID v4, v5, dan GUID secara batch untuk development",
        icon: "fa-solid fa-fingerprint",
        category: "Generator",
        url: "#",
        featured: false,
        tags: ["uuid", "guid", "generator", "unique"]
    },
    {
        id: 12,
        name: "Regex Tester",
        description: "Test, debug, dan validasi regular expression real-time dengan highlight",
        icon: "fa-solid fa-magnifying-glass",
        category: "Developer",
        url: "#",
        featured: false,
        tags: ["regex", "tester", "debug", "regular expression"]
    },
    {
        id: 13,
        name: "Lorem Ipsum Generator",
        description: "Generate teks dummy Lorem Ipsum dengan kustomisasi paragraf dan panjang",
        icon: "fa-solid fa-paragraph",
        category: "Generator",
        url: "#",
        featured: false,
        tags: ["lorem", "ipsum", "dummy", "text"]
    },
    {
        id: 14,
        name: "Cron Expression Parser",
        description: "Parse dan visualisasikan cron expression dengan penjelasan detail",
        icon: "fa-solid fa-clock",
        category: "Developer",
        url: "#",
        featured: false,
        tags: ["cron", "parser", "schedule", "expression"]
    },
    {
        id: 15,
        name: "Meta Tag Generator",
        description: "Generate meta tags lengkap untuk SEO dan social media optimization",
        icon: "fa-solid fa-tags",
        category: "SEO",
        url: "#",
        featured: false,
        tags: ["meta", "seo", "tags", "generator"]
    },
    {
        id: 16,
        name: "JWT Debugger",
        description: "Decode, verify, dan debug JSON Web Token dengan mudah",
        icon: "fa-solid fa-ticket",
        category: "Developer",
        url: "#",
        featured: false,
        tags: ["jwt", "token", "debug", "decode"]
    }
];

// Categories
const categories = ['All', 'Developer', 'Converter', 'Design', 'Security', 'Generator', 'Image', 'Utility', 'SEO'];

// =============================================
// STATE MANAGEMENT
// =============================================
const state = {
    currentFilter: 'All',
    searchQuery: '',
    isDarkMode: true,
    isLoading: false
};

// =============================================
// DOM ELEMENTS
// =============================================
const DOM = {
    toolsGrid: document.getElementById('toolsGrid'),
    searchBox: document.getElementById('searchTool'),
    filterContainer: document.getElementById('filterContainer'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('navMenu'),
    navbar: document.getElementById('navbar'),
    themeToggle: document.getElementById('themeToggle'),
    backToTop: document.getElementById('backToTop')
};

// =============================================
// INITIALIZATION
// =============================================
function init() {
    loadTheme();
    renderFilters();
    renderTools(toolsData);
    setupEventListeners();
    setupIntersectionObserver();
    animateStats();
}

// =============================================
// THEME MANAGEMENT
// =============================================
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    state.isDarkMode = savedTheme === 'dark';
    applyTheme();
}

function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    applyTheme();
    localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
}

function applyTheme() {
    const theme = state.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    
    const icon = DOM.themeToggle.querySelector('i');
    const text = DOM.themeToggle.querySelector('span');
    
    if (state.isDarkMode) {
        icon.className = 'fas fa-moon';
        text.textContent = 'Dark';
    } else {
        icon.className = 'fas fa-sun';
        text.textContent = 'Light';
    }
}

// =============================================
// FILTER RENDERING
// =============================================
function renderFilters() {
    DOM.filterContainer.innerHTML = categories.map(cat => `
        <button class="filter-pill ${cat === 'All' ? 'active' : ''}" 
                data-category="${cat}"
                aria-label="Filter ${cat} tools">
            ${cat}
        </button>
    `).join('');
}

// =============================================
// TOOLS RENDERING
// =============================================
function renderTools(tools) {
    if (!DOM.toolsGrid) return;
    
    if (tools.length === 0) {
        DOM.toolsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>Tools Tidak Ditemukan</h3>
                <p>Coba kata kunci atau kategori lain</p>
            </div>
        `;
        return;
    }
    
    DOM.toolsGrid.innerHTML = tools.map(tool => `
        <div class="tool-card" data-category="${tool.category}" data-aos="fade-up">
            <div class="tool-icon-wrapper">
                <i class="${tool.icon}"></i>
            </div>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <div class="tool-footer">
                <span class="tool-category">${tool.category}</span>
                <a href="${tool.url}" class="tool-action">
                    Buka <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
    
    // Re-observe new cards
    setupIntersectionObserver();
}

// =============================================
// FILTERING & SEARCH
// =============================================
function filterByCategory(category) {
    state.currentFilter = category;
    
    // Update active state
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === category);
    });
    
    filterAndSearch();
    
    // Scroll to tools section
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
}

function filterAndSearch() {
    let filtered = [...toolsData];
    
    // Filter by category
    if (state.currentFilter !== 'All') {
        filtered = filtered.filter(tool => tool.category === state.currentFilter);
    }
    
    // Filter by search query
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(tool => 
            tool.name.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.category.toLowerCase().includes(query) ||
            tool.tags.some(tag => tag.includes(query))
        );
    }
    
    renderTools(filtered);
}

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
    // Search with debounce
    if (DOM.searchBox) {
        DOM.searchBox.addEventListener('input', debounce((e) => {
            state.searchQuery = e.target.value;
            filterAndSearch();
        }, 300));
    }
    
    // Filter pills
    if (DOM.filterContainer) {
        DOM.filterContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.filter-pill');
            if (pill) {
                filterByCategory(pill.dataset.category);
            }
        });
    }
    
    // Mobile menu
    if (DOM.hamburger) {
        DOM.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (DOM.navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Theme toggle
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Back to top
    if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', scrollToTop);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (DOM.navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.hamburger')) {
            toggleMobileMenu();
        }
    });
}

// =============================================
// UI HELPERS
// =============================================
function toggleMobileMenu() {
    DOM.hamburger.classList.toggle('active');
    DOM.navMenu.classList.toggle('active');
    document.body.style.overflow = DOM.navMenu.classList.contains('active') ? 'hidden' : '';
}

function handleScroll() {
    // Navbar effect
    if (window.scrollY > 50) {
        DOM.navbar?.classList.add('scrolled');
    } else {
        DOM.navbar?.classList.remove('scrolled');
    }
    
    // Back to top visibility
    if (window.scrollY > 500) {
        DOM.backToTop?.classList.add('visible');
    } else {
        DOM.backToTop?.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        DOM.searchBox?.focus();
    }
    
    // Escape: Clear search
    if (e.key === 'Escape' && document.activeElement === DOM.searchBox) {
        DOM.searchBox.value = '';
        state.searchQuery = '';
        filterAndSearch();
        DOM.searchBox.blur();
    }
}

// =============================================
// INTERSECTION OBSERVER
// =============================================
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.tool-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

// =============================================
// STATS ANIMATION
// =============================================
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                let current = 0;
                const increment = countTo / 50;
                const duration = 1500;
                const stepTime = duration / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= countTo) {
                        target.textContent = countTo + (target.textContent.includes('%') ? '%' : '+');
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current) + (target.textContent.includes('%') ? '%' : '+');
                    }
                }, stepTime);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// =============================================
// UTILITY FUNCTIONS
// =============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =============================================
// PARTICLES EFFECT
// =============================================
function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.prepend(container);
    
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--accent-1);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.3};
            animation: float ${3 + Math.random() * 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        
        container.appendChild(particle);
    }
}

// =============================================
// INITIALIZE APP
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    init();
    createParticles();
    
    // Log welcome message
    console.log('%c🛠️ ReboArt Tools %cReady!', 
        'font-size: 1.2em; font-weight: bold; color: #6366f1;',
        'color: #94a3b8;');
    console.log('%c💡 Tip: Gunakan Ctrl+K untuk mencari tools', 'color: #94a3b8;');
});
