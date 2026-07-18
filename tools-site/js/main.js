// ===== MODERN JAVASCRIPT UNTUK TOOLS.REBOART.NET =====

// Data Tools
const tools = [
    {
        id: 1,
        name: "JSON Formatter",
        description: "Format & validasi JSON dengan tree view interaktif",
        icon: "fa-brands fa-js",
        category: "Developer",
        url: "#",
        featured: true
    },
    {
        id: 2,
        name: "Base64 Encoder",
        description: "Encode & decode teks, gambar ke Base64",
        icon: "fa-solid fa-shield-halved",
        category: "Converter",
        url: "#",
        featured: true
    },
    {
        id: 3,
        name: "Color Palette Generator",
        description: "Generate palet warna harmonis dengan AI",
        icon: "fa-solid fa-palette",
        category: "Design",
        url: "#",
        featured: true
    },
    {
        id: 4,
        name: "Password Generator",
        description: "Generate password aman dengan kustomisasi",
        icon: "fa-solid fa-key",
        category: "Security",
        url: "#",
        featured: false
    },
    {
        id: 5,
        name: "Markdown Editor",
        description: "Live preview markdown dengan syntax highlighting",
        icon: "fa-brands fa-markdown",
        category: "Developer",
        url: "#",
        featured: true
    },
    {
        id: 6,
        name: "QR Code Generator",
        description: "Generate QR code kustom dengan logo & warna",
        icon: "fa-solid fa-qrcode",
        category: "Generator",
        url: "#",
        featured: false
    },
    {
        id: 7,
        name: "Image Compressor",
        description: "Kompres gambar tanpa kehilangan kualitas",
        icon: "fa-solid fa-image",
        category: "Image",
        url: "#",
        featured: false
    },
    {
        id: 8,
        name: "URL Shortener",
        description: "Perpendek URL panjang dengan custom alias",
        icon: "fa-solid fa-link",
        category: "Utility",
        url: "#",
        featured: false
    },
    {
        id: 9,
        name: "Code Formatter",
        description: "Format HTML, CSS, JavaScript otomatis",
        icon: "fa-solid fa-code",
        category: "Developer",
        url: "#",
        featured: true
    },
    {
        id: 10,
        name: "Text Diff Checker",
        description: "Bandingkan teks dengan highlight perbedaan",
        icon: "fa-solid fa-not-equal",
        category: "Utility",
        url: "#",
        featured: false
    },
    {
        id: 11,
        name: "UUID Generator",
        description: "Generate UUID v4 & v5 secara batch",
        icon: "fa-solid fa-fingerprint",
        category: "Generator",
        url: "#",
        featured: false
    },
    {
        id: 12,
        name: "Regex Tester",
        description: "Test & debug regular expression real-time",
        icon: "fa-solid fa-magnifying-glass",
        category: "Developer",
        url: "#",
        featured: false
    }
];

// Categories
const categories = ['All', 'Developer', 'Converter', 'Design', 'Security', 'Generator', 'Image', 'Utility'];

// State Management
const state = {
    currentFilter: 'All',
    searchQuery: '',
    isDarkMode: true
};

// DOM Elements
const toolsGrid = document.getElementById('toolsGrid');
const searchBox = document.getElementById('searchTool');
const filterContainer = document.getElementById('filterContainer');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize
function init() {
    renderFilters();
    renderTools(tools);
    setupEventListeners();
    animateOnScroll();
}

// Render Filter Pills
function renderFilters() {
    filterContainer.innerHTML = categories.map(cat => `
        <button class="filter-pill ${cat === 'All' ? 'active' : ''}" 
                data-category="${cat}"
                onclick="filterByCategory('${cat}')">
            ${cat}
        </button>
    `).join('');
}

// Render Tools
function renderTools(toolsToRender) {
    if (toolsToRender.length === 0) {
        toolsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--text-secondary);"></i>
                <h3 style="margin-top: 1rem;">No tools found</h3>
                <p style="color: var(--text-secondary);">Try different keywords</p>
            </div>
        `;
        return;
    }

    toolsGrid.innerHTML = toolsToRender.map(tool => `
        <div class="tool-card" data-category="${tool.category}" data-aos="fade-up">
            <div class="tool-icon-wrapper">
                <i class="${tool.icon}"></i>
            </div>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <div class="tool-footer">
                <span class="tool-category">${tool.category}</span>
                <a href="${tool.url}" class="tool-action">
                    Buka Tool <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
}

// Filter by Category
function filterByCategory(category) {
    state.currentFilter = category;
    
    // Update active state
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === category);
    });
    
    filterAndSearch();
}

// Filter and Search
function filterAndSearch() {
    let filtered = tools;
    
    // Filter by category
    if (state.currentFilter !== 'All') {
        filtered = filtered.filter(tool => tool.category === state.currentFilter);
    }
    
    // Filter by search
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(tool => 
            tool.name.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.category.toLowerCase().includes(query)
        );
    }
    
    renderTools(filtered);
}

// Setup Event Listeners
function setupEventListeners() {
    // Search with debounce
    searchBox.addEventListener('input', debounce((e) => {
        state.searchQuery = e.target.value;
        filterAndSearch();
    }, 300));
    
    // Mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu on click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchBox.focus();
        }
    });
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.tool-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

// Utility Functions
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

// Animate on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Particle effect (optional)
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--accent-primary);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5};
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

createParticles();
